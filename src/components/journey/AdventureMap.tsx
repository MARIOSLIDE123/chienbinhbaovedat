import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { CaptainEarth } from '../mascot/CaptainEarth';
import {
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface AdventureMapProps {
  profile: StudentProfile;
  completedStages: number[];
  stageScores: Record<number, number>;
  onSelectStage: (stageNumber: number) => void;
  onGoToArena: () => void;
  onGoToLeaderboard: () => void;
  onGoToSummary: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  profile,
  completedStages,
  stageScores,
  onSelectStage,
  onGoToArena,
  onGoToLeaderboard,
  onGoToSummary,
}) => {
  // Option for teachers/learners: Allow free direct jumping to any stage vs sequential unlocking
  const [isFreeNavigation, setIsFreeNavigation] = useState<boolean>(true);

  const stages = [
    {
      number: 1,
      id: 'stage-1',
      title: 'CHẶNG 1: GIẢI MÃ Ô NHIỄM ĐẤT',
      subtitle: 'Bí mật của đất · Nguyên nhân & tác hại',
      badgeName: 'THÁM TỬ ĐẤT XANH',
      icon: '🌋',
      color: 'from-amber-400 to-orange-500',
      borderColor: 'border-orange-400',
      bgColor: 'bg-orange-50/70',
      accentColor: 'text-orange-700',
      tasks: '3 hoạt động: Khám phá SGK + Thám tử tìm nguyên nhân + 5 câu kiểm tra',
    },
    {
      number: 2,
      id: 'stage-2',
      title: 'CHẶNG 2: GIẢI CỨU SƯỜN ĐỒI',
      subtitle: 'Khám phá chuyển động · Mô phỏng mưa & xói mòn',
      badgeName: 'NHÀ THÁM HIỂM ĐẤT',
      icon: '🌧️',
      color: 'from-sky-400 to-blue-500',
      borderColor: 'border-blue-400',
      bgColor: 'bg-blue-50/70',
      accentColor: 'text-blue-700',
      tasks: 'Mô phỏng động học 2 sườn đồi + Thử thách cứu đồi + 5 câu kiểm tra',
      highlight: true,
    },
    {
      number: 3,
      id: 'stage-3',
      title: 'CHẶNG 3: CHUNG TAY BẢO VỆ ĐẤT MẸ',
      subtitle: 'Sứ mệnh xanh · 5 hành động thiết thực',
      badgeName: 'SỨ GIẢ ĐẤT XANH',
      icon: '🌿',
      color: 'from-emerald-400 to-teal-500',
      borderColor: 'border-emerald-400',
      bgColor: 'bg-emerald-50/70',
      accentColor: 'text-emerald-700',
      tasks: 'Biện pháp SGK + Tình huống thực tế + 5 câu kiểm tra',
    },
    {
      number: 4,
      id: 'stage-4',
      title: 'CHẶNG 4: CÙNG GIA ĐÌNH PHÂN LOẠI RÁC',
      subtitle: 'Gia đình xanh · Thực hành 3 nhóm rác chuẩn',
      badgeName: 'GIA ĐÌNH XANH',
      icon: '🏡',
      color: 'from-teal-400 to-emerald-600',
      borderColor: 'border-teal-400',
      bgColor: 'bg-teal-50/70',
      accentColor: 'text-teal-700',
      tasks: 'Phòng bếp hoạt hình 3D + Kéo thả/chạm 12 món rác vào 3 thùng',
    },
  ];

  const totalFinished = completedStages.length;
  const progressPct = Math.round((totalFinished / 4) * 100);

  return (
    <div className="w-full space-y-4 pb-8">
      {/* 1. Hero Mascot Welcome Banner */}
      <section className="bg-gradient-to-r from-[#FFF9EA] via-[#F0FDF4] to-[#E0F2FE] border-2 border-[#22B573]/30 rounded-3xl p-4 sm:p-5 shadow-xs">
        <CaptainEarth
          mood={totalFinished >= 4 ? 'winner' : 'greeting'}
          message="Cùng Đội trưởng Đất Xanh khám phá bí mật của đất và trở thành chiến binh bảo vệ môi trường! Các bạn đã sẵn sàng cho chuyến phiêu lưu chưa?"
          size="sm"
        />

        {/* Quick progress & Student info strip */}
        <div className="mt-3 pt-3 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Chiến binh: <strong className="text-emerald-800">{profile.fullName}</strong></span>
            <span>·</span>
            <span>Lớp {profile.className} - {profile.schoolName}</span>
          </div>

          {/* Progress Pill + Teacher Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => setIsFreeNavigation(!isFreeNavigation)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1 transition-colors"
              title="Chuyển chế độ mở khóa chặng tự do hoặc học tuần tự"
            >
              {isFreeNavigation ? <Unlock className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
              <span>{isFreeNavigation ? 'Chế độ giáo viên: Mở tự do' : 'Học tuần tự'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#22B573]">
                {totalFinished}/4 chặng ({progressPct}%)
              </span>
              <div className="w-24 sm:w-32 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#22B573] via-[#45B8F5] to-[#FFD447] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(progressPct, 5)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Adventure Map Journey (BẢN ĐỒ HÀNH TRÌNH GIẢI CỨU ĐẤT MẸ) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#20352B]">
                BẢN ĐỒ HÀNH TRÌNH: GIẢI CỨU ĐẤT MẸ
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Khám phá lần lượt 4 chặng để mở khóa huy hiệu và tiến vào Đấu trường trí tuệ!
              </p>
            </div>
          </div>

          {totalFinished >= 4 && (
            <button
              type="button"
              onClick={onGoToSummary}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-2xs flex items-center gap-1"
            >
              <span>Xem Tổng Kết</span>
              <Award className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* The 4 Journey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {stages.map((st, idx) => {
            const isDone = completedStages.includes(st.number);
            const isLocked = !isFreeNavigation && st.number > 1 && !completedStages.includes(st.number - 1);
            const stageScore = stageScores[st.number];

            return (
              <div
                key={st.id}
                onClick={() => {
                  if (!isLocked) onSelectStage(st.number);
                }}
                className={`relative group bg-white border-2 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-xs ${
                  isLocked
                    ? 'border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed'
                    : isDone
                    ? 'border-emerald-300 hover:border-emerald-500 cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
                    : 'border-slate-200 hover:border-[#22B573] cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar of Stage Card */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${st.color} text-white flex items-center justify-center text-2xl shadow-xs transition-transform group-hover:scale-105 shrink-0`}
                      >
                        {st.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Tiết học / Chặng {st.number}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-[#20352B] leading-tight group-hover:text-[#22B573] transition-colors">
                          {st.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Đã hoàn thành</span>
                      </span>
                    ) : isLocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold shrink-0">
                        <Lock className="w-3 h-3" />
                        <span>Chưa mở</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 animate-pulse shrink-0">
                        <span>⭐ Sẵn sàng khám phá</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed pl-1">
                    {st.subtitle}
                  </p>

                  <div className="mt-2 text-[11px] font-semibold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    🎯 <strong>Nhiệm vụ:</strong> {st.tasks}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px]">Huy hiệu: <strong className="text-slate-800">{st.badgeName}</strong></span>
                  </div>

                  <span
                    className={`font-black flex items-center gap-1 transition-colors ${
                      isLocked ? 'text-slate-400' : 'text-[#22B573]'
                    }`}
                  >
                    <span>{isDone ? 'Học lại' : 'Vào chặng'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Grand Arena & Leaderboard Portals at the Finish Line */}
      <section className="bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50 border-2 border-rose-200 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.2 rounded-md">
                  VẠCH ĐÍCH HÀNH TRÌNH
                </span>
                <span className="text-xs text-slate-400">· 200 điểm</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#20352B] leading-tight mt-0.5">
                Đấu Trường Trí Tuệ & Bảng Vàng Toàn Quốc
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Thử sức 20 câu hỏi tính giờ 10 phút để nhận huy hiệu Chiến Binh Tối Cao!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={onGoToArena}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>VÀO ĐẤU TRƯỜNG THI</span>
            </button>

            <button
              type="button"
              onClick={onGoToLeaderboard}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Xem Bảng Vàng</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
