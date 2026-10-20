import React, { useState } from 'react';
import { StudentProfile, UserLearningProgress } from '../../types';
import { DAILY_ACTIONS_CHECKLIST } from '../../data/learningContent';
import {
  BookOpen,
  GitFork,
  Lightbulb,
  FlaskConical,
  Trophy,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HomeDashboardProps {
  profile: StudentProfile;
  progress: UserLearningProgress;
  onSelectTab: (tab: string) => void;
  onToggleAction: (actionId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  progress,
  onSelectTab,
  onToggleAction,
}) => {
  const [showChecklist, setShowChecklist] = useState<boolean>(false);

  // Calculate completion percentage:
  const lessonPct = (progress.completedLessons.length / 3) * 30;
  const simPct = (progress.completedSimulations.length / 3) * 30;
  const practicePct = (Math.min(progress.practiceCompleted, 8) / 8) * 20;
  const arenaPct = progress.arenaAttempts > 0 ? 20 : 0;
  const totalPct = Math.round(lessonPct + simPct + practicePct + arenaPct);

  const featureCards = [
    {
      id: 'lessons',
      number: '1',
      title: 'Khám Phá Kiến Thức',
      subtitle: 'Ô nhiễm · Xói mòn · Bảo vệ đất',
      icon: BookOpen,
      iconColor: 'bg-emerald-500 text-white',
      badge: `${progress.completedLessons.length}/3 bài`,
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      actionText: 'Vào học ngay',
    },
    {
      id: 'mindmap',
      number: '2',
      title: 'Sơ Đồ Tư Duy',
      subtitle: '3 nhánh tri thức trực quan',
      icon: GitFork,
      iconColor: 'bg-sky-500 text-white',
      badge: 'Sơ đồ hình cây',
      badgeStyle: 'bg-sky-50 text-sky-800 border-sky-200',
      actionText: 'Xem sơ đồ',
    },
    {
      id: 'practice',
      number: '3',
      title: 'Thử Tài Nhanh Trí',
      subtitle: '8 trò chơi luyện tập tương tác',
      icon: Lightbulb,
      iconColor: 'bg-amber-500 text-white',
      badge: `${progress.practiceCompleted}/8 thử thách`,
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      actionText: 'Luyện tập',
    },
    {
      id: 'simulations',
      number: '4',
      title: 'Thí Nghiệm Vui',
      subtitle: 'Mô phỏng mưa & xử lý rác',
      icon: FlaskConical,
      iconColor: 'bg-purple-500 text-white',
      badge: `${progress.completedSimulations.length}/3 thí nghiệm`,
      badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
      actionText: 'Vào phòng lab',
    },
    {
      id: 'arena',
      number: '5',
      title: 'Đấu Trường Trí Tuệ',
      subtitle: '20 câu hỏi tính giờ 10 phút',
      icon: Trophy,
      iconColor: 'bg-rose-500 text-white',
      badge: progress.highestScore > 0 ? `Điểm: ${progress.highestScore}/200` : '200 điểm tối đa',
      badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
      actionText: 'Tham gia thi ngay',
      highlight: true,
    },
    {
      id: 'leaderboard',
      number: '6',
      title: 'Bảng Xếp Hạng',
      subtitle: 'Vinh danh Bảng Vàng toàn quốc',
      icon: Award,
      iconColor: 'bg-indigo-500 text-white',
      badge: 'Trực tuyến',
      badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      actionText: 'Xem bảng vàng',
    },
  ];

  const completedActionsCount = progress.checklistActions?.length || 0;

  return (
    <div className="space-y-3 sm:space-y-4 pb-4">
      {/* 1. Compact Hero Header (Fits tightly at top without wasting vertical space) */}
      <section className="bg-gradient-to-r from-[#FFF9EA] via-[#F0FDF4] to-[#E0F2FE] border border-[#22B573]/30 rounded-2xl p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Student Welcome info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#22B573] to-[#45B8F5] p-0.5 flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-xl sm:text-2xl leading-none">
                {profile.avatarId === 'water' ? '💧' : profile.avatarId === 'sprout' ? '🌱' : profile.avatarId === 'worm' ? '🪱' : profile.avatarId === 'leaf' ? '🍃' : '🌍'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-[#20352B]">
                  Chào chiến binh <span className="text-[#22B573]">{profile.fullName}</span>!
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-white/80 border border-emerald-200 rounded-full text-[10px] font-extrabold text-emerald-800">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Khoa học 5 · Bài 2
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Lớp {profile.className} · {profile.schoolName} {profile.province ? `(${profile.province})` : ''}
              </p>
            </div>
          </div>

          {/* Quick Progress Bar (Compact inline) */}
          <div className="w-full sm:w-72 bg-white/90 border border-emerald-200/80 rounded-xl p-2 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className="text-slate-700">Tiến độ bài học:</span>
              <span className="text-[#22B573] font-black">{totalPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22B573] via-[#45B8F5] to-[#FFD447] transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(totalPct, 5)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sáu Chức Năng Chính (6 Core Feature Cards in 1 Screen) */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5">
          {featureCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectTab(card.id)}
                className={`group relative flex flex-col justify-between bg-white border rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
                  card.highlight
                    ? 'border-rose-300 ring-2 ring-rose-100 bg-gradient-to-b from-white to-rose-50/20'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Top card bar: icon + badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${card.iconColor} flex items-center justify-center shadow-xs transition-transform group-hover:scale-105`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md border ${card.badgeStyle}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & short subtitle */}
                  <h3 className="text-sm sm:text-base font-black text-[#20352B] group-hover:text-[#22B573] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                    {card.subtitle}
                  </p>
                </div>

                {/* Bottom Action strip */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-xs font-extrabold flex items-center gap-1 transition-colors ${
                      card.highlight ? 'text-rose-600' : 'text-[#22B573]'
                    }`}
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-400">
                    #{card.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Collapsible Action Ribbon: "Em có thể làm gì hôm nay?" (Preserves full actions without pushing screen) */}
      <section className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setShowChecklist((prev) => !prev)}
          className="w-full p-2.5 sm:p-3 bg-gradient-to-r from-emerald-50/60 to-white hover:bg-emerald-50 flex items-center justify-between gap-3 text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#22B573] shrink-0" />
            <div>
              <span className="text-xs sm:text-sm font-black text-[#20352B]">
                Việc làm của chiến binh nhí hôm nay
              </span>
              <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline font-medium">
                (Tích lũy điểm kinh nghiệm khi bảo vệ môi trường đất)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-black">
              {completedActionsCount}/{DAILY_ACTIONS_CHECKLIST.length} việc
            </span>
            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500">
              {showChecklist ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Expandable Checklist Grid */}
        {showChecklist && (
          <div className="p-3 border-t border-emerald-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-50/50 animate-in fade-in duration-150">
            {DAILY_ACTIONS_CHECKLIST.map((action) => {
              const isChecked = progress.checklistActions?.includes(action.id);
              return (
                <div
                  key={action.id}
                  onClick={() => onToggleAction(action.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                    isChecked
                      ? 'border-[#22B573] bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#22B573] text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs truncate ${
                        isChecked ? 'line-through opacity-80' : 'text-slate-800'
                      }`}
                    >
                      {action.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded shrink-0">
                    +{action.points}đ
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
