import React from 'react';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { Trophy, Award, Sparkles, ArrowRight, RotateCcw, BookOpen, Layers } from 'lucide-react';

interface JourneySummaryProps {
  completedStages: number[];
  stageScores: Record<number, number>;
  onGoToArena: () => void;
  onGoToLeaderboard: () => void;
  onBackToMap: () => void;
}

export const JourneySummary: React.FC<JourneySummaryProps> = ({
  completedStages,
  stageScores,
  onGoToArena,
  onGoToLeaderboard,
  onBackToMap,
}) => {
  const badges = [
    {
      id: 'b1',
      title: 'THÁM TỬ ĐẤT XANH',
      icon: '🔍',
      desc: 'Giải mã nguyên nhân và tác hại của ô nhiễm đất',
      unlocked: completedStages.includes(1),
      stageNum: 1,
    },
    {
      id: 'b2',
      title: 'NHÀ THÁM HIỂM ĐẤT',
      icon: '⛰️',
      desc: 'Khám phá mô phỏng động học xói mòn sườn đồi',
      unlocked: completedStages.includes(2),
      stageNum: 2,
    },
    {
      id: 'b3',
      title: 'SỨ GIẢ ĐẤT XANH',
      icon: '🛡️',
      desc: 'Cam kết hành động thiết thực bảo vệ môi trường đất',
      unlocked: completedStages.includes(3),
      stageNum: 3,
    },
    {
      id: 'b4',
      title: 'GIA ĐÌNH XANH',
      icon: '🏡',
      desc: 'Thực hành phân loại rác thải sinh hoạt 3 nhóm chuẩn',
      unlocked: completedStages.includes(4),
      stageNum: 4,
    },
  ];

  const totalBadgesEarned = badges.filter((b) => b.unlocked).length;

  return (
    <div className="w-full space-y-4 pb-8 max-w-4xl mx-auto">
      {/* 1. Congratulatory Banner with Captain Earth */}
      <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-blue-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-md">
        <CaptainEarth
          mood="winner"
          message="Chúc mừng bạn! Bạn đã hoàn thành xuất sắc các chặng thử thách và trở thành Chiến Binh Bảo Vệ Đất thực thụ!"
          size="md"
        />

        <div className="pt-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#22B573] block">
            CHỨNG NHẬN CHIẾN TÍCH TOÀN DIỆN
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#20352B]">
            Hành Trình Giải Cứu Đất Mẹ Hoàn Thành!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium mt-1">
            Em đã khám phá trọn vẹn 4 chặng kiến thức khoa học, trải nghiệm mô phỏng động học và thực hành phân loại rác tại gia đình.
          </p>
        </div>
      </div>

      {/* 2. 4 Badges Collection */}
      <div className="bg-white border-2 border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm sm:text-base font-black text-[#20352B]">
              Bộ Sưu Tập Huy Hiệu Danh Dự ({totalBadgesEarned}/4)
            </h3>
          </div>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {totalBadgesEarned === 4 ? 'Đủ bộ 4 huy hiệu ⭐⭐⭐⭐' : `${totalBadgesEarned} huy hiệu`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border-2 text-center flex flex-col justify-between transition-all ${
                b.unlocked
                  ? 'border-amber-300 bg-gradient-to-b from-amber-50/60 to-white shadow-xs'
                  : 'border-slate-200 bg-slate-50 opacity-50'
              }`}
            >
              <div>
                <span className="text-3xl sm:text-4xl block mb-1">
                  {b.unlocked ? b.icon : '🔒'}
                </span>
                <h4 className="text-xs font-black text-[#20352B] leading-tight">
                  {b.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-snug mt-1">
                  {b.desc}
                </p>
              </div>

              <span
                className={`mt-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                  b.unlocked
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {b.unlocked ? `Đã nhận Chặng ${b.stageNum}` : `Chặng ${b.stageNum}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Stage Scores Review Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
        <h3 className="text-sm sm:text-base font-black text-[#20352B]">
          Bảng Điểm Rèn Luyện Từng Chặng
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl">
            <span className="text-[10px] font-bold text-orange-950 uppercase block">Chặng 1: Ô nhiễm đất</span>
            <span className="text-lg font-black text-orange-600">{stageScores[1] ?? 5}/5 câu</span>
            <span className="text-[10px] text-slate-500 block">Thám tử tìm nguyên nhân</span>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
            <span className="text-[10px] font-bold text-blue-950 uppercase block">Chặng 2: Xói mòn sườn đồi</span>
            <span className="text-lg font-black text-blue-600">{stageScores[2] ?? 5}/5 câu</span>
            <span className="text-[10px] text-slate-500 block">Mô phỏng mưa & dòng chảy</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-950 uppercase block">Chặng 3: Bảo vệ đất mẹ</span>
            <span className="text-lg font-black text-emerald-600">{stageScores[3] ?? 5}/5 câu</span>
            <span className="text-[10px] text-slate-500 block">5 Tình huống xanh</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-[10px] font-bold text-amber-950 uppercase block">Chặng 4: Phân loại rác</span>
            <span className="text-lg font-black text-amber-600">12/12 món</span>
            <span className="text-[10px] text-slate-500 block">Chuẩn 3 nhóm gia đình</span>
          </div>
        </div>
      </div>

      {/* 4. Grand Final Invitation: 20-Question Quiz Arena */}
      <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 p-0.5 rounded-3xl shadow-lg">
        <div className="bg-white rounded-[22px] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-extrabold text-xs">
              <Trophy className="w-3.5 h-3.5 text-rose-600" />
              <span>ĐẤU TRƯỜNG TRÍ TUỆ TOÀN DIỆN</span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-[#20352B]">
              Bạn Đã Sẵn Sàng Thử Sức 20 Câu Hỏi Tổng Hợp (200 Điểm)?
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Thi đấu tính giờ 10 phút, tự động ghi danh Bảng Vàng và đồng bộ Google Sheets thời gian thực!
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToArena}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
          >
            <span>VÀO THI ĐẤU TRƯỜNG NGAY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Navigation Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToMap}
          className="px-5 py-2.5 border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Về Bản Đồ Hành Trình</span>
        </button>

        <button
          type="button"
          onClick={onGoToLeaderboard}
          className="px-5 py-2.5 bg-[#22B573] hover:bg-[#1caa68] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Xem Bảng Vàng Xếp Hạng</span>
        </button>
      </div>
    </div>
  );
};
