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
    <div className="space-y-6 pb-12">
      {/* Profile Card */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#22B573] to-[#45B8F5] p-1 flex items-center justify-center text-4xl sm:text-5xl shadow-md">
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
                <h2 className="text-2xl sm:text-3xl font-black text-[#20352B]">
                  {profile.fullName}
                </h2>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                  Chiến binh nhí
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1 flex flex-wrap items-center gap-2">
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

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={onEditProfile}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Đổi thông tin
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              title="Đăng xuất khỏi thiết bị này"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <span className="text-2xl font-black text-emerald-700 block">
              {progress.highestScore}
              <span className="text-xs font-normal text-slate-400">/200</span>
            </span>
            <span className="text-xs font-bold text-slate-600">Điểm thi cao nhất</span>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <span className="text-2xl font-black text-blue-700 block">
              {progress.arenaAttempts}
            </span>
            <span className="text-xs font-bold text-slate-600">Số lượt thi đấu</span>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
            <span className="text-2xl font-black text-amber-700 block">
              {progress.completedLessons.length}/3
            </span>
            <span className="text-xs font-bold text-slate-600">Chủ đề đã học</span>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-center">
            <span className="text-2xl font-black text-purple-700 block">
              {allBadges.filter((b) => b.unlocked).length}/{allBadges.length}
            </span>
            <span className="text-xs font-bold text-slate-600">Huy hiệu đã nhận</span>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-black text-[#20352B]">
            Bộ Sưu Tập Huy Hiệu Danh Dự
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allBadges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'border-amber-200 bg-amber-50/50 shadow-2xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-50 grayscale'
              }`}
            >
              <span className="text-3xl">{b.icon}</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{b.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{b.desc}</p>
                <span className="text-[10px] font-black uppercase mt-1 inline-block text-amber-700">
                  {b.unlocked ? '✓ Đã nhận' : '🔒 Chưa mở khóa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Journey Checklist */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-black text-[#20352B] flex items-center gap-2">
          <span>🗺️</span>
          <span>Hành Trình Bảo Vệ Đất</span>
        </h3>

        <div className="space-y-3">
          {/* Lessons */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">3 Chủ đề SGK Lớp 5</h4>
                <p className="text-xs text-slate-500">
                  Ô nhiễm đất, xói mòn và biện pháp phòng chống
                </p>
              </div>
            </div>
            {progress.completedLessons.length >= 3 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                ✓ Hoàn thành
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('lessons')}
                className="px-3 py-1.5 bg-[#22B573] text-white text-xs font-bold rounded-xl"
              >
                Học tiếp
              </button>
            )}
          </div>

          {/* Simulations */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">3 Thí nghiệm trực quan</h4>
                <p className="text-xs text-slate-500">
                  Mưa xói mòn đất, hành trình rác thải, trạm nước thải
                </p>
              </div>
            </div>
            {progress.completedSimulations.length >= 3 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                ✓ Hoàn thành
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('simulations')}
                className="px-3 py-1.5 bg-[#45B8F5] text-white text-xs font-bold rounded-xl"
              >
                Khám phá
              </button>
            )}
          </div>

          {/* Arena */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Đấu trường trí tuệ</h4>
                <p className="text-xs text-slate-500">
                  20 câu hỏi tính điểm tối đa 200 điểm
                </p>
              </div>
            </div>
            {progress.arenaAttempts > 0 ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Đã thi ({progress.highestScore}đ)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab('arena')}
                className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-xl"
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
