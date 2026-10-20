import React, { useState } from 'react';
import { playCorrectSound, playIncorrectSound } from '../../utils/soundEffects';
import {
  CloudRain,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';

interface ScienceSimulationsProps {
  completedSimulations: string[];
  onCompleteSimulation: (simId: string) => void;
}

export const ScienceSimulations: React.FC<ScienceSimulationsProps> = ({
  completedSimulations,
  onCompleteSimulation,
}) => {
  const [activeSim, setActiveSim] = useState<'erosion' | 'waste' | 'water'>('erosion');

  // Simulation 1 State: Erosion
  const [rainIntensity, setRainIntensity] = useState<number>(2); // 1 = light, 2 = heavy, 3 = storm
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [rainTimer, setRainTimer] = useState<number>(0);

  // Simulation 2 State: Waste
  const [selectedWaste, setSelectedWaste] = useState<'battery' | 'plastic' | 'organic'>('plastic');
  const [disposalAction, setDisposalAction] = useState<'recycle' | 'litter' | 'bury'>('recycle');
  const [timelineYears, setTimelineYears] = useState<number>(5);

  // Simulation 3 State: Wastewater
  const [waterStep, setWaterStep] = useState<number>(1);

  // Quick review quiz state per sim
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const startRain = () => {
    setIsRaining(true);
    setRainTimer((prev) => prev + 1);
    onCompleteSimulation('erosion-rainfall');
  };

  const stopRain = () => {
    setIsRaining(false);
  };

  const resetRain = () => {
    setIsRaining(false);
    setRainTimer(0);
    setRainIntensity(2);
  };

  const handleWasteAction = (action: 'recycle' | 'litter' | 'bury') => {
    setDisposalAction(action);
    onCompleteSimulation('waste-journey');
  };

  const handleWaterNextStep = () => {
    if (waterStep < 5) {
      setWaterStep((prev) => prev + 1);
    } else {
      setWaterStep(1);
    }
    onCompleteSimulation('water-treatment');
  };

  const handleAnswerQuiz = (simKey: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [simKey]: optionIndex }));
    setQuizSubmitted((prev) => ({ ...prev, [simKey]: true }));
    const isCorrect = optionIndex === 1;
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  return (
    <div className="w-full space-y-3 pb-6">
      {/* Simulation Selector Bar (Compact single row) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveSim('erosion')}
          className={`p-2 sm:p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-1 ${
            activeSim === 'erosion'
              ? 'border-[#45B8F5] bg-blue-50/70 shadow-2xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="min-w-0">
            <span className="text-[10px] font-black text-[#45B8F5] uppercase tracking-wider block leading-tight">
              Thí nghiệm 1
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#20352B] truncate">
              Đất Cây vs Đất Trống
            </h3>
          </div>
          <span className="text-xl shrink-0">🌧️</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSim('waste')}
          className={`p-2 sm:p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-1 ${
            activeSim === 'waste'
              ? 'border-[#FF944D] bg-orange-50/70 shadow-2xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="min-w-0">
            <span className="text-[10px] font-black text-[#FF944D] uppercase tracking-wider block leading-tight">
              Thí nghiệm 2
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#20352B] truncate">
              Hành Trình Rác
            </h3>
          </div>
          <span className="text-xl shrink-0">♻️</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSim('water')}
          className={`p-2 sm:p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-1 ${
            activeSim === 'water'
              ? 'border-[#22B573] bg-emerald-50/70 shadow-2xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="min-w-0">
            <span className="text-[10px] font-black text-[#22B573] uppercase tracking-wider block leading-tight">
              Thí nghiệm 3
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#20352B] truncate">
              Xử Lý Nước Thải
            </h3>
          </div>
          <span className="text-xl shrink-0">🧪</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* THÍ NGHIỆM 1: ĐẤT CÓ CÂY VÀ ĐẤT TRỐNG */}
      {/* ========================================================= */}
      {activeSim === 'erosion' && (
        <div className="bg-white border border-blue-200 rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg mb-1">
                <CloudRain className="w-3.5 h-3.5" />
                <span>Mô phỏng động học lớp đất bề mặt</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#20352B]">
                Mô hình: Mưa lớn tác động lên Đất có cây và Đất trống
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Quan sát sự khác biệt rõ rệt khi nước mưa dội xuống đất có thảm thực vật che chở và sườn đồi trống trơn.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetRain}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
              {isRaining ? (
                <button
                  type="button"
                  onClick={stopRain}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Dừng mưa</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRain}
                  className="px-5 py-2 bg-[#45B8F5] hover:bg-[#32a8e6] text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mô phỏng mưa rơi</span>
                </button>
              )}
            </div>
          </div>

          {/* Intensity Control Slider */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-700">Cường độ mưa:</span>
              <span className="text-xs font-black px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                {rainIntensity === 1 ? 'Mưa nhỏ phùn' : rainIntensity === 2 ? 'Mưa rào nặng hạt' : 'Bão tố cuồng phong'}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-64">
              <span className="text-[11px] font-bold text-slate-400">Nhỏ</span>
              <input
                type="range"
                min="1"
                max="3"
                value={rainIntensity}
                onChange={(e) => setRainIntensity(Number(e.target.value))}
                className="w-full accent-[#45B8F5] cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-400">Bão</span>
            </div>
          </div>

          {/* Dual Comparative Visual Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model A: Đất có cây và cỏ */}
            <div className="border-2 border-emerald-300 rounded-3xl p-5 bg-gradient-to-b from-sky-50/70 via-emerald-50/40 to-[#FAF6ED] relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-extrabold">
                    MÔ HÌNH A: Đất có cây & cỏ
                  </span>
                  <span className="text-xs font-bold text-emerald-800">Bảo vệ vững chắc</span>
                </div>

                {/* Raindrops Animation */}
                <div className="h-28 relative flex items-center justify-around overflow-hidden">
                  {isRaining && (
                    <div className="absolute inset-0 flex justify-around pointer-events-none opacity-80 animate-pulse">
                      {Array.from({ length: rainIntensity * 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-blue-400 rounded-full animate-bounce"
                          style={{
                            height: `${12 + (i % 3) * 6}px`,
                            animationDuration: `${0.4 + (i % 4) * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Lush trees and bushes */}
                  <div className="flex items-end justify-center gap-4 z-10 pt-4">
                    <div className="text-center">
                      <span className="text-4xl block leading-none">🌳</span>
                      <span className="text-[10px] font-bold text-emerald-800">Cây cổ thụ</span>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl block leading-none">🌲</span>
                      <span className="text-[10px] font-bold text-emerald-800">Cây con</span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl block leading-none">🌿</span>
                      <span className="text-[10px] font-bold text-emerald-800">Thảm cỏ</span>
                    </div>
                  </div>
                </div>

                {/* Soil Profile & Roots Layer */}
                <div className="p-4 bg-[#6F4E37] text-white rounded-2xl relative border-t-4 border-emerald-500 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                    <span>Lớp đất mặt giàu mùn</span>
                    <span className="text-emerald-300">Không bị cuốn trôi</span>
                  </div>
                  <div className="text-[11px] text-amber-100 flex items-center gap-1.5">
                    <span>🕸️</span>
                    <span>Hệ rễ cây chằng chịt bện giữ đất chặt chẽ</span>
                  </div>
                  {/* Clear water percolation */}
                  <div className="mt-2 pt-2 border-t border-amber-900/60 flex items-center justify-between text-[11px]">
                    <span className="text-sky-200">💧 Nước thấm ngầm: Trong vắt</span>
                    <span className="text-emerald-300 font-bold">Xói mòn: ~0%</span>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-semibold">
                ✓ Tán cây làm giảm lực va đập của hạt mưa; rễ cây giữ đất không bị trôi đi.
              </div>
            </div>

            {/* Model B: Đất trống, không có cây */}
            <div className="border-2 border-rose-300 rounded-3xl p-5 bg-gradient-to-b from-sky-50/70 via-rose-50/40 to-[#FAF6ED] relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-extrabold">
                    MÔ HÌNH B: Đất trống, đồi trọc
                  </span>
                  <span className="text-xs font-bold text-rose-800">Nguy cơ sạt lở cao</span>
                </div>

                {/* Raindrops Animation */}
                <div className="h-28 relative flex items-center justify-around overflow-hidden">
                  {isRaining && (
                    <div className="absolute inset-0 flex justify-around pointer-events-none opacity-90 animate-pulse">
                      {Array.from({ length: rainIntensity * 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-blue-500 rounded-full animate-bounce"
                          style={{
                            height: `${14 + (i % 3) * 8}px`,
                            animationDuration: `${0.35 + (i % 4) * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Barren ground with no trees */}
                  <div className="flex items-end justify-center gap-6 z-10 pt-8">
                    <span className="text-3xl">🪨</span>
                    <span className="text-2xl">⚠️</span>
                    <span className="text-3xl">🪨</span>
                  </div>
                </div>

                {/* Soil Profile Being Eroded */}
                <div
                  className={`p-4 text-white rounded-2xl relative border-t-4 border-rose-400 transition-colors shadow-inner ${
                    isRaining ? 'bg-[#4A3222]' : 'bg-[#8B5A2B]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                    <span>Lớp đất mặt</span>
                    <span className="text-rose-300">
                      {isRaining ? 'Bị cuốn trôi mạnh!' : 'Khô nứt nẻ'}
                    </span>
                  </div>
                  <div className="text-[11px] text-rose-200 flex items-center gap-1.5">
                    <span>🌊</span>
                    <span>Dòng chảy xiết xé đất thành rãnh xói sâu</span>
                  </div>
                  {/* Muddy runoff */}
                  <div className="mt-2 pt-2 border-t border-amber-950/60 flex items-center justify-between text-[11px]">
                    <span className="text-amber-300">Dòng nước: Đỏ ngầu bùn đất</span>
                    <span className="text-rose-300 font-bold">
                      Xói mòn: {isRaining ? `${rainIntensity * 30}%` : 'Đang chờ mưa'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 p-3 bg-rose-100/70 border border-rose-300 rounded-xl text-xs text-rose-950 font-semibold">
                ⚠️ Không có tán che và rễ giữ, nước mưa cuốn phăng lớp đất mặt màu mỡ xuống chân đồi!
              </div>
            </div>
          </div>

          {/* Educational Lesson & Takeaway */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <span className="text-2xl">🌱</span>
            <div className="text-xs sm:text-sm text-emerald-950">
              <strong className="block font-black text-sm text-emerald-900 mb-0.5">
                Bài học rút ra từ thí nghiệm:
              </strong>
              Trồng cây gây rừng, giữ thảm cỏ xanh là biện pháp phòng chống xói mòn đất tự nhiên hiệu quả nhất. Không được chặt phá rừng và để đất trống, đồi núi trọc!
            </div>
          </div>

          {/* Quick Quiz */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h4 className="font-extrabold text-sm text-slate-900">
                Câu hỏi tư duy: Vì sao nước chảy từ Mô hình A lại trong hơn Mô hình B?
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Vì đất có cây hút sạch mọi hạt bùn đất biến mất',
                'Vì rễ cây và cỏ giữ các hạt đất lại, lọc nước mưa chảy từ từ',
                'Vì trên cây có máy lọc nước tự động',
                'Vì trời không mưa lên mô hình A',
              ].map((opt, oIdx) => {
                const isSelected = quizAnswers['erosion'] === oIdx;
                const isCorrect = oIdx === 1;
                let btnStyle = 'border-slate-200 bg-white hover:border-slate-300';
                if (quizSubmitted['erosion']) {
                  btnStyle = isCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                    : isSelected
                    ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-slate-200 bg-white opacity-60';
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleAnswerQuiz('erosion', oIdx)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* THÍ NGHIỆM 2: HÀNH TRÌNH RÁC THẢI */}
      {/* ========================================================= */}
      {activeSim === 'waste' && (
        <div className="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 bg-orange-50 text-orange-800 rounded-lg mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mô phỏng chu trình phân rã và ngấm độc</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#20352B]">
              Hành trình của Rác Thải: Chọn cách ứng xử và xem kết quả sau 50 năm
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Cùng khám phá xem một chai nhựa, quả pin cũ hay vỏ hoa quả sẽ biến đổi như thế nào trong lòng đất!
            </p>
          </div>

          {/* Step 1: Select Waste Type */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              1. Chọn loại rác thải em muốn tìm hiểu:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'plastic', name: 'Chai nhựa / Túi nilon', icon: '🥤', lifespan: '450 - 500 năm' },
                { id: 'battery', name: 'Pin cũ cạn điện', icon: '🔋', lifespan: 'Kim loại nặng vĩnh cửu' },
                { id: 'organic', name: 'Vỏ rau củ / thức ăn thừa', icon: '🍌', lifespan: '2 - 4 tuần' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWaste(w.id as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedWaste === w.id
                      ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{w.icon}</div>
                  <h4 className="font-extrabold text-sm text-slate-900">{w.name}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Thời gian phân hủy: {w.lifespan}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Action */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              2. Chọn phương án xử lí của em:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'recycle',
                  title: 'Phân loại & Tái chế',
                  icon: '♻️',
                  desc: 'Bỏ đúng thùng tái chế hoặc thu gom chuyên dụng',
                },
                {
                  id: 'litter',
                  title: 'Vứt bừa bãi ra đất',
                  icon: '🚯',
                  desc: 'Tiện tay vứt ra gốc cây, bờ ruộng, sân chơi',
                },
                {
                  id: 'bury',
                  title: 'Chôn lấp tùy tiện',
                  icon: '⛏️',
                  desc: 'Đào hố chôn sâu dưới lòng đất không qua xử lí',
                },
              ].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleWasteAction(a.id as any)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                    disposalAction === a.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{a.icon}</span>
                    <h4 className="font-bold text-xs sm:text-sm">{a.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Outcome Result Stage */}
          <div className="p-6 rounded-3xl border-2 border-amber-200 bg-[#FFFDF7] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-[#20352B] flex items-center gap-2">
                <span>🔍</span>
                <span>Kết quả tác động tới môi trường đất:</span>
              </h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Thời gian: 50 năm sau
              </span>
            </div>

            {disposalAction === 'recycle' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-950 space-y-1 font-medium">
                  <strong className="block text-sm font-extrabold text-emerald-900">
                    Lựa chọn tuyệt vời! Đất mẹ hoàn toàn an toàn và sạch đẹp.
                  </strong>
                  <p>
                    {selectedWaste === 'plastic' &&
                      'Chai nhựa được tái chế thành sợi vải, đồ dùng mới. Giảm được hàng ngàn tấn rác chôn lấp, đất vẫn tơi xốp và không có hạt vi nhựa.'}
                    {selectedWaste === 'battery' &&
                      'Các kim loại nặng (chì, thủy ngân) được chiết tách an toàn tại nhà máy tái chế chuyên dụng, cứu sống hàng ngàn mét khối nước ngầm.'}
                    {selectedWaste === 'organic' &&
                      'Rác hữu cơ được ủ thành phân compost giàu mùn, bón lại cho cây xanh phát triển xanh tốt, đất thêm phì nhiêu!'}
                  </p>
                </div>
              </div>
            ) : disposalAction === 'litter' ? (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-rose-950 space-y-1 font-medium">
                  <strong className="block text-sm font-extrabold text-rose-900">
                    Hậu quả nghiêm trọng! Đất bề mặt bị ô nhiễm nặng nề.
                  </strong>
                  <p>
                    {selectedWaste === 'plastic' &&
                      'Túi nilon vỡ vụn thành hàng triệu hạt vi nhựa, làm nghẹt rễ cây, đất chai cứng và giun đất không thể sinh sống.'}
                    {selectedWaste === 'battery' &&
                      'Vỏ pin bị gỉ sét, thủy ngân và axit chảy tràn đầu độc toàn bộ luống hoa, ngấm xuống mạch nước giếng khoan của người dân.'}
                    {selectedWaste === 'organic' &&
                      'Vứt rác bừa bãi sinh mùi hôi thối, thu hút ruồi muỗi mang mầm bệnh tới cộng đồng xung quanh.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-950 space-y-1 font-medium">
                  <strong className="block text-sm font-extrabold text-amber-900">
                    Cảnh báo! Chôn lấp không đúng kỹ thuật nguy hại khôn lường.
                  </strong>
                  <p>
                    {selectedWaste === 'plastic' &&
                      'Nhựa nằm im dưới lòng đất suốt 50 năm không phân hủy, cản trở mạch nước ngầm lưu thông và làm đất khô cằn.'}
                    {selectedWaste === 'battery' &&
                      'Chì và cadimi ngấm sâu vào túi nước ngầm sinh hoạt, gây ngộ độc mãn tính cho người dân sử dụng nước giếng.'}
                    {selectedWaste === 'organic' &&
                      'Nếu chôn bọc trong túi nilon, rác hữu cơ sẽ lên men sinh khí mê-tan nguy hiểm thay vì biến thành phân bón tốt.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* THÍ NGHIỆM 3: NƯỚC THẢI CÔNG NGHIỆP QUA TRẠM XỬ LÝ */}
      {/* ========================================================= */}
      {activeSim === 'water' && (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quy trình xử lý chất thải theo luật bảo vệ môi trường</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#20352B]">
                Hệ Thống Trạm Xử Lý Nước Thải Công Nghiệp
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Bấm vào các bước để theo dõi giọt nước ô nhiễm được làm sạch trước khi thải ra thiên nhiên.
              </p>
            </div>

            <button
              type="button"
              onClick={handleWaterNextStep}
              className="px-4 py-2 bg-[#22B573] hover:bg-[#1caa68] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <span>{waterStep < 5 ? `Bước tiếp theo (${waterStep + 1}/5)` : 'Bắt đầu lại bước 1'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Flow Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { step: 1, title: '1. Nước thải đen', icon: '🏭', color: 'bg-slate-700' },
              { step: 2, title: '2. Bể lắng lọc', icon: '🪜', color: 'bg-amber-600' },
              { step: 3, title: '3. Bể sinh học', icon: '🫧', color: 'bg-teal-600' },
              { step: 4, title: '4. Khử trùng', icon: '🧪', color: 'bg-blue-600' },
              { step: 5, title: '5. Thải an toàn', icon: '🐟', color: 'bg-emerald-600' },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setWaterStep(s.step)}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  waterStep === s.step
                    ? 'border-[#22B573] bg-emerald-50 scale-105 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-2xl block mb-1">{s.icon}</span>
                <span className="text-[11px] font-extrabold text-slate-800 block">
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Visual Step Display */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                {waterStep}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {waterStep === 1 && 'Bước 1: Nước thải công nghiệp chưa qua xử lí'}
                  {waterStep === 2 && 'Bước 2: Bể tách lọc rác và lắng cặn thô'}
                  {waterStep === 3 && 'Bước 3: Bể sinh học sục khí vi sinh vật'}
                  {waterStep === 4 && 'Bước 4: Khử trùng và kiểm định chỉ số an toàn'}
                  {waterStep === 5 && 'Bước 5: Thải ra môi trường tự nhiên đạt chuẩn quy định'}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {waterStep === 1 && 'Độ độc hại: CỰC KỲ CAO (Nghiêm cấm xả trực tiếp ra đất)'}
                  {waterStep === 2 && 'Đã lọc bỏ 70% cặn rác thô và dầu mỡ'}
                  {waterStep === 3 && 'Vi sinh vật phân hủy các chất hữu cơ độc hại'}
                  {waterStep === 4 && 'Nước trong suốt, nồng độ hóa chất đạt chuẩn'}
                  {waterStep === 5 && 'Nước an toàn cho cá bơi lội, tưới tiêu cây cối và không hại đất!'}
                </span>
              </div>
            </div>

            {/* Visual tank simulator */}
            <div className="h-32 rounded-2xl border-2 border-slate-300 relative overflow-hidden flex items-center justify-center">
              <div
                className={`absolute inset-0 transition-colors duration-500 ${
                  waterStep === 1
                    ? 'bg-slate-800'
                    : waterStep === 2
                    ? 'bg-amber-800/80'
                    : waterStep === 3
                    ? 'bg-teal-700/70'
                    : waterStep === 4
                    ? 'bg-sky-400/50'
                    : 'bg-emerald-400/40'
                }`}
              />
              <div className="z-10 text-center text-white px-4">
                <span className="text-3xl block mb-1">
                  {waterStep === 1 ? '☣️' : waterStep === 2 ? '⚙️' : waterStep === 3 ? '🫧' : waterStep === 4 ? '🔬' : '🌿'}
                </span>
                <span className="text-xs font-extrabold drop-shadow-md">
                  {waterStep === 1 && 'Nước thải đen ngòm, chứa nhiều hóa chất nguy hại'}
                  {waterStep === 2 && 'Cặn bã lắng xuống đáy bể, rác nổi được vớt sạch'}
                  {waterStep === 3 && 'Hàng tỉ bọt khí sục nuôi vi sinh vật xử lý độc tố'}
                  {waterStep === 4 && 'Kiểm tra đạt chuẩn QCVN trước khi mở van xả'}
                  {waterStep === 5 && 'Nước trong lành tưới mát cho cây cỏ và giữ đất màu mỡ!'}
                </span>
              </div>
            </div>
          </div>

          {/* Core Message */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed">
              Thông điệp quan trọng: Mọi cơ sở sản xuất và nhà máy bắt buộc phải thu gom và xử lí nước thải theo đúng quy định trước khi xả ra môi trường để bảo vệ nguồn đất và nước ngầm!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
