import React, { useState } from 'react';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { STAGE_2_QUESTIONS } from '../../data/journeyData';
import { ErosionSimulationCanvas } from './ErosionSimulationCanvas';
import { soundEffects } from '../../utils/soundEffects';
import { ImageZoomModal } from '../common/ImageZoomModal';
import {
  CloudRain,
  ShieldAlert,
  TreePine,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ZoomIn,
  Award,
  Play,
  Pause,
} from 'lucide-react';

interface Stage2ErosionProps {
  onCompleteStage: (score: number) => void;
  onGoToNextStage: () => void;
}

export const Stage2Erosion: React.FC<Stage2ErosionProps> = ({
  onCompleteStage,
  onGoToNextStage,
}) => {
  // Tabs within Stage 2: 'knowledge' -> 'simulation' -> 'rescue' -> 'quiz'
  const [activeStep, setActiveStep] = useState<'knowledge' | 'simulation' | 'rescue' | 'quiz'>('simulation');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Rescue activity state
  const [rescueChoices, setRescueChoices] = useState<Record<string, boolean>>({});
  const [rescueFeedback, setRescueFeedback] = useState<Record<string, string>>({});

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const rescueOptions = [
    {
      id: 'res_1',
      title: 'Trồng cây gây rừng & phủ xanh đất trống đồi trọc',
      isGood: true,
      explanation: 'Rất đúng! Cây lấy gỗ và cây bản địa có bộ rễ sâu giúp bện chặt sườn đồi, cản lũ quét.',
    },
    {
      id: 'res_2',
      title: 'Trồng thảm cỏ voi, cỏ vertiver trên các mái dốc',
      isGood: true,
      explanation: 'Chính xác! Thảm cỏ phát triển nhanh, tạo mạng lưới giữ lớp đất mặt không bị rửa trôi.',
    },
    {
      id: 'res_3',
      title: 'Xây bờ kè đá và làm ruộng bậc thang đón dòng nước',
      isGood: true,
      explanation: 'Rất giỏi! Ruộng bậc thang và kè đá giúp ngắt dòng chảy xiết thành từng bậc êm dịu.',
    },
    {
      id: 'res_4',
      title: 'Chặt trắng rừng lấy gỗ và đốt nương rẫy trơ sỏi đá',
      isGood: false,
      explanation: 'Sai rồi! Chặt phá và đốt rừng là nguyên nhân trực tiếp gây xói lở kinh hoàng khi mưa lớn.',
    },
  ];

  const handleRescueSelect = (optId: string, isGood: boolean, explanation: string) => {
    setRescueChoices((prev) => ({ ...prev, [optId]: isGood }));
    setRescueFeedback((prev) => ({ ...prev, [optId]: explanation }));

    if (isGood) {
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
    STAGE_2_QUESTIONS.forEach((q) => {
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
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-emerald-50 border-2 border-blue-200 rounded-3xl p-4 sm:p-5 shadow-xs">
        <CaptainEarth
          mood={isSubmitted && score >= 4 ? 'winner' : activeStep === 'simulation' ? 'teaching' : 'thinking'}
          message="Các bạn hãy quan sát thật kĩ nhé! Điều gì sẽ xảy ra khi mưa lớn đổ xuống một sườn đồi không có cây xanh? Chúng ta cùng thử nghiệm!"
          size="sm"
        />
      </div>

      {/* Step Navigation Pill */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-2xs overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveStep('simulation')}
          className={`flex-1 min-w-[150px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'simulation'
              ? 'bg-[#45B8F5] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🌧️ 1. Mô Phỏng Mưa & Xói Mòn</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('knowledge')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'knowledge'
              ? 'bg-[#45B8F5] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📖 2. Khám Phá Kiến Thức</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('rescue')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'rescue'
              ? 'bg-[#45B8F5] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>⛰️ 3. Hãy Cứu Sườn Đồi</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('quiz')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeStep === 'quiz'
              ? 'bg-[#45B8F5] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>⭐ 4. Kiểm Tra Củng Cố</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SUB-STEP 1: TÍNH NĂNG NỔI BẬT: MÔ PHỎNG MƯA & XÓI MÒN CHUYỂN ĐỘNG      */}
      {/* ===================================================================== */}
      {activeStep === 'simulation' && (
        <div className="space-y-4">
          <ErosionSimulationCanvas />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep('knowledge')}
              className="px-5 py-2.5 bg-[#45B8F5] hover:bg-[#32a3de] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Xem Thêm Kiến Thức & Hình Ảnh Thực Tế</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-STEP 2: KHÁM PHÁ KIẾN THỨC & ẢNH THỰC TẾ SGK                      */}
      {/* ===================================================================== */}
      {activeStep === 'knowledge' && (
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#45B8F5] block">
                CHẶNG 2: GIẢI CỨU SƯỜN ĐỒI
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Khái Niệm, Nguyên Nhân & Tác Hại Của Xói Mòn Đất
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('rescue')}
              className="px-4 py-2 bg-[#45B8F5] hover:bg-[#32a3de] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <span>Vào Thử Thách Cứu Sườn Đồi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Photo with zoom */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center gap-4">
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative group w-full md:w-5/12 aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs border border-blue-200 shrink-0"
            >
              <img
                src="/images/lesson-2-soil-erosion.jpg"
                alt="Sườn đồi trọc bị xói mòn sau mưa lũ"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-bold">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-300" />
                  <span>Kính lúp quan sát vết nứt sạt lở</span>
                </span>
              </div>
            </div>

            <div className="w-full md:w-7/12 space-y-2">
              <span className="text-xs font-black text-blue-950 block">
                📸 Quan sát ảnh thực tế: Vết xói lở sâu hoắm trên sườn đồi trọc
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white/90 p-3 rounded-xl border border-blue-100">
                Khi không có cây rừng che chắn, dòng nước mưa xối xả bổ thẳng xuống mặt đất, cuốn trôi sạch lớp đất mùn màu mỡ trên bề mặt và khoét sâu thành các rãnh xói mòn nguy hiểm.
              </p>
            </div>
          </div>

          {/* Core Takeaways */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
              <h4 className="text-xs font-black text-blue-950">1. Khái niệm</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Xói mòn đất là hiện tượng lớp đất mặt bị bào mòn, cuốn trôi do nước chảy, gió bão hoặc tác động của con người.
              </p>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <h4 className="text-xs font-black text-rose-950">2. Nguyên nhân</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Mưa lớn, địa hình dốc đứng kết hợp việc con người chặt phá rừng, đốt nương rẫy làm mất thảm thực vật che chở.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <h4 className="text-xs font-black text-emerald-950">3. Biện pháp</h4>
              <p className="text-[11px] text-slate-700 font-medium">
                Trồng rừng bảo vệ đầu nguồn, phủ xanh đồi trọc, trồng thảm cỏ giữ đất và xây bờ kè đá ngăn dòng chảy xiết.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-STEP 3: HOẠT ĐỘNG "HÃY CỨU LẤY SƯỜN ĐỒI"                         */}
      {/* ===================================================================== */}
      {activeStep === 'rescue' && (
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#45B8F5] block">
                HOẠT ĐỘNG THỰC HÀNH VẬN DỤNG
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Hãy Cứu Lấy Sườn Đồi Đang Bị Xói Lở!
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Chọn những giải pháp đúng đắn giúp sườn đồi xanh tươi và không bị nước mưa cuốn trôi!
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rescueOptions.map((opt) => {
              const chosen = rescueChoices[opt.id];
              const fb = rescueFeedback[opt.id];

              return (
                <div
                  key={opt.id}
                  onClick={() => handleRescueSelect(opt.id, opt.isGood, opt.explanation)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    chosen !== undefined
                      ? opt.isGood
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-2xs'
                        : 'border-rose-400 bg-rose-50 text-rose-950'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-black">{opt.title}</span>
                    {chosen !== undefined && (
                      <span className="text-base">
                        {opt.isGood ? '✅' : '❌'}
                      </span>
                    )}
                  </div>

                  {fb && (
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-700 bg-white/80 p-2 rounded-xl border border-slate-200">
                      {fb}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-STEP 4: 5 CÂU HỎI KIỂM TRA CỦNG CỐ CHẶNG 2                        */}
      {/* ===================================================================== */}
      {activeStep === 'quiz' && (
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#45B8F5] block">
                BÀI KIỂM TRA CỦNG CỐ CHẶNG 2
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                Thử Thách: 5 Câu Hỏi Nhà Thám Hiểm Đất
              </h2>
            </div>
            {isSubmitted && (
              <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-xl text-xs font-black">
                Kết quả: {score}/5 câu đúng
              </span>
            )}
          </div>

          <div className="space-y-4">
            {STAGE_2_QUESTIONS.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];
              return (
                <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">
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
                        style = 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-200 font-bold';
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
                    <div className="p-2 bg-blue-50 rounded-xl text-[11px] font-medium text-blue-950 border border-blue-200">
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
                className="w-full sm:w-auto px-6 py-2.5 bg-[#45B8F5] hover:bg-[#32a3de] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-xs transition-colors"
              >
                NỘP BÀI KIỂM TRA CHẶNG 2
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span>
                    {score >= 4
                      ? '🏅 Xuất sắc! Nhận huy hiệu NHÀ THÁM HIỂM ĐẤT'
                      : 'Đã hoàn thành Chặng 2! Tiếp tục cố gắng'}
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
                    <span>Sang Chặng 3: Bảo Vệ Đất Mẹ</span>
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
        imageSrc="/images/lesson-2-soil-erosion.jpg"
        imageAlt="Sườn đồi xói mòn"
        caption="Hiện tượng xói mòn và sạt lở đất trên sườn đồi trọc"
        observationTip="Khi mất thảm thực vật che chở, dòng chảy xiết của nước mưa sẽ khoét sâu lớp mùn và cuốn trôi bùn đất gây sạt lở nguy hiểm!"
      />
    </div>
  );
};
