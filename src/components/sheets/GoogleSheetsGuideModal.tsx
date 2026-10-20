import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Server,
  Play,
} from 'lucide-react';

interface GoogleSheetsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsGuideModal: React.FC<GoogleSheetsGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [testUrl, setTestUrl] = useState<string>('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const codeSnippet = `/**
 * HÀNH TINH XANH – CHIẾN BINH BẢO VỆ ĐẤT
 * GOOGLE APPS SCRIPT BACKEND CHẤM ĐIỂM, ĐỒNG BỘ DỮ LIỆU & BẢNG XẾP HẠNG REAL-TIME
 * Xem đầy đủ tệp tại google-apps-script/Code.gs
 */
var MASTER_ANSWER_KEY = {
  "Q01": "B", "Q02": "C", "Q03": "D", "Q04": "B", "Q05": "A",
  "Q06": "C", "Q07": "B", "Q08": "D", "Q09": "A", "Q10": "C",
  "Q11": "B", "Q12": "D", "Q13": "A", "Q14": "C", "Q15": "D",
  "Q16": "B", "Q17": "C", "Q18": "A", "Q19": "D", "Q20": "B"
};

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'leaderboard';
  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({ success: true, status: "connected" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return getLeaderboardResponse();
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Hệ thống bận" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var payload = JSON.parse(e.postData ? e.postData.contents : "{}");
    var action = payload.action || (payload.answers ? 'score' : 'sync_progress');
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'score' || payload.answers) return handleQuizSubmission(ss, payload);
    if (action === 'sync_progress') return handleProgressSync(ss, payload);
    if (action === 'log_activity') return handleActivityLog(ss, payload);

    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Lỗi action" }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
/* Xem toàn bộ mã nguồn 400 dòng tại file google-apps-script/Code.gs */`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const runTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Đang gửi tín hiệu kiểm tra kết nối tới máy chủ...');
    try {
      const res = await fetch('/api/test-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customUrl: testUrl || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus('success');
        setTestMessage(data.message || 'Kết nối Google Apps Script thành công 100%!');
      } else {
        setTestStatus('error');
        setTestMessage(data.message || 'Không thể kết nối. Vui lòng kiểm tra lại URL Web App.');
      }
    } catch (e: any) {
      setTestStatus('error');
      setTestMessage('Lỗi gửi yêu cầu: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-emerald-300 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#20352B]">
                Tích Hợp Google Sheets & Apps Script
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Lưu trữ điểm số vĩnh viễn và xếp hạng toàn quốc theo thời gian thực
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700">
          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#22B573] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <span>Tạo Google Sheets và mở Apps Script</span>
            </h4>
            <p className="pl-8 leading-relaxed font-medium">
              Tạo một bảng tính Google Sheets mới tại{' '}
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 font-bold underline inline-flex items-center gap-1"
              >
                sheets.new <ExternalLink className="w-3 h-3" />
              </a>
              . Đặt tên là <strong>"Hành Tinh Xanh - Bảng Điểm Toàn Quốc"</strong>. Sau đó vào menu{' '}
              <strong>Tiện ích mở rộng (Extensions) → Apps Script</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#22B573] text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <span>Dán mã nguồn Code.gs</span>
              </h4>
              <button
                type="button"
                onClick={copyCode}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép!' : 'Sao chép mã Code.gs'}</span>
              </button>
            </div>
            <p className="pl-8 text-slate-500 font-medium">
              (Mã đầy đủ cũng đã được tạo sẵn trong thư mục <code>google-apps-script/Code.gs</code> của ứng dụng này).
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#22B573] text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <span>Chạy hàm setupSpreadsheet() lần đầu</span>
            </h4>
            <p className="pl-8 leading-relaxed font-medium">
              Trong trình soạn thảo Apps Script, tại thanh công cụ chọn hàm <strong>setupSpreadsheet</strong> và bấm nút <strong>Chạy (Run)</strong>. Cấp quyền truy cập khi Google yêu cầu. Hàm này sẽ tự động tạo và định dạng 4 trang tính:
              <br />
              • 🏆 <strong>Leaderboard:</strong> Bảng vàng xếp hạng trực tuyến tự động sắp xếp theo điểm và thời gian.
              <br />
              • 📝 <strong>Scores:</strong> Lưu chi tiết bài thi Đấu Trường Trí Tuệ và đáp án 20 câu.
              <br />
              • 📊 <strong>StudentProgress:</strong> Lưu tiến trình học (bài học SGK, thí nghiệm, thực hành, việc tốt, thời lượng học qua app).
              <br />
              • ⚡ <strong>ActivityLogs:</strong> Nhật ký ghi nhận tức thời mọi hành động (đăng nhập, hoàn thành bài, nộp bài,...).
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#22B573] text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <span>Triển khai thành Web App (Deploy)</span>
            </h4>
            <p className="pl-8 leading-relaxed font-medium">
              Bấm nút xanh <strong>Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)</strong>.
              <br />
              • Chọn loại: <strong>Ứng dụng web (Web App)</strong>
              <br />
              • Thực thi dưới dạng (Execute as): <strong>Tôi (Me)</strong>
              <br />
              • Ai có quyền truy cập (Who has access): <strong>Bất kỳ ai (Anyone)</strong>
              <br />
              Bấm Triển khai và sao chép <strong>URL ứng dụng web</strong> (dạng <code>https://script.google.com/macros/s/AKfycb.../exec</code>).
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#22B573] text-white text-xs font-black flex items-center justify-center">
                5
              </span>
              <span>Cấu hình biến môi trường APPS_SCRIPT_URL</span>
            </h4>
            <p className="pl-8 leading-relaxed font-medium">
              Dán URL vừa sao chép vào biến <code>APPS_SCRIPT_URL="..."</code> trong file <code>.env</code> của máy chủ. Máy chủ Node.js sẽ đóng vai trò trung gian an toàn bảo mật, gửi dữ liệu thi lên Sheets và lấy bảng xếp hạng về cho học sinh mà không để lộ bất kỳ khóa bí mật nào trên trình duyệt!
            </p>
          </div>

          {/* Live Connection Test Box */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Kiểm Tra Nhanh Kết Nối Web App:</span>
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="Nhập URL Apps Script (để trống nếu dùng APPS_SCRIPT_URL trong .env)"
                className="w-full sm:flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22B573]"
              />
              <button
                type="button"
                onClick={runTestConnection}
                disabled={testStatus === 'testing'}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{testStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}</span>
              </button>
            </div>

            {testStatus !== 'idle' && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  testStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : testStatus === 'error'
                    ? 'bg-rose-50 text-rose-900 border border-rose-300'
                    : 'bg-amber-50 text-amber-900 border border-amber-300'
                }`}
              >
                {testMessage}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#22B573] hover:bg-[#1caa68] text-white font-extrabold text-xs rounded-xl shadow-xs"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
