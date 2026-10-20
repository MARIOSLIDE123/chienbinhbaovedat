import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Play, Pause, RotateCcw, Scale, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface ErosionSimulationCanvasProps {
  onSimulationRun?: () => void;
}

export const ErosionSimulationCanvas: React.FC<ErosionSimulationCanvasProps> = ({
  onSimulationRun,
}) => {
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [soilErosionA, setSoilErosionA] = useState<number>(5); // 0 to 100%
  const [soilErosionB, setSoilErosionB] = useState<number>(10); // 0 to 100%
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);

  const canvasRefA = useRef<HTMLCanvasElement | null>(null);
  const canvasRefB = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Particles for rain and runoff
  const rainDropsRef = useRef<{ x: number; y: number; speed: number; len: number }[]>([]);
  const soilParticlesB = useRef<{ x: number; y: number; vx: number; vy: number; alpha: number }[]>([]);

  // Initialize rain drops
  useEffect(() => {
    const drops = [];
    for (let i = 0; i < 40; i++) {
      drops.push({
        x: Math.random() * 320,
        y: Math.random() * 220,
        speed: 4 + Math.random() * 4,
        len: 8 + Math.random() * 8,
      });
    }
    rainDropsRef.current = drops;
  }, []);

  // Simulation tick when isRaining is active
  useEffect(() => {
    if (!isRaining) return;
    if (onSimulationRun) onSimulationRun();

    const interval = setInterval(() => {
      // Model A (with trees & grass): erosion barely increases (capped at 15%)
      setSoilErosionA((prev) => Math.min(prev + 0.3, 15));
      // Model B (bare hill): erosion increases rapidly (up to 85%)
      setSoilErosionB((prev) => Math.min(prev + 1.8, 85));
    }, 200);

    return () => clearInterval(interval);
  }, [isRaining, onSimulationRun]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvasA = canvasRefA.current;
    const canvasB = canvasRefB.current;
    if (!canvasA || !canvasB) return;

    const ctxA = canvasA.getContext('2d');
    const ctxB = canvasB.getContext('2d');
    if (!ctxA || !ctxB) return;

    let tick = 0;

    const render = () => {
      tick++;

      // Update rain drops
      if (isRaining) {
        rainDropsRef.current.forEach((d) => {
          d.y += d.speed;
          if (d.y > 220) {
            d.y = -10;
            d.x = Math.random() * 320;
          }
        });

        // Add eroded mud particles for Model B
        if (tick % 3 === 0) {
          soilParticlesB.current.push({
            x: 60 + Math.random() * 120,
            y: 90 + Math.random() * 40,
            vx: 1.5 + Math.random() * 2,
            vy: 2 + Math.random() * 2.5,
            alpha: 1,
          });
        }
      }

      // -------------------------------------------------------------
      // DRAW MODEL A: HILL WITH TREES & VEGETATION
      // -------------------------------------------------------------
      ctxA.clearRect(0, 0, 320, 220);

      // Sky gradient
      const skyGradA = ctxA.createLinearGradient(0, 0, 0, 140);
      skyGradA.addColorStop(0, isRaining ? '#94A3B8' : '#BAE6FD');
      skyGradA.addColorStop(1, isRaining ? '#CBD5E1' : '#F0F9FF');
      ctxA.fillStyle = skyGradA;
      ctxA.fillRect(0, 0, 320, 220);

      // Sun or Rain Cloud
      if (isRaining) {
        ctxA.fillStyle = '#64748B';
        ctxA.beginPath();
        ctxA.arc(60, 25, 20, 0, Math.PI * 2);
        ctxA.arc(95, 20, 25, 0, Math.PI * 2);
        ctxA.arc(130, 25, 20, 0, Math.PI * 2);
        ctxA.arc(160, 28, 16, 0, Math.PI * 2);
        ctxA.fill();
      } else {
        ctxA.fillStyle = '#FDE047';
        ctxA.beginPath();
        ctxA.arc(280, 30, 20, 0, Math.PI * 2);
        ctxA.fill();
      }

      // Hill Slope with Soil Layers
      // Deep subsoil (stable)
      ctxA.fillStyle = '#78350F';
      ctxA.beginPath();
      ctxA.moveTo(0, 80);
      ctxA.quadraticCurveTo(140, 110, 320, 180);
      ctxA.lineTo(320, 220);
      ctxA.lineTo(0, 220);
      ctxA.closePath();
      ctxA.fill();

      // Topsoil layer (Dark humus)
      ctxA.fillStyle = '#92400E';
      ctxA.beginPath();
      ctxA.moveTo(0, 75);
      ctxA.quadraticCurveTo(140, 105, 320, 175);
      ctxA.lineTo(320, 185);
      ctxA.quadraticCurveTo(140, 115, 0, 85);
      ctxA.closePath();
      ctxA.fill();

      // Thick Green Grass Carpet on top
      ctxA.fillStyle = '#22C55E';
      ctxA.beginPath();
      ctxA.moveTo(0, 72);
      ctxA.quadraticCurveTo(140, 102, 320, 172);
      ctxA.lineTo(320, 176);
      ctxA.quadraticCurveTo(140, 106, 0, 76);
      ctxA.closePath();
      ctxA.fill();

      // Grass tufts
      ctxA.strokeStyle = '#15803D';
      ctxA.lineWidth = 2;
      for (let i = 15; i < 300; i += 25) {
        const y = 74 + (i / 300) * 95;
        ctxA.beginPath();
        ctxA.moveTo(i, y);
        ctxA.lineTo(i - 3, y - 8);
        ctxA.moveTo(i, y);
        ctxA.lineTo(i + 3, y - 8);
        ctxA.stroke();
      }

      // Root Network inside soil (Visible protection)
      ctxA.strokeStyle = 'rgba(254, 240, 138, 0.7)';
      ctxA.lineWidth = 1.8;
      const rootPoints = [
        { x: 50, y: 85 },
        { x: 120, y: 108 },
        { x: 190, y: 135 },
        { x: 250, y: 160 },
      ];
      rootPoints.forEach((rp) => {
        ctxA.beginPath();
        ctxA.moveTo(rp.x, rp.y);
        ctxA.lineTo(rp.x - 12, rp.y + 18);
        ctxA.lineTo(rp.x - 18, rp.y + 32);
        ctxA.moveTo(rp.x, rp.y);
        ctxA.lineTo(rp.x + 10, rp.y + 20);
        ctxA.lineTo(rp.x + 16, rp.y + 35);
        ctxA.stroke();
      });

      // 3 Sturdy Green Trees with Canopy
      const trees = [
        { x: 50, y: 78, h: 42, r: 20 },
        { x: 120, y: 102, h: 46, r: 22 },
        { x: 190, y: 130, h: 40, r: 18 },
      ];
      trees.forEach((t) => {
        // Trunk
        ctxA.fillStyle = '#5B21B6'; // brown trunk
        ctxA.fillStyle = '#78350F';
        ctxA.fillRect(t.x - 4, t.y - t.h, 8, t.h);
        // Canopy Leaves
        ctxA.fillStyle = '#16A34A';
        ctxA.beginPath();
        ctxA.arc(t.x, t.y - t.h - 5, t.r, 0, Math.PI * 2);
        ctxA.fill();
        ctxA.fillStyle = '#22C55E';
        ctxA.beginPath();
        ctxA.arc(t.x + 4, t.y - t.h - 8, t.r * 0.7, 0, Math.PI * 2);
        ctxA.fill();
      });

      // Rain drops on A
      if (isRaining) {
        ctxA.strokeStyle = '#38BDF8';
        ctxA.lineWidth = 1.5;
        rainDropsRef.current.forEach((d) => {
          ctxA.beginPath();
          ctxA.moveTo(d.x, d.y);
          ctxA.lineTo(d.x - 2, d.y + d.len);
          ctxA.stroke();
        });

        // Runoff at base: CLEAN BLUE WATER (Protected by roots)
        ctxA.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctxA.beginPath();
        ctxA.ellipse(280, 200, 32, 10, 0, 0, Math.PI * 2);
        ctxA.fill();
        ctxA.fillStyle = '#0369A1';
        ctxA.font = 'bold 10px sans-serif';
        ctxA.fillText('💧 Nước trong', 248, 204);
      }

      // -------------------------------------------------------------
      // DRAW MODEL B: BARE HILL (DEFORESTED, SEVERE EROSION)
      // -------------------------------------------------------------
      ctxB.clearRect(0, 0, 320, 220);

      // Sky
      const skyGradB = ctxB.createLinearGradient(0, 0, 0, 140);
      skyGradB.addColorStop(0, isRaining ? '#64748B' : '#E2E8F0');
      skyGradB.addColorStop(1, isRaining ? '#94A3B8' : '#F1F5F9');
      ctxB.fillStyle = skyGradB;
      ctxB.fillRect(0, 0, 320, 220);

      // Cloud
      if (isRaining) {
        ctxB.fillStyle = '#475569';
        ctxB.beginPath();
        ctxB.arc(60, 25, 20, 0, Math.PI * 2);
        ctxB.arc(95, 20, 25, 0, Math.PI * 2);
        ctxB.arc(130, 25, 20, 0, Math.PI * 2);
        ctxB.arc(160, 28, 16, 0, Math.PI * 2);
        ctxB.fill();
      }

      // Eroded Slope (Bare, rocky, washed out)
      const erosionOffset = (soilErosionB / 100) * 22; // slope gets sunken
      ctxB.fillStyle = '#78350F';
      ctxB.beginPath();
      ctxB.moveTo(0, 80 + erosionOffset * 0.4);
      ctxB.quadraticCurveTo(140, 110 + erosionOffset, 320, 180 + erosionOffset * 0.5);
      ctxB.lineTo(320, 220);
      ctxB.lineTo(0, 220);
      ctxB.closePath();
      ctxB.fill();

      // Exposed Rocks & Pebbles
      ctxB.fillStyle = '#64748B';
      const rocks = [
        { x: 70, y: 100, r: 6 },
        { x: 130, y: 130, r: 8 },
        { x: 180, y: 150, r: 7 },
        { x: 230, y: 175, r: 9 },
      ];
      rocks.forEach((rk) => {
        ctxB.beginPath();
        ctxB.arc(rk.x, rk.y + erosionOffset * 0.5, rk.r, 0, Math.PI * 2);
        ctxB.fill();
      });

      // Tree Stumps (Cut down trees)
      const stumps = [
        { x: 60, y: 92 },
        { x: 140, y: 125 },
        { x: 210, y: 155 },
      ];
      stumps.forEach((st) => {
        ctxB.fillStyle = '#451A03';
        ctxB.fillRect(st.x - 5, st.y - 10, 10, 10);
        ctxB.fillStyle = '#B45309';
        ctxB.beginPath();
        ctxB.ellipse(st.x, st.y - 10, 5, 2.5, 0, 0, Math.PI * 2);
        ctxB.fill();
      });

      // Erosion Gullies (Ravines carved by water)
      if (soilErosionB > 15) {
        ctxB.strokeStyle = '#451A03';
        ctxB.lineWidth = 3;
        ctxB.beginPath();
        ctxB.moveTo(40, 85);
        ctxB.lineTo(110, 125);
        ctxB.lineTo(190, 160);
        ctxB.lineTo(270, 195);
        ctxB.stroke();
      }

      // Rain & Muddy runoff on B
      if (isRaining) {
        ctxB.strokeStyle = '#38BDF8';
        ctxB.lineWidth = 1.5;
        rainDropsRef.current.forEach((d) => {
          ctxB.beginPath();
          ctxB.moveTo(d.x, d.y);
          ctxB.lineTo(d.x - 2, d.y + d.len);
          ctxB.stroke();
        });

        // Moving mud particles down slope
        soilParticlesB.current.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.015;

          ctxB.fillStyle = `rgba(180, 83, 9, ${Math.max(p.alpha, 0)})`;
          ctxB.beginPath();
          ctxB.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctxB.fill();

          if (p.alpha <= 0) soilParticlesB.current.splice(idx, 1);
        });

        // Muddy pool at base (SEDIMENT RUNOFF)
        ctxB.fillStyle = 'rgba(146, 64, 14, 0.9)';
        ctxB.beginPath();
        ctxB.ellipse(270, 202, 40, 12, 0, 0, Math.PI * 2);
        ctxB.fill();
        ctxB.fillStyle = '#FEF08A';
        ctxB.font = 'bold 10px sans-serif';
        ctxB.fillText('⚠️ Nước bùn xói lở!', 225, 206);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRaining, soilErosionA, soilErosionB]);

  const handleToggleRain = () => {
    setIsRaining((prev) => !prev);
  };

  const handleReset = () => {
    setIsRaining(false);
    setSoilErosionA(5);
    setSoilErosionB(10);
    soilParticlesB.current = [];
    setShowComparison(false);
  };

  const handleAnswerQuestion = (ans: 'A' | 'B') => {
    setSelectedAnswer(ans);
    if (ans === 'B') {
      setAnsweredCorrectly(true);
      soundEffects.playCorrect();
    } else {
      setAnsweredCorrectly(false);
      soundEffects.playIncorrect();
    }
  };

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs mb-1">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Phòng Thí Nghiệm Động Học Xói Mòn Đất</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#20352B]">
            So Sánh Sườn Đồi Có Cây & Sườn Đồi Đất Trống Khi Mưa Lớn
          </h3>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleToggleRain}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
              isRaining
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-[#22B573] hover:bg-[#1caa68] text-white'
            }`}
          >
            {isRaining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRaining ? 'DỪNG MƯA' : 'TẠO MƯA LỚN'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            title="Đặt lại ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">ĐẶT LẠI</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-4 h-4 text-blue-600" />
            <span>SO SÁNH 2 SƯỜN ĐỒI</span>
          </button>
        </div>
      </div>

      {/* Side-by-side Simulation Canvases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model A */}
        <div className="bg-slate-50 border-2 border-emerald-300 rounded-2xl p-3 flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
              <span>🌳</span>
              <span>MÔ HÌNH A: Đồi Có Cây & Thảm Cỏ</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Được bảo vệ
            </span>
          </div>

          <div className="relative aspect-[16/11] bg-slate-100 rounded-xl overflow-hidden border border-emerald-200 shadow-inner">
            <canvas ref={canvasRefA} width={320} height={220} className="w-full h-full object-cover" />
            {isRaining && (
              <div className="absolute top-2 left-2 bg-emerald-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Rễ cây bện chặt giữ đất</span>
              </div>
            )}
          </div>

          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
            <strong>Hiện tượng:</strong> Tán lá cản hạt mưa, thảm cỏ làm chậm dòng chảy, nước chảy ra chân đồi trong vắt, đất không bị xói lở.
          </div>
        </div>

        {/* Model B */}
        <div className="bg-slate-50 border-2 border-rose-300 rounded-2xl p-3 flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
              <span>🪓</span>
              <span>MÔ HÌNH B: Đồi Bị Chặt Phá, Đất Trống</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
              Nguy cơ xói lở cao
            </span>
          </div>

          <div className="relative aspect-[16/11] bg-slate-100 rounded-xl overflow-hidden border border-rose-200 shadow-inner">
            <canvas ref={canvasRefB} width={320} height={220} className="w-full h-full object-cover" />
            {isRaining && (
              <div className="absolute top-2 left-2 bg-rose-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span>Mưa xối xả cuốn bùn đất!</span>
              </div>
            )}
          </div>

          <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900 font-medium">
            <strong>Hiện tượng:</strong> Không có cây che chở, giọt mưa đập vỡ mặt đất, dòng nước cuốn trôi lớp mùn dinh dưỡng thành bùn đỏ.
          </div>
        </div>
      </div>

      {/* Comparison Drawer / Banner */}
      {showComparison && (
        <div className="p-3.5 bg-gradient-to-r from-blue-50 via-emerald-50 to-amber-50 border-2 border-blue-200 rounded-2xl animate-in fade-in duration-200 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-blue-950 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>KẾT LUẬN KHOA HỌC TỪ MÔ PHỎNG:</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Khi lớp phủ thực vật bị mất, đất thường dễ bị nước mưa cuốn trôi hơn rất nhiều. Cây xanh và thảm cỏ giúp giữ đất, hạn chế xói mòn và ngăn chặn hiểm họa sạt lở lũ quét.
          </p>
        </div>
      )}

      {/* Interactive Thinking Question */}
      <div className="p-3 sm:p-4 bg-[#FFF9EA] border border-amber-300 rounded-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-black text-amber-950">
          <span>🤔</span>
          <span>CÂU HỎI QUAN SÁT: Ở sườn đồi nào, đất bị cuốn trôi nhiều hơn? Vì sao?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleAnswerQuestion('A')}
            className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${
              selectedAnswer === 'A'
                ? 'border-rose-400 bg-rose-50 text-rose-900'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span>Sườn đồi A (Có cây xanh) bị cuốn trôi nhiều hơn</span>
            {selectedAnswer === 'A' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => handleAnswerQuestion('B')}
            className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${
              selectedAnswer === 'B'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span>Sườn đồi B (Đất trống) bị cuốn trôi nhiều hơn vì không có cây giữ đất</span>
            {selectedAnswer === 'B' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          </button>
        </div>

        {answeredCorrectly !== null && (
          <div
            className={`p-2.5 rounded-xl text-xs font-semibold ${
              answeredCorrectly
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            {answeredCorrectly
              ? '🎉 Tuyệt vời! Bạn đã quan sát rất tinh tế. Sườn đồi đất trống bị dòng nước xối mòn cuốn trôi lớp mùn dinh dưỡng, trong khi cây và thảm cỏ ở sườn A đã bảo vệ đất nguyên vẹn!'
              : 'Chưa chính xác rồi bạn ơi! Hãy quan sát dòng nước bùn đục ngầu ở chân sườn đồi B (đất trống) để chọn lại nhé!'}
          </div>
        )}
      </div>
    </div>
  );
};
