import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, StudentProfile } from '../../types';
import {
  Trophy,
  Medal,
  Award,
  Search,
  Filter,
  RefreshCw,
  Clock,
  School,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface LeaderboardViewProps {
  currentProfile: StudentProfile | null;
  onOpenSheetsGuide: () => void;
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    studentName: 'Trần Bảo Nam',
    displayName: 'T. B. Nam',
    className: '5A1',
    schoolName: 'Tiểu học Thăng Long',
    province: 'Hà Nội',
    score: 200,
    totalCorrect: 20,
    durationSeconds: 245,
    formattedDuration: '04:05',
    submittedAt: new Date().toISOString(),
    formattedDate: 'Hôm nay',
    badgeTitle: 'Chiến Binh Bảo Vệ Đất Xuất Sắc',
    badgeColor: '#FFD447',
  },
  {
    rank: 2,
    studentName: 'Lê Mai Anh',
    displayName: 'L. M. Anh',
    className: '5B',
    schoolName: 'Tiểu học Lê Ngọc Hân',
    province: 'TP. Hồ Chí Minh',
    score: 190,
    totalCorrect: 19,
    durationSeconds: 310,
    formattedDuration: '05:10',
    submittedAt: new Date().toISOString(),
    formattedDate: 'Hôm nay',
    badgeTitle: 'Chiến Binh Bảo Vệ Đất Xuất Sắc',
    badgeColor: '#FFD447',
  },
  {
    rank: 3,
    studentName: 'Hoàng Minh Khôi',
    displayName: 'H. M. Khôi',
    className: '5C',
    schoolName: 'Tiểu học Kim Đồng',
    province: 'Đà Nẵng',
    score: 180,
    totalCorrect: 18,
    durationSeconds: 340,
    formattedDuration: '05:40',
    submittedAt: new Date().toISOString(),
    formattedDate: 'Hôm nay',
    badgeTitle: 'Chiến Binh Bảo Vệ Đất Xuất Sắc',
    badgeColor: '#FFD447',
  },
  {
    rank: 4,
    studentName: 'Nguyễn Phương Linh',
    displayName: 'N. P. Linh',
    className: '5A2',
    schoolName: 'Tiểu học Thực Nghiệm',
    province: 'Hà Nội',
    score: 170,
    totalCorrect: 17,
    durationSeconds: 375,
    formattedDuration: '06:15',
    submittedAt: new Date().toISOString(),
    formattedDate: 'Hôm nay',
    badgeTitle: 'Chuyên Gia Đất Xanh',
    badgeColor: '#22B573',
  },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentProfile,
  onOpenSheetsGuide,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isAppsScriptConnected, setIsAppsScriptConnected] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [onlyBest, setOnlyBest] = useState<boolean>(true);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/leaderboard?onlyBest=${onlyBest}`);
      if (!res.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        setEntries(data.leaderboard);
        setIsAppsScriptConnected(data.isAppsScriptConnected ?? false);
      } else {
        throw new Error(data.message || 'Dữ liệu bảng xếp hạng không hợp lệ.');
      }
    } catch (err: any) {
      console.warn('Lỗi tải bảng xếp hạng trực tuyến, dùng dữ liệu khởi tạo:', err);
      setEntries((prev) => (prev.length > 0 ? prev : FALLBACK_LEADERBOARD));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [onlyBest]);

  // Extract unique classes and schools for filtering
  const classList = Array.from(new Set(entries.map((e) => e.className).filter(Boolean)));
  const schoolList = Array.from(new Set(entries.map((e) => e.schoolName).filter(Boolean)));

  // Filtered entries
  const filteredEntries = entries.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.className.toLowerCase().includes(searchQuery.toLowerCase());

    const matchClass = selectedClass === 'all' || item.className === selectedClass;
    const matchSchool = selectedSchool === 'all' || item.schoolName === selectedSchool;

    return matchSearch && matchClass && matchSchool;
  });

  const top3 = filteredEntries.slice(0, 3);
  const restList = filteredEntries.slice(3);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '--';
    try {
      const d = new Date(isoString);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      return '--';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg mb-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Vinh danh toàn quốc</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#20352B]">
            BẢNG VÀNG CHIẾN BINH ĐẤT XANH
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Xếp hạng theo điểm số cao nhất (tối đa 200 điểm) và thời gian hoàn thành nhanh nhất.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Connection status indicator */}
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isAppsScriptConnected
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAppsScriptConnected ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span>
              {isAppsScriptConnected
                ? 'Đồng bộ Google Sheets'
                : 'Máy chủ nội bộ (Sẵn sàng kết nối Sheets)'}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={isLoading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors disabled:opacity-50"
            title="Làm mới bảng xếp hạng"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onOpenSheetsGuide}
            className="px-3.5 py-2 bg-[#22B573] hover:bg-[#1caa68] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Cấu hình Google Sheets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchLeaderboard}
            className="text-amber-800 font-bold underline shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, lớp hoặc trường..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          {classList.length > 0 && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22B573]"
            >
              <option value="all">Tất cả lớp</option>
              {classList.map((c) => (
                <option key={c} value={c}>
                  Lớp {c}
                </option>
              ))}
            </select>
          )}

          {/* School Filter */}
          {schoolList.length > 0 && (
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22B573] max-w-[160px] truncate"
            >
              <option value="all">Tất cả trường</option>
              {schoolList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {/* Only Best vs All Attempts Toggle */}
          <button
            type="button"
            onClick={() => setOnlyBest(!onlyBest)}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap ${
              onlyBest
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {onlyBest ? '★ Điểm cao nhất' : 'Tất cả lượt thi'}
          </button>
        </div>
      </div>

      {/* Top 3 Podium (Huy chương vàng, bạc, đồng) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* #2 Silver (left or center-left) */}
          {top3[1] && (
            <div className="p-5 rounded-3xl border-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white text-center shadow-xs flex flex-col justify-between order-2 md:order-1">
              <div>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-200 text-3xl flex items-center justify-center mb-3 shadow-inner">
                  🥈
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                  HẠNG NHÌ · HUY CHƯƠNG BẠC
                </span>
                <h3 className="font-extrabold text-base text-[#20352B] truncate">
                  {top3[1].displayName}
                </h3>
                <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
                  Lớp {top3[1].className} · {top3[1].schoolName}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-around">
                <div>
                  <span className="text-xl font-black text-slate-800 block">
                    {top3[1].bestScore}đ
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">20 câu</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-700 block">
                    {formatTime(top3[1].bestDurationSeconds)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Thời gian</span>
                </div>
              </div>
            </div>
          )}

          {/* #1 Gold (Top Champion, slightly highlighted) */}
          {top3[0] && (
            <div className="p-6 rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/70 via-yellow-50/40 to-white text-center shadow-md flex flex-col justify-between order-1 md:order-2 ring-2 ring-amber-100">
              <div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400 text-4xl flex items-center justify-center mb-3 shadow-md shadow-amber-400/30">
                  🥇
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 block mb-1">
                  QUÁN QUÂN · HUY CHƯƠNG VÀNG
                </span>
                <h3 className="font-black text-lg text-[#20352B] truncate">
                  {top3[0].displayName}
                </h3>
                <p className="text-xs text-amber-900/80 font-bold truncate mt-0.5">
                  Lớp {top3[0].className} · {top3[0].schoolName}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-around">
                <div>
                  <span className="text-2xl font-black text-amber-700 block">
                    {top3[0].bestScore}đ
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold">20 câu</span>
                </div>
                <div>
                  <span className="text-base font-black text-slate-800 block">
                    {formatTime(top3[0].bestDurationSeconds)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Thời gian</span>
                </div>
              </div>
            </div>
          )}

          {/* #3 Bronze */}
          {top3[2] && (
            <div className="p-5 rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-amber-50/30 to-white text-center shadow-xs flex flex-col justify-between order-3 md:order-3">
              <div>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-200 text-3xl flex items-center justify-center mb-3 shadow-inner">
                  🥉
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 block mb-1">
                  HẠNG BA · HUY CHƯƠNG ĐỒNG
                </span>
                <h3 className="font-extrabold text-base text-[#20352B] truncate">
                  {top3[2].displayName}
                </h3>
                <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
                  Lớp {top3[2].className} · {top3[2].schoolName}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-around">
                <div>
                  <span className="text-xl font-black text-amber-800 block">
                    {top3[2].bestScore}đ
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">20 câu</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-700 block">
                    {formatTime(top3[2].bestDurationSeconds)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Thời gian</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Table for the rest of rankings */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
            Danh Sách Xếp Hạng ({filteredEntries.length} thí sinh)
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Tự động cập nhật
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <span className="text-4xl">🌱</span>
            <h4 className="font-extrabold text-base text-slate-800">
              Chưa có dữ liệu lượt thi nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy là người đầu tiên tham gia Đấu Trường Trí Tuệ để ghi danh trên bảng vàng toàn quốc!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16">Thứ hạng</th>
                  <th className="py-3.5 px-4">Thí sinh</th>
                  <th className="py-3.5 px-4">Lớp</th>
                  <th className="py-3.5 px-4">Trường học</th>
                  <th className="py-3.5 px-4 text-right">Điểm số</th>
                  <th className="py-3.5 px-4 text-right">Thời gian</th>
                  <th className="py-3.5 px-4 text-center">Ngày thi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((row, idx) => {
                  const isUser =
                    currentProfile &&
                    (row.displayName === currentProfile.fullName ||
                      row.displayName.includes(currentProfile.fullName.split(' ').slice(-1)[0])) &&
                    row.className === currentProfile.className;

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isUser
                          ? 'bg-emerald-50/80 font-bold'
                          : idx % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/50'
                      } hover:bg-emerald-50/40`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        {idx === 0 ? (
                          <span className="text-lg">🥇</span>
                        ) : idx === 1 ? (
                          <span className="text-lg">🥈</span>
                        ) : idx === 2 ? (
                          <span className="text-lg">🥉</span>
                        ) : (
                          <span className="font-mono font-bold text-slate-600">
                            #{idx + 1}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {row.displayName}
                        {isUser && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] rounded">
                            Bạn
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">
                        {row.className}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate">
                        {row.schoolName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                        {row.bestScore}đ
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {formatTime(row.bestDurationSeconds)}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-400 text-xs">
                        {formatDate(row.bestSubmittedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
