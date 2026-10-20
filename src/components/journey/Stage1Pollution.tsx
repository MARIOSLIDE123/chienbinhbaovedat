import React, { useState } from 'react';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { STAGE_1_QUESTIONS, STAGE_1_DETECTIVE_SCENARIOS } from '../../data/journeyData';
import { soundEffects } from '../../utils/soundEffects';
import { ImageZoomModal } from '../common/ImageZoomModal';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ZoomIn,
  Award,
} from 'lucide-react';

interface Stage1PollutionProps {
  onCompleteStage: (score: number) => void;
  onGoToNextStage: () => void;
}

export const Stage1Pollution: React.FC<Stage1PollutionProps> = ({
  onCompleteStage,
  onGoToNextStage,
}) => {
  // Sub-tabs within Stage 1: 'knowledge' -> 'detective' -> 'quiz'
  const [activeStep, setActiveStep] = useState<'knowledge' | 'detective' | 'quiz'>('knowledge');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Detective game state
  const [detectiveAnswers, setDetectiveAnswers] = useState<Record<string, string>>({});
  const [detectiveFeedback, setDetectiveFeedback] = useState<Record<string, boolean>>({});

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleDetectiveChoice = (scenarioId: string, choiceType: string, correctType: string) => {
    const isCorrect = choiceType === correctType;
    setDetectiveAnswers((prev) => ({ ...prev, [scenarioId]: choiceType }));
    setDetectiveFeedback((prev) => ({ ...prev, [scenarioId]: isCorrect }));

    if (isCorrect) {
      soundEffects.playCorrect();
    } else {
      soundEffects.playIncorrect();
    }
  };

  const handleSelectQuizOption = (questionId: string, optionKey: string) => {
    if (isSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    STAGE_1_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);

    if (correctCount >= 3) {
      soundEffects.playCorrect();
    } else {
      soundEffects.playIncorrect();
    }

    onCompleteStage(correctCount);
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setIsSubmitted(false);
    setCurrentQIndex(0);
  };

  return (
    <div className="w-full space-y-4 pb-8">
      {/* 1. Header Banner with Captain Earth */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border-2 border-orange-200 rounded-3xl p-4 sm:p-5 shadow-xs">
        <CaptainEarth
          mood={isSubmitted && score >= 4 ? 'winner' : activeStep === 'quiz' ? 'thinking' : 'greeting'}
          message="Các bạn có biết vì sao một vùng đất xanh tươi lại có thể trở nên ô nhiễm không? Hãy cùng mình khám phá nhé!"
          size="sm"
        />
      </div>

      {/* Step Navigation Pill */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-2xs overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveStep('knowledge')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'knowledge'
              ? 'bg-[#FF944D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📖 1. Khám Phá Kiến Thức</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('detective')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'detective'
              ? 'bg-[#FF944D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🔍 2. Thám Tử Tìm Nguyên Nhân</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('quiz')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'quiz'
              ? 'bg-[#FF944D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>⭐ 3. Kiểm Tra Củng Cố</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SUB-STEP 1: KHÁM PHÁ KIẾN THỨC THEO SGK                               */}
      {/* ===================================================================== */}
      {activeStep === 'knowledge' && (
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF944D] block">
                CHẶNG 1: GIẢI MÃ Ô NHIỄM ĐẤT
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Bí Mật Của Đất: Nguyên Nhân & Tác Hại Của Ô Nhiễm Đất
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('detective')}
              className="px-4 py-2 bg-[#FF944D] hover:bg-[#e8813a] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <span>Vào Thử Thách</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real world Photo & Zoom */}
          <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center gap-4">
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative group w-full md:w-5/12 aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs border border-orange-200 shrink-0"
            >
              <img
                src="/images/lesson-1-soil-pollution.png"
                alt="Pin phế thải chôn lấp gây ô nhiễm đất"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-bold">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kính lúp phóng to</span>
                </span>
              </div>
            </div>

            <div className="w-full md:w-7/12 space-y-2">
              <span className="text-xs font-black text-orange-950 block">
                📸 Quan sát ảnh thực tế: Pin cũ & rác điện tử bị vùi lấp độc hại
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/90 p-3 rounded-xl border border-orange-100">
                Khi pin cũ bị gỉ sét, các kim loại nặng như chì, thủy ngân, cadimi tan ra ngấm sâu vào đất mùn, hủy hoại vi sinh vật và làm nhiễm độc nguồn nước ngầm sinh hoạt của con người.
              </p>
            </div>
          </div>

          {/* Structured Knowledge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Nguyên nhân con người */}
            <div className="p-3.5 bg-orange-50/40 border border-orange-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-orange-950 text-xs sm:text-sm">
                <span>⚠️</span>
                <span>Nguyên nhân do con người</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• Xả chất thải công nghiệp & sinh hoạt chưa xử lý ra đất.</li>
                <li>• Lạm dụng phân bón hóa học nhiều năm làm đất chai cứng.</li>
                <li>• Phun thuốc bảo vệ thực vật sai quy định nồng độ.</li>
                <li>• Chôn lấp túi nilon, rác khó phân hủy bừa bãi.</li>
              </ul>
            </div>

            {/* Nguyên nhân tự nhiên */}
            <div className="p-3.5 bg-blue-50/40 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-blue-950 text-xs sm:text-sm">
                <span>🌋</span>
                <span>Nguyên nhân tự nhiên</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• Núi lửa phun trào mang theo tro bụi khoáng độc hại.</li>
                <li>• Nước biển dâng gây xâm nhập mặn nội đồng.</li>
                <li>• Đất bị nhiễm phèn chua, khô hạn kéo dài.</li>
              </ul>
            </div>

            {/* Tác hại & Biện pháp */}
            <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-emerald-950 text-xs sm:text-sm">
                <span>🛡️</span>
                <span>Tác hại & Phòng chống</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• Cây còi cọc, giun đất chết, chất độc ngấm nước ngầm.</li>
                <li>• Biện pháp: Phân loại rác, bón phân hữu cơ vi sinh, xử lý nước thải trước khi xả ra môi trường.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-STEP 2: HOẠT ĐỘNG TƯƠNG TÁC: THÁM TỬ TÌM NGUYÊN NHÂN             */}
      {/* ===================================================================== */}
      {activeStep === 'detective' && (
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF944D] block">
                THỬ THÁCH TƯƠNG TÁC
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Thám Tử Tìm Nguyên Nhân Ô Nhiễm Đất
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Quan sát từng hình ảnh và phân loại: Nguyên nhân con người / Tự nhiên / Biện pháp bảo vệ đất!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('quiz')}
              className="px-4 py-2 bg-[#22B573] hover:bg-[#1caa68] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <span>Làm Bài Kiểm Tra</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {STAGE_1_DETECTIVE_SCENARIOS.map((sc) => {
              const userChoice = detectiveAnswers[sc.id];
              const isCorrect = detectiveFeedback[sc.id];

              return (
                <div
                  key={sc.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      {sc.image}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-[#20352B] leading-snug">
                      {sc.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleDetectiveChoice(sc.id, 'human', sc.type)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                        userChoice === 'human'
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                            : 'bg-rose-100 border-rose-400 text-rose-950'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      Do con người
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDetectiveChoice(sc.id, 'nature', sc.type)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                        userChoice === 'nature'
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                            : 'bg-rose-100 border-rose-400 text-rose-950'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      Do tự nhiên
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDetectiveChoice(sc.id, 'solution', sc.type)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                        userChoice === 'solution'
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                            : 'bg-rose-100 border-rose-400 text-rose-950'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      Biện pháp
                    </button>
                  </div>

                  {userChoice && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? '✓ Chính xác! ' : '✕ Chưa đúng rồi! '}
                      {sc.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-STEP 3: 5 CÂU HỎI KIỂM TRA CỦNG CỐ                                */}
      {/* ===================================================================== */}
      {activeStep === 'quiz' && (
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF944D] block">
                BÀI KIỂM TRA CỦNG CỐ CHẶNG 1
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Thử Thách: 5 Câu Hỏi Thám Tử Đất Xanh
              </h2>
            </div>
            {isSubmitted && (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-black">
                Kết quả: {score}/5 câu đúng
              </span>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {STAGE_1_QUESTIONS.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];
              return (
                <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-[#20352B] leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isChosen = selectedOpt === opt.key;
                      let style = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';

                      if (isSubmitted) {
                        if (opt.key === q.correctOption) {
                          style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black';
                        } else if (isChosen) {
                          style = 'bg-rose-100 border-rose-400 text-rose-900';
                        } else {
                          style = 'bg-white border-slate-200 opacity-50';
                        }
                      } else if (isChosen) {
                        style = 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-200 font-bold';
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectQuizOption(q.id, opt.key)}
                          className={`p-2.5 rounded-xl border-2 text-left text-xs transition-all flex items-center gap-2 ${style}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center shrink-0">
                            {opt.key}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="p-2 bg-amber-50 rounded-xl text-[11px] font-medium text-amber-950 border border-amber-200">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < 5}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#FF944D] hover:bg-[#e8813a] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-xs transition-colors"
              >
                NỘP BÀI KIỂM TRA CHẶNG 1
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>
                    {score >= 4
                      ? '🏅 Xuất sắc! Nhận huy hiệu THÁM TỬ ĐẤT XANH'
                      : 'Đã hoàn thành Chặng 1! Hãy tiếp tục rèn luyện'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRetryQuiz}
                    className="px-3.5 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại</span>
                  </button>
                  <button
                    type="button"
                    onClick={onGoToNextStage}
                    className="px-5 py-2 bg-[#22B573] hover:bg-[#1caa68] text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Sang Chặng 2: Xói Mòn Sườn Đồi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageSrc="/images/lesson-1-soil-pollution.png"
        imageAlt="Pin phế thải gây ô nhiễm đất"
        caption="Pin cũ và rác điện tử chôn lấp độc hại trong lòng đất"
        observationTip="Khi vỏ pin bị gỉ sét, các kim loại nặng cực độc (như chì, thủy ngân, cadimi) sẽ ngấm sâu vào tầng đất mùn và hủy hoại nguồn nước ngầm!"
      />
    </div>
  );
};
