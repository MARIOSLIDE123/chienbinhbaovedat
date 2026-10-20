import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, StudentProfile } from '../../types';
import {
  Trophy,
  Search,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface LeaderboardViewProps {
  currentProfile?: StudentProfile | null;
}

const APPS_SCRIPT_DIRECT_URL =
  'https://script.google.com/macros/s/AKfycbzO0Oo2mYzpWuk6mfaQNPu3XlKGqDBJzKaLpLpHS0bj5h4oxuDQSHSjBNaDpDN1SXo1/exec';

export const LeaderboardView: React.FC<LeaderboardViewProps> = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAppsScriptConnected, setIsAppsScriptConnected] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [onlyBest, setOnlyBest] = useState<boolean>(true);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    let loaded = false;

    // 1. Try fetching via backend API endpoint
    try {
      const res = await fetch(`/api/leaderboard?onlyBest=${onlyBest}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
          setEntries(data.leaderboard);
          setIsAppsScriptConnected(true);
          setIsLoading(false);
          loaded = true;
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend API proxy chưa sẵn sàng, thử tải trực tiếp từ Apps Script...', err);
    }

    // 2. Fallback: Direct fetch from Google Apps Script Web App
    if (!loaded) {
      try {
        const directRes = await fetch(`${APPS_SCRIPT_DIRECT_URL}?action=leaderboard`);
        if (directRes.ok) {
          const directData = await directRes.json();
          if (directData.success && Array.isArray(directData.leaderboard) && directData.leaderboard.length > 0) {
            setEntries(directData.leaderboard);
            setIsAppsScriptConnected(true);
            setIsLoading(false);
            loaded = true;
            return;
          }
        }
      } catch (directErr) {
        console.warn('Lỗi kết nối trực tiếp Apps Script:', directErr);
      }
    }

    if (!loaded) {
      setEntries([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [onlyBest]);

  const classList = Array.from(new Set(entries.map((e) => e.className).filter(Boolean)));

  const filteredEntries = entries.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.className.toLowerCase().includes(searchQuery.toLowerCase());

    const matchClass = selectedClass === 'all' || item.className === selectedClass;
    return matchSearch && matchClass;
  });

  const top3 = filteredEntries.slice(0, 3);
  const restList = filteredEntries.slice(3);

  const formatTime = (secs?: number) => {
    if (typeof secs !== 'number') return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-3 pb-6">
      {/* 1. Compact Header Banner */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            🏆
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-[#20352B] leading-tight">
              BẢNG VÀNG CHIẾN BINH ĐẤT XANH
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Vinh danh thành tích cao nhất (tối đa 200 điểm) & thời gian nhanh nhất
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time status indicator */}
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Trực tuyến (Real-time)</span>
          </span>

          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={isLoading}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            title="Làm mới bảng xếp hạng"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Compact Search & Filter Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 sm:p-2.5 shadow-2xs flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, lớp hoặc trường..."
            className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#22B573]"
          />
        </div>

        {classList.length > 0 && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả lớp</option>
            {classList.map((c) => (
              <option key={c} value={c}>
                Lớp {c}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={() => setOnlyBest(!onlyBest)}
          className={`py-1 px-2.5 rounded-lg text-xs font-extrabold border transition-colors whitespace-nowrap shrink-0 ${
            onlyBest
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          {onlyBest ? '★ Điểm cao nhất' : 'Tất cả lượt'}
        </button>
      </div>

      {/* Empty State when no real submissions exist yet */}
      {!isLoading && entries.length === 0 && (
        <div className="bg-white border-2 border-dashed border-emerald-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
            🏆
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-black text-[#20352B]">
              Bảng Vàng Đang Chờ Đón Chiến Binh Đầu Tiên!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Chưa có lượt thi nào được ghi nhận trên hệ thống. Hãy tham gia <strong className="text-emerald-700">Đấu Trường Trí Tuệ</strong> để ghi tên mình lên Bảng Vàng toàn quốc ngay bây giờ!
            </p>
          </div>
        </div>
      )}

      {/* 3. Top 3 Podium (Only when there are real entries) */}
      {entries.length > 0 && top3.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          {/* #2 Silver */}
          {top3[1] && (
            <div className="p-2 sm:p-3 rounded-2xl border border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xl sm:text-2xl block mb-0.5">🥈</span>
                <span className="text-[10px] font-black text-slate-500 uppercase block">Hạng Nhì</span>
                <h4 className="font-black text-xs sm:text-sm text-[#20352B] truncate">{top3[1].displayName}</h4>
                <p className="text-[10px] text-slate-500 truncate">Lớp {top3[1].className} · {top3[1].schoolName}</p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-around text-xs">
                <span className="font-black text-slate-800">{top3[1].score ?? (top3[1] as any).bestScore}đ</span>
                <span className="text-[10px] text-slate-500">{formatTime(top3[1].durationSeconds ?? (top3[1] as any).bestDurationSeconds)}</span>
              </div>
            </div>
          )}

          {/* #1 Gold */}
          {top3[0] && (
            <div className="p-2.5 sm:p-3.5 rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white shadow-xs flex flex-col justify-between ring-2 ring-amber-100">
              <div>
                <span className="text-2xl sm:text-3xl block mb-0.5">🥇</span>
                <span className="text-[10px] font-black text-amber-800 uppercase block">Quán Quân</span>
                <h4 className="font-black text-xs sm:text-base text-[#20352B] truncate">{top3[0].displayName}</h4>
                <p className="text-[10px] text-amber-900/80 font-bold truncate">Lớp {top3[0].className} · {top3[0].schoolName}</p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200/60 flex items-center justify-around text-xs">
                <span className="font-black text-amber-700 text-sm">{top3[0].score ?? (top3[0] as any).bestScore}đ</span>
                <span className="text-[10px] text-slate-600 font-bold">{formatTime(top3[0].durationSeconds ?? (top3[0] as any).bestDurationSeconds)}</span>
              </div>
            </div>
          )}

          {/* #3 Bronze */}
          {top3[2] && (
            <div className="p-2 sm:p-3 rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/40 to-white shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xl sm:text-2xl block mb-0.5">🥉</span>
                <span className="text-[10px] font-black text-amber-700 uppercase block">Hạng Ba</span>
                <h4 className="font-black text-xs sm:text-sm text-[#20352B] truncate">{top3[2].displayName}</h4>
                <p className="text-[10px] text-slate-500 truncate">Lớp {top3[2].className} · {top3[2].schoolName}</p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-around text-xs">
                <span className="font-black text-amber-800">{top3[2].score ?? (top3[2] as any).bestScore}đ</span>
                <span className="text-[10px] text-slate-500">{formatTime(top3[2].durationSeconds ?? (top3[2] as any).bestDurationSeconds)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Rankings Table Container (Contained scrolling, fits within screen) */}
      {entries.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-2 sm:p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Danh sách xếp hạng ({filteredEntries.length} thí sinh)</span>
            <span className="text-[11px] text-slate-400 font-normal">Cập nhật tự động</span>
          </div>

          <div className="max-h-60 overflow-y-auto overscroll-contain">
            {filteredEntries.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Không tìm thấy thí sinh nào phù hợp với bộ lọc tìm kiếm.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-center w-12">Hạng</th>
                    <th className="py-2 px-3">Họ và tên</th>
                    <th className="py-2 px-3">Lớp & Trường</th>
                    <th className="py-2 px-3 text-right">Điểm</th>
                    <th className="py-2 px-3 text-right">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 text-center font-bold text-slate-700">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 truncate max-w-[140px]">
                        {item.displayName}
                      </td>
                      <td className="py-2 px-3 text-slate-600 truncate max-w-[180px]">
                        Lớp {item.className} · {item.schoolName}
                      </td>
                      <td className="py-2 px-3 text-right font-black text-emerald-700">
                        {item.score ?? (item as any).bestScore}đ
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono text-[11px]">
                        {formatTime(item.durationSeconds ?? (item as any).bestDurationSeconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
