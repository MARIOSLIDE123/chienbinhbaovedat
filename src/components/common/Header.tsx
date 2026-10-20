import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { User, Trophy, BookOpen, GitFork, Lightbulb, FlaskConical, Award, Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: StudentProfile | null;
  onOpenProfile: () => void;
  onOpenSheetsGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenProfile,
  onOpenSheetsGuide,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEffects.getMuted());

  const handleToggleSound = () => {
    const next = !isMuted;
    soundEffects.setMuted(next);
    setIsMuted(next);
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'lessons', label: 'Học tập' },
    { id: 'mindmap', label: 'Sơ đồ' },
    { id: 'practice', label: 'Luyện tập' },
    { id: 'simulations', label: 'Thí nghiệm' },
    { id: 'arena', label: 'Đấu trường' },
    { id: 'leaderboard', label: 'Xếp hạng' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 transition-shadow">
      <div className="w-full max-w-[1720px] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22B573] to-[#45B8F5] p-0.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-2xl leading-none">🌍</span>
          </div>
          <div>
            <span className="block text-base sm:text-xl font-black tracking-tight text-[#20352B] whitespace-nowrap leading-tight">
              HÀNH TINH XANH
            </span>
            <span className="block text-xs font-black text-[#22B573] tracking-wider uppercase leading-none">
              Chiến Binh Bảo Vệ Đất
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, unboxed, hover underline/active indicator) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm lg:text-base font-extrabold text-slate-600">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap transition-colors py-1.5 border-b-2 ${
                  isActive
                    ? 'text-[#22B573] border-[#22B573]'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Student Action / Profile Badge / Sound Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? 'Bật âm thanh hiệu ứng (Đang tắt)' : 'Tắt âm thanh hiệu ứng (Đang bật)'}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
              isMuted
                ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span className="hidden xl:inline">{isMuted ? 'Tắt âm' : 'Âm thanh: Bật'}</span>
          </button>

          {/* Quick guide button for teachers / connectivity */}
          <button
            type="button"
            onClick={onOpenSheetsGuide}
            title="Kết nối Google Sheets & Apps Script"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors whitespace-nowrap"
          >
            <span>📊 Kết nối Sheets</span>
          </button>

          {profile ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 bg-[#FFF9EA] hover:bg-[#FFF3D2] border border-amber-200 rounded-2xl transition-all shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-base font-bold shadow-xs">
                {profile.avatarId === 'water' ? '💧' : profile.avatarId === 'sprout' ? '🌱' : profile.avatarId === 'worm' ? '🪱' : profile.avatarId === 'leaf' ? '🍃' : '🌍'}
              </div>
              <div className="text-left leading-tight hidden sm:block max-w-[140px] truncate">
                <span className="block text-xs sm:text-sm font-black text-[#20352B] truncate">
                  {profile.fullName.split(' ').slice(-1)[0]}
                </span>
                <span className="block text-xs text-amber-700 font-bold truncate">
                  Lớp {profile.className}
                </span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenProfile}
              className="px-4 py-2 text-xs sm:text-sm font-extrabold text-white bg-[#22B573] rounded-xl hover:bg-[#1faa6a] transition-colors whitespace-nowrap shadow-sm"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 bg-[#FFFDF7]">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#22B573] text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
