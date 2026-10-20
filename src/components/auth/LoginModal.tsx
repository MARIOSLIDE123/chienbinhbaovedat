import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { CaptainEarth } from '../mascot/CaptainEarth';
import { User, School, BookOpen, MapPin, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  onLogin: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
}

const AVATAR_OPTIONS = [
  { id: 'earth', name: 'Đội trưởng Đất', emoji: '🌍' },
  { id: 'sprout', name: 'Mầm Non Vui Vẻ', emoji: '🌱' },
  { id: 'water', name: 'Giọt Nước Nhỏ', emoji: '💧' },
  { id: 'worm', name: 'Giun Đất Chăm Chỉ', emoji: '🪱' },
  { id: 'leaf', name: 'Chiếc Lá Xanh', emoji: '🍃' },
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
      setErrorMsg('Vui lòng nhập Họ và tên của em để nhận chứng nhận chiến binh!');
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

    // Save to local storage
    localStorage.setItem('green_planet_student', JSON.stringify(profile));
    onLogin(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FFFDF7] border-2 border-[#22B573]/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Header Mascot greeting */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <CaptainEarth
              mood="greeting"
              size="md"
              showSpeechBubble={false}
              className="justify-center"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20352B] tracking-tight">
            HÀNH TINH XANH
          </h2>
          <p className="text-sm font-semibold text-[#22B573] uppercase tracking-wider mt-0.5">
            CHIẾN BINH BẢO VỆ ĐẤT
          </p>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
            Xin chào chiến binh nhí! Hãy nhập thông tin để bắt đầu hành trình giải cứu Trái Đất nhé!
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium flex items-center gap-2">
            <span className="shrink-0 text-base">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chọn nhân vật đại diện của em:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatarId(av.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all ${
                    avatarId === av.id
                      ? 'border-[#22B573] bg-emerald-50 scale-105 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl select-none">{av.emoji}</span>
                  <span className="text-[11px] font-bold text-slate-700 mt-1 truncate max-w-full">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Họ và tên của em <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Minh Anh"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] focus:border-transparent text-base font-medium"
              />
            </div>
          </div>

          {/* Class & School row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Lớp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Ví dụ: 5A1"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] focus:border-transparent text-base font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Trường học <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Ví dụ: Tiểu học Kim Đồng"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] focus:border-transparent text-base font-medium"
                />
              </div>
            </div>
          </div>

          {/* Optional Province */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Tỉnh / Thành phố <span className="text-xs text-slate-400 font-normal">(Tùy chọn)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573] focus:border-transparent text-base font-medium"
              />
            </div>
          </div>

          {/* Privacy Toggle: Mask name on public leaderboard */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="abbrev-checkbox"
              checked={useAbbreviatedName}
              onChange={(e) => setUseAbbreviatedName(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#22B573] rounded border-slate-300 focus:ring-[#22B573]"
            />
            <label htmlFor="abbrev-checkbox" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
              <strong className="text-[#20352B] block mb-0.5">Bảo vệ thông tin cá nhân:</strong>
              Hiển thị tên viết tắt trên Bảng xếp hạng toàn quốc (Ví dụ: <em>Nguyễn Minh Anh</em> sẽ hiển thị thành <em>N. M. Anh</em>).
            </label>
          </div>

          {/* Notice about score recording */}
          <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thông tin được dùng để ghi nhận thành tích và cấp huy hiệu học tập.</span>
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#22B573] hover:bg-[#1caa68] text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>BẮT ĐẦU HÀNH TRÌNH</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
