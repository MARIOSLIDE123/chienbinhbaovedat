import React from 'react';
import { StudentProfile, UserLearningProgress } from '../../types';
import { CaptainEarth } from '../mascot/CaptainEarth';
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
  // Calculate completion percentage:
  // 3 lessons (30%), 3 simulations (30%), practice (20%), arena attempt (20%)
  const lessonPct = (progress.completedLessons.length / 3) * 30;
  const simPct = (progress.completedSimulations.length / 3) * 30;
  const practicePct = (Math.min(progress.practiceCompleted, 8) / 8) * 20;
  const arenaPct = progress.arenaAttempts > 0 ? 20 : 0;
  const totalPct = Math.round(lessonPct + simPct + practicePct + arenaPct);

  const featureCards = [
    {
      id: 'lessons',
      title: 'KHÁM PHÁ KIẾN THỨC',
      description: 'Học 3 chủ đề trọng tâm SGK: Ô nhiễm đất, Xói mòn đất và Biện pháp bảo vệ.',
      icon: BookOpen,
      color: 'bg-emerald-500',
      badge: `${progress.completedLessons.length}/3 chủ đề`,
      buttonText: 'Vào bài học ngay',
    },
    {
      id: 'mindmap',
      title: 'SƠ ĐỒ TƯ DUY',
      description: 'Sơ đồ hình cây trực quan 3 nhánh lớn, mở rộng chi tiết và ôn tập nhanh chóng.',
      icon: GitFork,
      color: 'bg-blue-500',
      badge: 'Sơ đồ tương tác',
      buttonText: 'Khám phá sơ đồ',
    },
    {
      id: 'practice',
      title: 'THỬ TÀI NHANH TRÍ',
      description: '8 trò chơi luyện tập: Phân loại rác, ghép cặp tác hại, thử thách đúng/sai.',
      icon: Lightbulb,
      color: 'bg-amber-500',
      badge: `${progress.practiceCompleted}/8 thử thách`,
      buttonText: 'Luyện tập ngay',
    },
    {
      id: 'simulations',
      title: 'THÍ NGHIỆM VUI',
      description: 'Mô phỏng mưa làm xói mòn đất, hành trình rác thải và xử lý nước thải.',
      icon: FlaskConical,
      color: 'bg-purple-500',
      badge: `${progress.completedSimulations.length}/3 thí nghiệm`,
      buttonText: 'Vào phòng lab',
    },
    {
      id: 'arena',
      title: 'ĐẤU TRƯỜNG TRÍ TUỆ',
      description: 'Thử thách 20 câu hỏi tính giờ 10 phút, đạt tối đa 200 điểm và rinh huy hiệu vàng!',
      icon: Trophy,
      color: 'bg-rose-500',
      badge: progress.highestScore > 0 ? `Điểm cao: ${progress.highestScore}/200` : '20 câu · 200 điểm',
      buttonText: 'Tham gia thi ngay',
      highlight: true,
    },
    {
      id: 'leaderboard',
      title: 'BẢNG XẾP HẠNG TOÀN QUỐC',
      description: 'Vinh danh các chiến binh nhí điểm cao nhất trên cả nước kết nối Google Sheets.',
      icon: Award,
      color: 'bg-indigo-500',
      badge: 'Trực tuyến toàn quốc',
      buttonText: 'Xem bảng vàng',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-[#FFF9EA] via-[#F0FDF4] to-[#E0F2FE] border-2 border-[#22B573]/20 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Bài 2: Ô nhiễm, xói mòn và bảo vệ môi trường đất</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#20352B] tracking-tight">
              Chào chiến binh <span className="text-[#22B573]">{profile.fullName}</span>!
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-medium max-w-2xl leading-relaxed">
              Hôm nay chúng ta cùng học cách bảo vệ đất nhé! Hãy khám phá bài học, tham gia thí nghiệm vui và chinh phục 20 câu hỏi Đấu Trường Trí Tuệ!
            </p>

            {/* School and Class tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-bold text-slate-600 pt-1">
              <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                🏫 {profile.schoolName}
              </span>
              <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                🏷️ Lớp {profile.className}
              </span>
              {profile.province && (
                <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  📍 {profile.province}
                </span>
              )}
            </div>
          </div>

          {/* Captain Earth Mascot with Cheer */}
          <div className="shrink-0">
            <CaptainEarth
              mood="cheer"
              message={`Sẵn sàng chưa ${profile.fullName.split(' ').slice(-1)[0]} ơi? Chúng mình cùng giải cứu đất mẹ nào!`}
              size="lg"
            />
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6 pt-6 border-t border-emerald-200/60">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
            <span className="text-slate-700">Tiến độ bài học của em:</span>
            <span className="text-[#22B573] font-black">{totalPct}% Hoàn thành</span>
          </div>
          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border border-emerald-200 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#22B573] via-[#45B8F5] to-[#FFD447] transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(totalPct, 5)}%` }}
            />
          </div>
        </div>
      </section>

      {/* 6 Large Feature Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#20352B]">
            6 Khu Vực Khám Phá
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Chọn một khu vực để bắt đầu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className={`relative flex flex-col justify-between bg-white border rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  card.highlight
                    ? 'border-rose-300 ring-2 ring-rose-100 shadow-md'
                    : 'border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#20352B] mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    {card.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab(card.id)}
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    card.highlight
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20'
                      : 'bg-[#FFF9EA] hover:bg-[#22B573] hover:text-white text-[#20352B] border border-amber-200 hover:border-[#22B573]'
                  }`}
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* "Em có thể làm gì hôm nay?" Daily Action Checklist */}
      <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#22B573]" />
              <h3 className="text-xl font-black text-[#20352B]">
                Em Có Thể Làm Gì Hôm Nay?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Mỗi hành động nhỏ của em đều góp phần bảo vệ đất mẹ thêm màu mỡ và trong lành!
            </p>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
            Hoàn thành: {progress.checklistActions?.length || 0}/{DAILY_ACTIONS_CHECKLIST.length} việc làm
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DAILY_ACTIONS_CHECKLIST.map((action) => {
            const isChecked = progress.checklistActions?.includes(action.id);
            return (
              <div
                key={action.id}
                onClick={() => onToggleAction(action.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'border-[#22B573] bg-emerald-50/80 shadow-2xs'
                    : 'border-slate-200 bg-[#FFFDF7] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-[#22B573] text-white' : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-slate-800'
                    }`}
                  >
                    {action.text}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md shrink-0">
                  +{action.points}đ
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
