import React, { useState } from 'react';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { STAGE_3_QUESTIONS, STAGE_3_GREEN_ACTIONS } from '../../data/journeyData';
import { soundEffects } from '../../utils/soundEffects';
import { ImageZoomModal } from '../common/ImageZoomModal';
import {
  ShieldCheck,
  TreePine,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ZoomIn,
  Award,
} from 'lucide-react';

interface Stage3ProtectionProps {
  onCompleteStage: (score: number) => void;
  onGoToNextStage: () => void;
}

export const Stage3Protection: React.FC<Stage3ProtectionProps> = ({
  onCompleteStage,
  onGoToNextStage,
}) => {
  // Tabs within Stage 3: 'knowledge' -> 'actions' -> 'quiz'
  const [activeStep, setActiveStep] = useState<'knowledge' | 'actions' | 'quiz'>('knowledge');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Actions game state
  const [selectedActions, setSelectedActions] = useState<Record<string, number>>({});

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleActionChoice = (actId: string, optIndex: number, isBest: boolean) => {
    setSelectedActions((prev) => ({ ...prev, [actId]: optIndex }));

    if (isBest) {
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
    STAGE_3_QUESTIONS.forEach((q) => {
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
  };

  return (
    <div className="w-full space-y-4 pb-8">
      {/* 1. Header Banner with Captain Earth */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 shadow-xs">
        <CaptainEarth
          mood={isSubmitted && score >= 4 ? 'winner' : 'greeting'}
          message="Chúng ta đã tìm hiểu nguyên nhân và tác hại. Bây giờ, các bạn hãy cùng mình thực hiện những hành động thiết thực để bảo vệ đất nhé!"
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
              ? 'bg-[#22B573] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📖 1. Biện Pháp Bảo Vệ</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('actions')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'actions'
              ? 'bg-[#22B573] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🌱 2. Chọn Hành Động Xanh</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('quiz')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'quiz'
              ? 'bg-[#22B573] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>⭐ 3. Kiểm Tra Củng Cố</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SUB-STEP 1: KHÁM PHÁ KIẾN THỨC BẢO VỆ ĐẤT SGK                        */}
      {/* ===================================================================== */}
      {activeStep === 'knowledge' && (
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#22B573] block">
                CHẶNG 3: CHUNG TAY BẢO VỆ ĐẤT MẸ
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Các Biện Pháp Thiết Thực Bảo Vệ Môi Trường Đất
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('actions')}
              className="px-4 py-2 bg-[#22B573] hover:bg-[#1caa68] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <span>Vào Thử Thách Hành Động</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Photo with zoom */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center gap-4">
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative group w-full md:w-5/12 aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs border border-emerald-200 shrink-0"
            >
              <img
                src="/images/lesson-3-soil-protection.jpg"
                alt="Học sinh trồng cây phủ xanh bảo vệ đất"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-bold">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kính lúp phóng to ảnh SGK</span>
                </span>
              </div>
            </div>

            <div className="w-full md:w-7/12 space-y-2">
              <span className="text-xs font-black text-emerald-950 block">
                📸 Quan sát ảnh thực tế: Phong trào trồng cây gây rừng & phủ xanh đất
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/90 p-3 rounded-xl border border-emerald-100">
                Học sinh và thầy cô chung tay trồng hoa, chăm sóc vườn cây bồn hoa trường học. Từng nhát cuốc xới đất tơi xốp, từng cây con bén rễ là một chiếc khiên xanh bảo vệ đất mẹ khỏi ô nhiễm và xói mòn.
              </p>
            </div>
          </div>

          {/* 5 Core Protection Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-xl block">♻️</span>
              <h4 className="text-xs font-black text-emerald-950">1. Phân loại rác tại nguồn</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Tách riêng rác tái chế, rác thực phẩm và rác khác để tái sinh vật liệu và giảm thiểu chôn lấp.
              </p>
            </div>

            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-2xl space-y-1">
              <span className="text-xl block">🌱</span>
              <h4 className="text-xs font-black text-teal-950">2. Nông nghiệp an toàn</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Dùng phân chuồng ủ hoai, chế phẩm vi sinh, giảm hóa chất diệt cỏ để giữ giun đất phát triển.
              </p>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-1">
              <span className="text-xl block">🏭</span>
              <h4 className="text-xs font-black text-blue-950">3. Xử lý nước thải</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Nước thải công nghiệp và sinh hoạt phải được lọc sạch kim loại nặng trước khi xả ra sông suối.
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-1">
              <span className="text-xl block">🔋</span>
              <h4 className="text-xs font-black text-amber-950">4. Thu gom rác nguy hại</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Pin cũ, bóng đèn, hóa chất độc hại phải bỏ vào điểm thu gom riêng, tuyệt đối không chôn xuống đất.
              </p>
            </div>

            <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-1">
              <span className="text-xl block">📢</span>
              <h4 className="text-xs font-black text-purple-950">5. Lan tỏa thông điệp xanh</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Tuyên truyền người thân, bạn bè cùng tham gia ngày hội trồng cây và giữ gìn vệ sinh môi trường.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-STEP 2: HOẠT ĐỘNG "CHỌN HÀNH ĐỘNG XANH"                          */}
      {/* ===================================================================== */}
      {activeStep === 'actions' && (
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#22B573] block">
                THỬ THÁCH THỰC HÀNH TÌNH HUỐNG
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Chọn Hành Động Xanh Vì Đất Mẹ
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Đọc các tình huống thực tế và chọn hành động đúng đắn nhất của một Chiến Binh Đất Xanh!
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

          <div className="space-y-3.5">
            {STAGE_3_GREEN_ACTIONS.map((item, idx) => {
              const selectedIdx = selectedActions[item.id];
              return (
                <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-[#20352B] leading-snug">
                      {item.situation}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {item.options.map((opt, oIdx) => {
                      const isChosen = selectedIdx === oIdx;
                      let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';

                      if (isChosen) {
                        if (opt.isBest) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-2xs';
                        } else {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleActionChoice(item.id, oIdx, opt.isBest)}
                          className={`p-2.5 rounded-xl border-2 text-left text-xs transition-all leading-snug ${btnStyle}`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {selectedIdx !== undefined && (
                    <div className="p-2 bg-emerald-50 rounded-xl text-[11px] font-medium text-emerald-950 border border-emerald-200">
                      <strong>Bài học:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-STEP 3: 5 CÂU HỎI KIỂM TRA CỦNG CỐ CHẶNG 3                        */}
      {/* ===================================================================== */}
      {activeStep === 'quiz' && (
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#22B573] block">
                BÀI KIỂM TRA CỦNG CỐ CHẶNG 3
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Thử Thách: 5 Câu Hỏi Sứ Giả Đất Xanh
              </h2>
            </div>
            {isSubmitted && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-black">
                Kết quả: {score}/5 câu đúng
              </span>
            )}
          </div>

          <div className="space-y-4">
            {STAGE_3_QUESTIONS.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];
              return (
                <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
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
                        style = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200 font-bold';
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
                    <div className="p-2 bg-emerald-50 rounded-xl text-[11px] font-medium text-emerald-950 border border-emerald-200">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < 5}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#22B573] hover:bg-[#1caa68] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-xs transition-colors"
              >
                NỘP BÀI KIỂM TRA CHẶNG 3
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>
                    {score >= 4
                      ? '🏅 Xuất sắc! Nhận huy hiệu SỨ GIẢ ĐẤT XANH'
                      : 'Đã hoàn thành Chặng 3! Chuẩn bị sang Chặng 4'}
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
                    <span>Sang Chặng 4: Thử Tài Phân Loại Rác Gia Đình</span>
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
        imageSrc="/images/lesson-3-soil-protection.jpg"
        imageAlt="Trồng cây bảo vệ đất"
        caption="Hoạt động trồng cây và phủ xanh bồn hoa vườn trường"
        observationTip="Trồng cây xanh giúp rễ cây cố định lớp đất mặt, lá cây cản bớt mưa lớn và giữ cho đất luôn ẩm xốp, phì nhiêu màu mỡ!"
      />
    </div>
  );
};
