import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || '';
const SHEETS_SHARED_SECRET = process.env.SHEETS_SHARED_SECRET || 'green-planet-secret-key-2026';

app.use(express.json());

// Master Answer Key for server-side evaluation (Anti-tamper protection)
const MASTER_ANSWER_KEY: Record<string, 'A' | 'B' | 'C' | 'D'> = {
  Q01: 'B',
  Q02: 'C',
  Q03: 'D',
  Q04: 'B',
  Q05: 'A',
  Q06: 'C',
  Q07: 'B',
  Q08: 'D',
  Q09: 'A',
  Q10: 'C',
  Q11: 'B',
  Q12: 'D',
  Q13: 'A',
  Q14: 'C',
  Q15: 'D',
  Q16: 'B',
  Q17: 'C',
  Q18: 'A',
  Q19: 'D',
  Q20: 'B',
};

// In-memory attempts database (with initial starter mock records for demonstration when Apps Script is not yet configured)
interface ServerAttempt {
  attemptId: string;
  studentName: string;
  displayName: string;
  className: string;
  schoolName: string;
  province?: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  durationSeconds: number;
  startedAt: string;
  submittedAt: string;
  status: string;
  answersSummary: Record<string, string>;
}

const memoryAttempts: ServerAttempt[] = [
  {
    attemptId: 'seed_01',
    studentName: 'Trần Bảo Nam',
    displayName: 'T. B. Nam',
    className: '5A1',
    schoolName: 'Tiểu học Thăng Long',
    province: 'Hà Nội',
    score: 200,
    totalCorrect: 20,
    totalQuestions: 20,
    durationSeconds: 245,
    startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 5 + 245000).toISOString(),
    status: 'completed',
    answersSummary: { ...MASTER_ANSWER_KEY },
  },
  {
    attemptId: 'seed_02',
    studentName: 'Lê Mai Anh',
    displayName: 'L. M. Anh',
    className: '5B',
    schoolName: 'Tiểu học Lê Ngọc Hân',
    province: 'TP. Hồ Chí Minh',
    score: 190,
    totalCorrect: 19,
    totalQuestions: 20,
    durationSeconds: 310,
    startedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 8 + 310000).toISOString(),
    status: 'completed',
    answersSummary: { ...MASTER_ANSWER_KEY, Q18: 'C' },
  },
  {
    attemptId: 'seed_03',
    studentName: 'Hoàng Minh Khôi',
    displayName: 'H. M. Khôi',
    className: '5C',
    schoolName: 'Tiểu học Kim Đồng',
    province: 'Đà Nẵng',
    score: 180,
    totalCorrect: 18,
    totalQuestions: 20,
    durationSeconds: 340,
    startedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 12 + 340000).toISOString(),
    status: 'completed',
    answersSummary: { ...MASTER_ANSWER_KEY, Q19: 'A', Q20: 'C' },
  },
  {
    attemptId: 'seed_04',
    studentName: 'Nguyễn Thảo Nhi',
    displayName: 'N. T. Nhi',
    className: '5A2',
    schoolName: 'Tiểu học Chu Văn An',
    province: 'Hải Phòng',
    score: 170,
    totalCorrect: 17,
    totalQuestions: 20,
    durationSeconds: 380,
    startedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 15 + 380000).toISOString(),
    status: 'completed',
    answersSummary: { ...MASTER_ANSWER_KEY, Q08: 'A', Q12: 'B', Q18: 'C' },
  },
  {
    attemptId: 'seed_05',
    studentName: 'Đặng Tuấn Kiệt',
    displayName: 'Đ. T. Kiệt',
    className: '5E',
    schoolName: 'Tiểu học Nguyễn Du',
    province: 'Cần Thơ',
    score: 160,
    totalCorrect: 16,
    totalQuestions: 20,
    durationSeconds: 420,
    startedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 20 + 420000).toISOString(),
    status: 'completed',
    answersSummary: { ...MASTER_ANSWER_KEY },
  },
];

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    isAppsScriptConfigured: Boolean(APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim().length > 0),
    timestamp: new Date().toISOString(),
  });
});

// Test Connection with Apps Script
app.post('/api/test-sheets', async (req, res) => {
  const targetUrl = req.body.customUrl || APPS_SCRIPT_URL;

  if (!targetUrl || targetUrl.trim().length === 0) {
    return res.json({
      success: false,
      message: 'Chưa có URL Apps Script. Vui lòng triển khai Web App và nhập URL vào ô bên trên hoặc biến APPS_SCRIPT_URL trong .env.',
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const pingUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}action=ping`;
    const response = await fetch(pingUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return res.json({
        success: true,
        message: 'Kết nối thành công với Google Apps Script! Sẵn sàng ghi điểm và đồng bộ xếp hạng.',
        data,
      });
    } else {
      return res.json({
        success: false,
        message: `Google Apps Script trả về mã lỗi: ${response.status}. Hãy kiểm tra xem quyền truy cập Web App đã để là 'Anyone' (Bất kỳ ai) chưa.`,
      });
    }
  } catch (err: any) {
    return res.json({
      success: false,
      message: `Không thể kết nối đến URL Apps Script: ${err.message}`,
    });
  }
});

// GET Leaderboard API
app.get('/api/leaderboard', async (req, res) => {
  const onlyBest = req.query.onlyBest !== 'false';

  // 1. Try pulling directly from configured Google Apps Script Web App
  if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const fetchUrl = `${APPS_SCRIPT_URL}${APPS_SCRIPT_URL.includes('?') ? '&' : '?'}action=leaderboard`;
      const response = await fetch(fetchUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.leaderboard)) {
          return res.json({
            success: true,
            leaderboard: data.leaderboard,
            isAppsScriptConnected: true,
            source: 'google-sheets',
          });
        }
      }
    } catch (e) {
      console.warn('Apps Script fetch failed or timed out, using server memory store fallback:', e);
    }
  }

  // 2. Fallback to memory store
  let list = [...memoryAttempts];

  if (onlyBest) {
    const bestMap: Record<string, ServerAttempt> = {};
    for (const att of list) {
      const key = `${att.studentName}_${att.className}_${att.schoolName}`.toLowerCase();
      if (!bestMap[key]) {
        bestMap[key] = att;
      } else {
        const curr = bestMap[key];
        if (
          att.score > curr.score ||
          (att.score === curr.score && att.durationSeconds < curr.durationSeconds)
        ) {
          bestMap[key] = att;
        }
      }
    }
    list = Object.values(bestMap);
  }

  // Sort: highest score first -> shortest duration -> earliest submission
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.durationSeconds !== b.durationSeconds) return a.durationSeconds - b.durationSeconds;
    return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
  });

  const formattedLeaderboard = list.map((item, index) => ({
    rank: index + 1,
    displayName: item.displayName,
    className: item.className,
    schoolName: item.schoolName,
    province: item.province,
    bestScore: item.score,
    bestCorrect: item.totalCorrect,
    bestDurationSeconds: item.durationSeconds,
    bestSubmittedAt: item.submittedAt,
  }));

  res.json({
    success: true,
    leaderboard: formattedLeaderboard,
    isAppsScriptConnected: Boolean(APPS_SCRIPT_URL),
    source: 'server-memory',
  });
});

// POST Score Verification API
app.post('/api/score', async (req, res) => {
  try {
    const {
      attemptId,
      studentProfile,
      answers, // [{ questionId: 'Q01', selectedOption: 'B' }]
      durationSeconds,
      startedAt,
      submittedAt,
      isTimeout,
    } = req.body;

    if (!studentProfile || !studentProfile.fullName) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin học sinh.',
      });
    }

    // Server-side recalculation of score (Do not trust client-calculated scores)
    const answersSummary: Record<string, string> = {};
    let correctCount = 0;

    if (Array.isArray(answers)) {
      for (const item of answers) {
        if (item.questionId && item.selectedOption) {
          answersSummary[item.questionId] = item.selectedOption;
          if (MASTER_ANSWER_KEY[item.questionId] === item.selectedOption) {
            correctCount++;
          }
        }
      }
    }

    const calculatedScore = correctCount * 10;
    const finalDuration = Math.max(1, Math.min(600, parseInt(durationSeconds, 10) || 60));

    // Abbreviate name if privacy chosen
    let displayName = studentProfile.fullName;
    if (studentProfile.useAbbreviatedName) {
      const parts = studentProfile.fullName.trim().split(/\s+/);
      if (parts.length > 1) {
        displayName = parts
          .map((p: string, idx: number) => (idx === parts.length - 1 ? p : `${p[0]}.`))
          .join(' ');
      }
    }

    const cleanAttempt: ServerAttempt = {
      attemptId: attemptId || `att_${Date.now()}`,
      studentName: studentProfile.fullName,
      displayName,
      className: studentProfile.className || '',
      schoolName: studentProfile.schoolName || '',
      province: studentProfile.province || '',
      score: calculatedScore,
      totalCorrect: correctCount,
      totalQuestions: 20,
      durationSeconds: finalDuration,
      startedAt: startedAt || new Date().toISOString(),
      submittedAt: submittedAt || new Date().toISOString(),
      status: isTimeout ? 'timeout' : 'completed',
      answersSummary,
    };

    // Prevent duplicate entries in memory
    const existingIndex = memoryAttempts.findIndex((a) => a.attemptId === cleanAttempt.attemptId);
    if (existingIndex >= 0) {
      memoryAttempts[existingIndex] = cleanAttempt;
    } else {
      memoryAttempts.push(cleanAttempt);
    }

    // Forward to Google Apps Script if configured
    let forwardedToSheets = false;
    if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim().length > 0) {
      try {
        const payloadToAppsScript = {
          attemptId: cleanAttempt.attemptId,
          studentProfile: {
            ...studentProfile,
            displayName,
          },
          answers,
          durationSeconds: finalDuration,
          startedAt: cleanAttempt.startedAt,
          submittedAt: cleanAttempt.submittedAt,
          isTimeout,
          secret: SHEETS_SHARED_SECRET,
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const forwardRes = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadToAppsScript),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (forwardRes.ok) {
          forwardedToSheets = true;
        }
      } catch (err) {
        console.warn('Không thể gửi đồng bộ Google Apps Script:', err);
      }
    }

    return res.json({
      success: true,
      message: 'Kết quả bài thi đã được máy chủ xác thực thành công!',
      attempt: cleanAttempt,
      forwardedToSheets,
    });
  } catch (err: any) {
    console.error('Lỗi khi chấm điểm tại máy chủ:', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xử lý chấm điểm.',
    });
  }
});

// Vite Middleware for development & Static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server Hành Tinh Xanh is running on http://localhost:${PORT}`);
  });
}

startServer();
