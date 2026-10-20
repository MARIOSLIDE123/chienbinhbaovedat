import React, { useState, useEffect, useRef } from 'react';
import { Question, StudentProfile, QuizAttempt } from '../../types';
import { OFFICIAL_QUESTIONS } from '../../data/questions';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { playCorrectSound, playIncorrectSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
  Send,
} from 'lucide-react';

interface QuizArenaProps {
  profile: StudentProfile;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onGoToLeaderboard: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  profile,
  onFinishQuiz,
  onGoToLeaderboard,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'submitting' | 'result'>('intro');
  const [questions, setQuestions] = useState<Question[]>(OFFICIAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes = 600 seconds
  const [startTime, setStartTime] = useState<number>(0);
  const [isSubmittingScore, setIsSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [finalAttempt, setFinalAttempt] = useState<QuizAttempt | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start the official quiz
  const handleStartQuiz = () => {
    const shuffledQuestions = [...OFFICIAL_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setConfirmedAnswers({});
    setTimeLeft(600);
    setStartTime(Date.now());
    setSubmitError('');
    setFinalAttempt(null);
    setGameState('playing');
  };

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleTimeOut = () => {
    submitQuizToServer(true);
  };

  const currentQ = questions[currentIndex];
  const isCurrentConfirmed = confirmedAnswers[currentQ?.id];
  const currentSelection = selectedAnswers[currentQ?.id];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isCurrentConfirmed) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: key }));
  };

  const handleConfirmAnswer = () => {
    if (!currentSelection || isCurrentConfirmed) return;

    setConfirmedAnswers((prev) => ({ ...prev, [currentQ.id]: true }));

    // Celebration and sound effects
    if (currentSelection === currentQ.correctOption) {
      playCorrectSound();
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } else {
      playIncorrectSound();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitQuizToServer(false);
    }
  };

  const submitQuizToServer = async (timedOut: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmittingScore(true);
    setSubmitError('');
    setGameState('submitting');

    const durationSeconds = Math.max(1, Math.min(600, Math.round((Date.now() - startTime) / 1000)));
    const startedAt = new Date(startTime).toISOString();
    const submittedAt = new Date().toISOString();
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const payload = {
      attemptId,
      studentProfile: profile,
      answers: Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
      durationSeconds,
      startedAt,
      submittedAt,
      isTimeout: timedOut,
    };

    try {
      let attemptResult: QuizAttempt | null = null;
      try {
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.attempt) {
            attemptResult = result.attempt;
          }
        }
      } catch (apiErr) {
        console.warn('API /api/score không phản hồi, tự động chuyển chế độ chấm điểm trực tiếp:', apiErr);
      }

      if (!attemptResult) {
        // Direct backup post to Google Apps Script Web App
        try {
          fetch(
            'https://script.google.com/macros/s/AKfycbzO0Oo2mYzpWuk6mfaQNPu3XlKGqDBJzKaLpLpHS0bj5h4oxuDQSHSjBNaDpDN1SXo1/exec',
            {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          );
        } catch {}

        const fallbackCorrect = Object.entries(selectedAnswers).filter(([qid, choice]) => {
          const q = OFFICIAL_QUESTIONS.find((item) => item.id === qid);
          return q && q.correctOption === choice;
        }).length;

        const fallbackScore = fallbackCorrect * 10;
        attemptResult = {
          attemptId,
          studentName: profile.fullName,
          displayName: profile.useAbbreviatedName
            ? profile.fullName
                .split(' ')
                .map((w, i, arr) => (i < arr.length - 1 ? `${w[0]}.` : w))
                .join(' ')
            : profile.fullName,
          className: profile.className,
          schoolName: profile.schoolName,
          province: profile.province,
          score: fallbackScore,
          totalCorrect: fallbackCorrect,
          totalQuestions: 20,
          durationSeconds,
          startedAt,
          submittedAt,
          answersSummary: selectedAnswers,
          status: timedOut ? 'timeout' : 'completed',
        };
      }

      setFinalAttempt(attemptResult);
      onFinishQuiz(attemptResult);
      setGameState('result');

      if (attemptResult.score >= 140) {
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {}
      }
    } catch (err: any) {
      console.error('Lỗi gửi kết quả lên máy chủ:', err);
      setSubmitError('Có lỗi xảy ra khi lưu kết quả bài thi. Vui lòng thử lại!');
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getBadgeDetails = (score: number) => {
    if (score >= 180) {
      return {
        title: 'CHIẾN BINH BẢO VỆ ĐẤT XUẤT SẮC',
        color: 'text-amber-700 bg-amber-50 border-amber-300',
        icon: '🌟',
        caption: 'Tuyệt đỉnh! Em đã nắm vững toàn bộ kiến thức bảo vệ môi trường đất!',
      };
    }
    if (score >= 140) {
      return {
        title: 'CHUYÊN GIA ĐẤT XANH',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
        icon: '🌿',
        caption: 'Rất giỏi! Em đã hiểu rõ nguyên nhân và các biện pháp bảo vệ đất!',
      };
    }
    if (score >= 100) {
      return {
        title: 'NGƯỜI BẠN CỦA TRÁI ĐẤT',
        color: 'text-blue-700 bg-blue-50 border-blue-300',
        icon: '🌍',
        caption: 'Khá tốt! Em đã biết cách phân loại rác và hành động vì màu xanh của đất!',
      };
    }
    return {
      title: 'MẦM XANH ĐANG LỚN',
      color: 'text-slate-700 bg-slate-50 border-slate-300',
      icon: '🌱',
      caption: 'Hãy ôn lại bài học và thử sức lại nhé, em sẽ tiến bộ rất nhanh!',
    };
  };

  // =========================================================================
  // 1. INTRO SCREEN (Single Screen Fit)
  // =========================================================================
  if (gameState === 'intro') {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 max-w-xl mx-auto shadow-sm space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-rose-50 text-rose-700 rounded-full text-xs font-black border border-rose-200">
            <Trophy className="w-3.5 h-3.5 text-rose-600" />
            <span>Đấu Trường Trí Tuệ 20 Câu</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#20352B]">
            CHIẾN BINH BẢO VỆ ĐẤT
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            20 câu hỏi tính giờ 10 phút · Ghi danh Bảng Vàng toàn quốc
          </p>
        </div>

        {/* Mascot Greeting */}
        <div className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl border border-emerald-100">
          <div className="shrink-0">
            <CaptainEarth mood="cheer" size="sm" showSpeechBubble={false} />
          </div>
          <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-snug">
            Chào {profile.fullName.split(' ').slice(-1)[0]}! Hãy đọc kỹ câu hỏi và bấm xác nhận đáp án nhé. Chúc em đạt 200 điểm tối đa!
          </p>
        </div>

        {/* 4 Stat Badges */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-base sm:text-lg font-black text-emerald-700 block">20</span>
            <span className="text-[10px] font-bold text-slate-600">Câu hỏi</span>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-base sm:text-lg font-black text-blue-700 block">10p</span>
            <span className="text-[10px] font-bold text-slate-600">Thời gian</span>
          </div>
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-base sm:text-lg font-black text-amber-700 block">200</span>
            <span className="text-[10px] font-bold text-slate-600">Điểm max</span>
          </div>
          <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-base sm:text-lg font-black text-purple-700 block">4 cấp</span>
            <span className="text-[10px] font-bold text-slate-600">Huy hiệu</span>
          </div>
        </div>

        {/* Compact Rules */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1 font-medium">
          <p>• Mỗi câu đúng được <strong>10 điểm</strong>. Không bị trừ điểm khi chọn sai.</p>
          <p>• Bảng xếp hạng ưu tiên <strong>điểm cao hơn</strong>, kế tiếp là <strong>thời gian ngắn hơn</strong>.</p>
        </div>

        {/* Start button */}
        <button
          type="button"
          onClick={handleStartQuiz}
          className="w-full py-3 px-5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:brightness-105 active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-2xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>BẮT ĐẦU THI NGAY</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // =========================================================================
  // 2. SUBMITTING SCREEN
  // =========================================================================
  if (gameState === 'submitting') {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 max-w-md mx-auto text-center space-y-3 shadow-md my-8">
        <div className="w-12 h-12 mx-auto border-4 border-[#22B573] border-t-transparent rounded-full animate-spin" />
        <h2 className="text-lg font-black text-[#20352B]">
          Đang Xác Nhận Kết Quả...
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Đang ghi nhận điểm và đồng bộ Bảng Vàng Google Sheets. Vui lòng chờ trong giây lát!
        </p>
      </div>
    );
  }

  // =========================================================================
  // 3. RESULT SCREEN (Compact Certificate Card)
  // =========================================================================
  if (gameState === 'result' && finalAttempt) {
    const badge = getBadgeDetails(finalAttempt.score);

    return (
      <div className="bg-white border-2 border-emerald-300 rounded-3xl p-4 sm:p-6 max-w-lg mx-auto shadow-xl space-y-3.5 my-2">
        {/* Certificate Header */}
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl">{badge.icon}</div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#22B573] block">
            CHỨNG NHẬN CHIẾN BINH NHÍ
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#20352B]">
            {profile.fullName}
          </h2>
          <p className="text-[11px] text-slate-500 font-bold">
            Lớp {profile.className} · {profile.schoolName}
          </p>
        </div>

        {/* Badge Card */}
        <div className={`p-2.5 rounded-2xl border text-center space-y-0.5 ${badge.color}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider block">Danh hiệu đạt được:</span>
          <h3 className="text-sm sm:text-base font-black">{badge.title}</h3>
          <p className="text-[11px] font-medium">{badge.caption}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-lg sm:text-xl font-black text-emerald-700 block">
              {finalAttempt.score}
              <span className="text-xs font-normal text-slate-500">/200</span>
            </span>
            <span className="text-[10px] font-bold text-slate-600">Tổng điểm</span>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-lg sm:text-xl font-black text-blue-700 block">
              {finalAttempt.totalCorrect}
              <span className="text-xs font-normal text-slate-500">/20</span>
            </span>
            <span className="text-[10px] font-bold text-slate-600">Số câu đúng</span>
          </div>
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-lg sm:text-xl font-black text-amber-700 block">
              {formatTime(finalAttempt.durationSeconds)}
            </span>
            <span className="text-[10px] font-bold text-slate-600">Thời gian</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleStartQuiz}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thi lại</span>
          </button>
          <button
            type="button"
            onClick={onGoToLeaderboard}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#22B573] hover:bg-[#1caa68] font-black text-xs text-white flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Xem Bảng Vàng</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. PLAYING SCREEN (Designed to fit 100% on one screen without scrolling)
  // =========================================================================
  const isCorrect = currentSelection === currentQ?.correctOption;
  const currentScore = Object.entries(selectedAnswers).filter(([qid, choice]) => {
    const q = OFFICIAL_QUESTIONS.find((item) => item.id === qid);
    return q && q.correctOption === choice;
  }).length * 10;

  return (
    <div className="w-full flex flex-col justify-between space-y-2.5 select-none">
      {/* 4.1 Top Bar: Progress, Timer, and Current Score */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-2.5 sm:p-3 shadow-2xs flex items-center justify-between gap-3 shrink-0">
        {/* Question Counter + Progress */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#22B573] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            {currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-[#20352B]">
                Câu {currentIndex + 1} / {questions.length}
              </span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                  currentQ?.difficulty === 'easy'
                    ? 'bg-emerald-50 text-emerald-800'
                    : currentQ?.difficulty === 'medium'
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
              >
                {currentQ?.difficulty === 'easy' ? 'Cơ bản' : currentQ?.difficulty === 'medium' ? 'Trung bình' : 'Nâng cao'}
              </span>
            </div>
            {/* Slim progress line */}
            <div className="w-24 sm:w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#22B573] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Score Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-black">
          <span>⭐</span>
          <span>Điểm: {currentScore}</span>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-mono font-black text-xs sm:text-sm ${
            timeLeft < 120
              ? 'border-rose-400 bg-rose-50 text-rose-600 animate-pulse'
              : 'border-amber-300 bg-amber-50 text-amber-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* 4.2 Main Question Box */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-3 sm:p-4 shadow-2xs">
        <h3 className="text-sm sm:text-base font-bold text-[#20352B] leading-relaxed">
          {currentQ?.question}
        </h3>
      </div>

      {/* 4.3 4 Multiple Choice Options (2x2 Grid fits neatly on 1 screen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {currentQ?.options.map((opt) => {
          const isSelected = currentSelection === opt.key;
          let style = 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800';

          if (isCurrentConfirmed) {
            if (opt.key === currentQ.correctOption) {
              style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black shadow-2xs ring-1 ring-emerald-400';
            } else if (isSelected) {
              style = 'border-rose-300 bg-rose-50 text-rose-900';
            } else {
              style = 'border-slate-200 bg-white opacity-40';
            }
          } else if (isSelected) {
            style = 'border-[#22B573] bg-emerald-50 text-[#20352B] ring-2 ring-emerald-200 font-bold';
          }

          return (
            <button
              key={opt.key}
              type="button"
              disabled={isCurrentConfirmed}
              onClick={() => handleSelectOption(opt.key)}
              className={`p-2.5 sm:p-3 rounded-xl border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${style}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#22B573] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </div>

              {isCurrentConfirmed && opt.key === currentQ.correctOption && (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              {isCurrentConfirmed && isSelected && opt.key !== currentQ.correctOption && (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4.4 Feedback & Action Bottom Bar (Reserved height prevents layout jump) */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-2.5 sm:p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
        {/* Left side: Explanation or status hint */}
        <div className="flex-1 w-full sm:w-auto">
          {isCurrentConfirmed ? (
            <div
              className={`p-2 rounded-xl text-xs flex items-center gap-2 ${
                isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'
              }`}
            >
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <div className="line-clamp-2 leading-tight">
                <strong className="mr-1">{isCorrect ? 'Chính xác (+10đ)!' : 'Chưa đúng rồi!'}</strong>
                <span>{currentQ.explanation}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-semibold px-1 hidden sm:block">
              {currentSelection ? 'Bấm "Xác nhận đáp án" để kiểm tra kết quả' : 'Chọn 1 đáp án A, B, C hoặc D'}
            </div>
          )}
        </div>

        {/* Right side: Action button */}
        <div className="w-full sm:w-auto shrink-0">
          {!isCurrentConfirmed ? (
            <button
              type="button"
              disabled={!currentSelection}
              onClick={handleConfirmAnswer}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#22B573] hover:bg-[#1caa68] disabled:opacity-40 disabled:pointer-events-none text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Xác nhận đáp án</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 animate-pulse"
            >
              <span>{currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Nộp bài & Hoàn thành'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
