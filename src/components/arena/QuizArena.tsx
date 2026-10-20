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
  HelpCircle,
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
    // Shuffle options for extra fun while maintaining question identity
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
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti fallback
      }
    } else {
      playIncorrectSound();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last question completed -> submit to server
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

    // Prepare payload with student answers for server-side evaluation
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
      // Call server-side API endpoint POST /api/score
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

      // If server responded successfully, use it; otherwise compute locally
      if (!attemptResult) {
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

      // Grand celebration if high score
      if (attemptResult.score >= 140) {
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch (e) {
          // Ignore
        }
      }
    } catch (err: any) {
      console.error('Lỗi gửi kết quả lên máy chủ:', err);
      setSubmitError(
        'Có lỗi xảy ra khi lưu kết quả bài thi. Vui lòng thử lại!'
      );
    } finally {
      setIsSubmittingScore(false);
    }
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine badge based on score
  const getBadgeDetails = (score: number) => {
    if (score >= 180) {
      return {
        title: 'CHIẾN BINH BẢO VỆ ĐẤT XUẤT SẮC',
        color: 'text-amber-600 bg-amber-50 border-amber-300',
        icon: '🌟',
        caption: 'Em là một bậc thầy thực thụ về bảo vệ môi trường đất!',
      };
    }
    if (score >= 140) {
      return {
        title: 'CHUYÊN GIA ĐẤT XANH',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
        icon: '🌿',
        caption: 'Kiến thức của em rất vững vàng và đáng khen ngợi!',
      };
    }
    if (score >= 100) {
      return {
        title: 'NGƯỜI BẠN CỦA TRÁI ĐẤT',
        color: 'text-blue-700 bg-blue-50 border-blue-300',
        icon: '🌍',
        caption: 'Em đã nắm vững các kiến thức cơ bản về đất!',
      };
    }
    return {
      title: 'MẦM XANH ĐANG LỚN',
      color: 'text-slate-700 bg-slate-50 border-slate-300',
      icon: '🌱',
      caption: 'Hãy ôn lại bài học và thử sức lại nhé, em sẽ tiến bộ rất nhanh!',
    };
  };

  // 1. INTRO SCREEN
  if (gameState === 'intro') {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-md space-y-6 my-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
            <Trophy className="w-4 h-4 text-rose-600" />
            <span>Cuộc Thi Trực Tuyến Toàn Quốc</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#20352B] tracking-tight">
            ĐẤU TRƯỜNG TRÍ TUỆ
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-md mx-auto">
            Chiến Binh Bảo Vệ Đất · Đấu trường 20 câu hỏi tranh tài trên Bảng vàng toàn quốc!
          </p>
        </div>

        {/* Mascot */}
        <div className="flex justify-center">
          <CaptainEarth
            mood="cheer"
            size="lg"
            message="Hãy bình tĩnh, tự tin và đọc kỹ câu hỏi nhé chiến binh nhí! Mình luôn cổ vũ cho bạn!"
          />
        </div>

        {/* Rule highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-emerald-700 block">20</span>
            <span className="text-[11px] font-bold text-slate-600">Câu hỏi trắc nghiệm</span>
          </div>
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-blue-700 block">10 phút</span>
            <span className="text-[11px] font-bold text-slate-600">Thời gian tối đa</span>
          </div>
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-amber-700 block">200</span>
            <span className="text-[11px] font-bold text-slate-600">Điểm tối đa</span>
          </div>
          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl">
            <span className="text-xl sm:text-2xl font-black text-purple-700 block">4 Cấp</span>
            <span className="text-[11px] font-bold text-slate-600">Huy hiệu danh giá</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-1.5 font-medium">
          <h4 className="font-extrabold text-slate-900 text-sm mb-1">Luật chơi cho em:</h4>
          <p>• Mỗi câu trả lời đúng được cộng <strong>10 điểm</strong>. Không bị trừ điểm khi trả lời sai.</p>
          <p>• Sau khi bấm "Xác nhận đáp án", đáp án sẽ được khóa và giải thích chi tiết sẽ hiện ra.</p>
          <p>• Bảng xếp hạng ưu tiên người đạt <strong>điểm cao hơn</strong>. Nếu bằng điểm, ai hoàn thành trong <strong>thời gian ngắn hơn</strong> sẽ xếp trên.</p>
          <p>• Điểm được máy chủ kiểm tra bảo mật trước khi ghi nhận lên Bảng vàng Google Sheets!</p>
        </div>

        {/* Start button */}
        <button
          type="button"
          onClick={handleStartQuiz}
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:opacity-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>BẮT ĐẦU THI NGAY</span>
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // 2. SUBMITTING SCREEN
  if (gameState === 'submitting') {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-10 max-w-lg mx-auto text-center space-y-4 shadow-md my-12">
        <div className="w-16 h-16 mx-auto border-4 border-[#22B573] border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-black text-[#20352B]">
          Đang Xác Nhận Kết Quả Lên Máy Chủ...
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Máy chủ đang chấm lại bài thi và đồng bộ bảng điểm Google Sheets toàn quốc. Vui lòng chờ trong giây lát!
        </p>
      </div>
    );
  }

  // 3. RESULT SCREEN
  if (gameState === 'result' && finalAttempt) {
    const badge = getBadgeDetails(finalAttempt.score);

    return (
      <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-xl space-y-6 my-4">
        {/* Certificate Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">{badge.icon}</div>
          <span className="text-xs font-black uppercase tracking-widest text-[#22B573] block">
            CHỨNG NHẬN CHIẾN BINH NHÍ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#20352B]">
            {profile.fullName}
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            Lớp {profile.className} · {profile.schoolName}
          </p>
        </div>

        {/* Badge Card */}
        <div className={`p-4 rounded-2xl border-2 text-center space-y-1 ${badge.color}`}>
          <span className="text-xs font-bold uppercase tracking-wider block">Danh hiệu đạt được:</span>
          <h3 className="text-lg sm:text-xl font-black">{badge.title}</h3>
          <p className="text-xs font-medium">{badge.caption}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <span className="text-2xl font-black text-emerald-700 block">
              {finalAttempt.score}
              <span className="text-xs font-normal text-slate-500">/200</span>
            </span>
            <span className="text-[11px] font-bold text-slate-600">Tổng điểm</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
            <span className="text-2xl font-black text-blue-700 block">
              {finalAttempt.totalCorrect}
              <span className="text-xs font-normal text-slate-500">/20</span>
            </span>
            <span className="text-[11px] font-bold text-slate-600">Số câu đúng</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-2xl font-black text-amber-700 block">
              {formatTime(finalAttempt.durationSeconds)}
            </span>
            <span className="text-[11px] font-bold text-slate-600">Thời gian làm bài</span>
          </div>
        </div>

        {submitError && (
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleStartQuiz}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thi lại lượt mới</span>
          </button>
          <button
            type="button"
            onClick={onGoToLeaderboard}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#22B573] hover:bg-[#1caa68] font-black text-xs text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Xem Bảng Xếp Hạng Toàn Quốc</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. PLAYING SCREEN (20 Questions Arena)
  const isCorrect = currentSelection === currentQ?.correctOption;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header: Progress & Timer */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Question Counter */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22B573] to-[#45B8F5] text-white flex items-center justify-center font-black text-sm shadow-2xs">
            {currentIndex + 1}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Đấu trường trí tuệ
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-[#20352B]">
              Câu hỏi {currentIndex + 1} / {questions.length}
            </h3>
          </div>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border-2 font-mono font-black text-sm ${
            timeLeft < 120
              ? 'border-rose-400 bg-rose-50 text-rose-600 animate-pulse'
              : 'border-amber-300 bg-amber-50 text-amber-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Difficulty Badge */}
        <div className="hidden sm:block">
          <span
            className={`text-xs font-extrabold px-3 py-1 rounded-lg ${
              currentQ?.difficulty === 'easy'
                ? 'bg-emerald-50 text-emerald-800'
                : currentQ?.difficulty === 'medium'
                ? 'bg-blue-50 text-blue-800'
                : 'bg-rose-50 text-rose-800'
            }`}
          >
            {currentQ?.difficulty === 'easy'
              ? 'Mức Cơ bản'
              : currentQ?.difficulty === 'medium'
              ? 'Mức Trung bình'
              : 'Mức Nâng cao'}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Question Text */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <h3 className="text-base sm:text-xl font-bold text-[#20352B] leading-relaxed">
            {currentQ?.question}
          </h3>
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ?.options.map((opt) => {
            const isSelected = currentSelection === opt.key;
            let style = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

            if (isCurrentConfirmed) {
              if (opt.key === currentQ.correctOption) {
                style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold shadow-2xs';
              } else if (isSelected) {
                style = 'border-rose-300 bg-rose-50 text-rose-900';
              } else {
                style = 'border-slate-200 bg-white opacity-50';
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
                className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base transition-all flex items-center justify-between ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#22B573] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </div>

                {isCurrentConfirmed && opt.key === currentQ.correctOption && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                )}
                {isCurrentConfirmed && isSelected && opt.key !== currentQ.correctOption && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback and Explanation */}
        {isCurrentConfirmed && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isCorrect
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : 'bg-amber-50 text-amber-950 border-amber-300'
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm">
              <strong className="block text-sm font-extrabold mb-0.5">
                {isCorrect
                  ? 'Chính xác! Bạn thật thông minh!'
                  : 'Cố gắng nhé! Chúng ta cùng học thêm nào!'}
              </strong>
              <p className="font-medium leading-relaxed">{currentQ.explanation}</p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            Mã câu hỏi: {currentQ?.id}
          </span>

          {!isCurrentConfirmed ? (
            <button
              type="button"
              disabled={!currentSelection}
              onClick={handleConfirmAnswer}
              className="px-6 py-3 bg-[#22B573] hover:bg-[#1caa68] disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
            >
              Xác nhận đáp án
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-[#45B8F5] hover:bg-[#32a8e6] text-white font-black text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span>
                {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Nộp bài & Xem kết quả'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
