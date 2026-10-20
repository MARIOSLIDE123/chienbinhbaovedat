import React from 'react';
import { StudentProfile, UserLearningProgress } from '../../types';
import {
  User,
  School,
  Trophy,
  Award,
  BookOpen,
  FlaskConical,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  LogOut,
  Shield,
} from 'lucide-react';

interface UserProfileProps {
  profile: StudentProfile;
  progress: UserLearningProgress;
  onEditProfile: () => void;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  progress,
  onEditProfile,
  onSelectTab,
  onLogout,
}) => {
  const allBadges = [
    {
      id: 'badge-starter',
      name: 'Chiến Binh Mới Gia Nhập',
      icon: '🌱',
      desc: 'Bắt đầu hành trình bảo vệ đất',
      unlocked: true,
    },
    {
      id: 'badge-reader',
      name: 'Học Giả Đất Mẹ',
      icon: '📖',
      desc: 'Hoàn thành cả 3 chủ đề SGK',
      unlocked: progress.completedLessons.length >= 3,
    },
    {
      id: 'badge-scientist',
      name: 'Nhà Khoa Học Nhí',
      icon: '🧪',
      desc: 'Khám phá xong 3 thí nghiệm mô phỏng',
      unlocked: progress.completedSimulations.length >= 3,
    },
    {
      id: 'badge-arena-master',
      name: 'Chiến Binh Xuất Sắc',
      icon: '🌟',
      desc: 'Đạt từ 180 - 200 điểm Đấu Trường Trí Tuệ',
      unlocked: progress.highestScore >= 180,
    },
    {
      id: 'badge-action-hero',
      name: 'Đại Sứ Môi Trường',
      icon: '🛡️',
      desc: 'Thực hiện các hành động bảo vệ đất thực tế',
      unlocked: (progress.checklistActions?.length || 0) >= 3,
    },
  ];

  return (
    <div className="w-full space-y-3 pb-6">
      {/* Profile Card */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-3.5 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#22B573] to-[#45B8F5] p-0.5 flex items-center justify-center text-3xl shadow-xs shrink-0">
              <span>
                {profile.avatarId === 'water'
                  ? '💧'
                  : profile.avatarId === 'sprout'
                  ? '🌱'
                  : profile.avatarId === 'worm'
                  ? '🪱'
                  : profile.avatarId === 'leaf'
                  ? '🍃'
                  : '🌍'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-[#20352B]">
                  {profile.fullName}
                </h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                  Chiến binh nhí
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 flex flex-wrap items-center gap-1.5">
                <span>Lớp {profile.className}</span>
                <span>•</span>
                <span>{profile.schoolName}</span>
                {profile.province && (
                  <>
                    <span>•</span>
                    <span>{profile.province}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              type="button"
              onClick={onEditProfile}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Đổi thông tin
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              title="Đăng xuất khỏi thiết bị này"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-lg sm:text-xl font-black text-emerald-700 block">
              {progress.highestScore}
              <span className="text-[10px] font-normal text-slate-500">/200</span>
            </span>
            <span className="text-[10px] font-bold text-slate-600">Điểm cao nhất</span>
          </div>

          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-lg sm:text-xl font-black text-blue-700 block">
              {progress.arenaAttempts}
            </span>
            <span className="text-[10px] font-bold text-slate-600">Lượt thi đấu</span>
          </div>

          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-lg sm:text-xl font-black text-amber-700 block">
              {progress.completedLessons.length}/3
            </span>
            <span className="text-[10px] font-bold text-slate-600">Chủ đề đã học</span>
          </div>

          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-center">
            <span className="text-lg sm:text-xl font-black text-purple-700 block">
              {allBadges.filter((b) => b.unlocked).length}/{allBadges.length}
            </span>
            <span className="text-[10px] font-bold text-slate-600">Huy hiệu đạt được</span>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs sm:text-sm font-black text-[#20352B]">
            Bộ Sưu Tập Huy Hiệu Danh Dự
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {allBadges.map((b) => (
            <div
              key={b.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                b.unlocked
                  ? 'border-amber-200 bg-amber-50/50 shadow-2xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl shrink-0">{b.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">{b.name}</h4>
                  <span className="text-[9px] font-black uppercase text-amber-700">
                    {b.unlocked ? '✓' : '🔒'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Journey Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-2.5">
        <h3 className="text-xs sm:text-sm font-black text-[#20352B] flex items-center gap-1.5">
          <span>🗺️</span>
          <span>Tiến Độ Hành Trình</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Lessons */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">3 Chủ đề SGK</h4>
                <p className="text-[10px] text-slate-500 truncate">{progress.completedLessons.length}/3 bài</p>
              </div>
            </div>
            {progress.completedLessons.length >= 3 ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                ✓ Xong
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('lessons')}
                className="px-2 py-0.5 bg-[#22B573] text-white text-[10px] font-bold rounded shrink-0"
              >
                Học
              </button>
            )}
          </div>

          {/* Simulations */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">3 Thí nghiệm</h4>
                <p className="text-[10px] text-slate-500 truncate">{progress.completedSimulations.length}/3 bài</p>
              </div>
            </div>
            {progress.completedSimulations.length >= 3 ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                ✓ Xong
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('simulations')}
                className="px-2 py-0.5 bg-[#45B8F5] text-white text-[10px] font-bold rounded shrink-0"
              >
                Khám phá
              </button>
            )}
          </div>

          {/* Arena */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">Đấu trường trí tuệ</h4>
                <p className="text-[10px] text-slate-500 truncate">{progress.highestScore}đ</p>
              </div>
            </div>
            {progress.arenaAttempts > 0 ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                {progress.highestScore}đ
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('arena')}
                className="px-2 py-0.5 bg-rose-500 text-white text-10px font-bold rounded shrink-0"
              >
                Thi ngay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
