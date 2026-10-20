import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { User, School, BookOpen, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onLogin: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
}

const AVATAR_OPTIONS = [
  { id: 'earth', name: 'Đất Xanh', emoji: '🌍' },
  { id: 'sprout', name: 'Mầm Non', emoji: '🌱' },
  { id: 'water', name: 'Nước Nhỏ', emoji: '💧' },
  { id: 'worm', name: 'Giun Đất', emoji: '🪱' },
  { id: 'leaf', name: 'Lá Xanh', emoji: '🍃' },
];

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, initialProfile }) => {
  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [className, setClassName] = useState(initialProfile?.className || '');
  const [schoolName, setSchoolName] = useState(initialProfile?.schoolName || '');
  const [province, setProvince] = useState(initialProfile?.province || '');
  const [useAbbreviatedName, setUseAbbreviatedName] = useState(
    initialProfile?.useAbbreviatedName ?? true
  );
  const [avatarId, setAvatarId] = useState(initialProfile?.avatarId || 'earth');
  const [errorMsg, setErrorMsg] = useState('');

  const normalizeSpaces = (str: string) => str.replace(/\s+/g, ' ').trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = normalizeSpaces(fullName);
    const cleanClass = normalizeSpaces(className);
    const cleanSchool = normalizeSpaces(schoolName);
    const cleanProvince = normalizeSpaces(province);

    if (!cleanName) {
      setErrorMsg('Vui lòng nhập Họ và tên để nhận chứng nhận chiến binh!');
      return;
    }
    if (cleanName.length < 2) {
      setErrorMsg('Họ và tên cần có ít nhất 2 ký tự hợp lệ.');
      return;
    }
    if (!cleanClass) {
      setErrorMsg('Vui lòng nhập Lớp của em (Ví dụ: 5A1, 4B...).');
      return;
    }
    if (!cleanSchool) {
      setErrorMsg('Vui lòng nhập Tên trường tiểu học của em.');
      return;
    }

    setErrorMsg('');

    const profile: StudentProfile = {
      fullName: cleanName,
      className: cleanClass,
      schoolName: cleanSchool,
      province: cleanProvince || undefined,
      useAbbreviatedName,
      avatarId,
    };

    localStorage.setItem('green_planet_student', JSON.stringify(profile));
    onLogin(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-2 sm:p-4 h-[100dvh] max-h-[100dvh] overflow-hidden pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="bg-[#FFFDF7] border-2 border-emerald-400/40 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[96dvh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Left Side (Desktop): Brand & Mascot / Top Bar (Mobile) */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-500/15 via-[#FFF9EA] to-emerald-100/60 p-3.5 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-emerald-100 shrink-0">
          {/* Header text & logo */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl sm:text-2xl">🌍</span>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-[#20352B] leading-none">
                  HÀNH TINH XANH
                </h1>
                <span className="text-[10px] sm:text-xs font-black text-[#22B573] tracking-wider uppercase block">
                  Chiến Binh Bảo Vệ Đất · Lớp 5
                </span>
              </div>
            </div>

            {/* Mascot on desktop */}
            <div className="hidden md:flex flex-col items-center text-center my-4">
              <CaptainEarth
                mood="greeting"
                size="md"
                showSpeechBubble={false}
                className="justify-center drop-shadow-md scale-95"
              />
              <div className="mt-2 p-2.5 bg-white/90 border border-emerald-200/80 rounded-xl text-xs font-semibold text-slate-700 leading-snug shadow-2xs">
                Chào bạn nhỏ! Nhập tên để cùng giải cứu Đất Mẹ và ghi danh Bảng Vàng nhé! 🌱
              </div>
            </div>
          </div>

          {/* Quick contest highlights (desktop only) */}
          <div className="hidden md:flex flex-col gap-1.5 text-[11px] font-bold text-emerald-900/90 pt-2 border-t border-emerald-200/60">
            <span className="flex items-center gap-1.5">
              <span>⭐</span> 20 câu hỏi Đấu trường tính giờ
            </span>
            <span className="flex items-center gap-1.5">
              <span>🔬</span> 3 phòng thí nghiệm khoa học vui
            </span>
            <span className="flex items-center gap-1.5">
              <span>🏆</span> Bảng xếp hạng trực tuyến toàn quốc
            </span>
          </div>
        </div>

        {/* Right Side: Compact Form (Single-screen fitting) */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-3.5 sm:p-5 md:p-6 flex flex-col justify-between overflow-y-auto overscroll-contain space-y-2.5 sm:space-y-3"
        >
          {/* Title on mobile only */}
          <div className="md:hidden flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-xs font-extrabold text-slate-800">
              Nhập thông tin chiến binh nhí:
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Khoa học 5 · Bài 2
            </span>
          </div>

          {/* Avatar selector (Compact row) */}
          <div>
            <span className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
              Chọn nhân vật đại diện:
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatarId(av.id)}
                  className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-xl border transition-all ${
                    avatarId === av.id
                      ? 'border-[#22B573] bg-emerald-50 ring-2 ring-emerald-200 shadow-2xs scale-102'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg sm:text-xl select-none leading-none">{av.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700 mt-0.5 truncate max-w-full">
                    {av.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-1.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Input: Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-0.5">
              Họ và tên của em <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Minh Anh"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Inputs Row: Class & School */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-0.5">
                Lớp học <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Ví dụ: 5A1, 5B..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] text-sm font-semibold transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-0.5">
                Trường tiểu học <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Ví dụ: TH Kim Đồng"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] text-sm font-semibold transition-all"
                />
              </div>
            </div>
          </div>

          {/* Input: Province (Optional, compact) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-0.5">
              Tỉnh / Thành phố <span className="text-[10px] text-slate-400 font-normal">(Tùy chọn)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Ví dụ: Hà Nội, TP.HCM, Đà Nẵng..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Privacy Toggle: Mask name on leaderboard */}
          <div className="p-2 sm:p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-center gap-2.5">
            <input
              type="checkbox"
              id="abbrev-checkbox"
              checked={useAbbreviatedName}
              onChange={(e) => setUseAbbreviatedName(e.target.checked)}
              className="w-4 h-4 text-[#22B573] rounded border-slate-300 focus:ring-[#22B573] shrink-0"
            />
            <label htmlFor="abbrev-checkbox" className="text-[11px] text-slate-700 leading-tight cursor-pointer select-none">
              <strong className="text-emerald-900 mr-1">Bảo vệ quyền riêng tư:</strong>
              Hiển thị tên viết tắt trên Bảng xếp hạng (Ví dụ: <em>N. M. Anh</em>).
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-[#22B573] via-[#1caa68] to-[#179659] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-1 shrink-0"
          >
            <span>BẮT ĐẦU HÀNH TRÌNH</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
