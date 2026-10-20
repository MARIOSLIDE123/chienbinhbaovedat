/**
 * HÀNH TINH XANH – CHIẾN BINH BẢO VỆ ĐẤT
 * GOOGLE APPS SCRIPT BACKEND CHẤM ĐIỂM, ĐỒNG BỘ DỮ LIỆU & BẢNG XẾP HẠNG REAL-TIME
 * 
 * ==============================================================================
 * HƯỚNG DẪN CÀI ĐẶT NHANH TRONG 3 BƯỚC:
 * 1. Mở trang Google Sheets mới: https://sheets.new
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Dán toàn bộ mã nguồn này vào tệp Code.gs và nhấn Ctrl+S (Lưu).
 * 4. Chọn hàm "setupSpreadsheet" trên thanh công cụ và bấm "Chạy" (Run) một lần
 *    để hệ thống tự động khởi tạo 4 trang tính chuẩn màu:
 *    - 🏆 Leaderboard: Bảng vàng xếp hạng trực tuyến
 *    - 📝 Scores: Lịch sử và chi tiết các bài thi Đấu trường trí tuệ
 *    - 📊 StudentProgress: Thông tin học sinh, thời lượng học qua app, tiến độ học
 *    - ⚡ ActivityLogs: Nhật ký ghi nhận mọi hành động theo thời gian thực
 * 5. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment):
 *    - Chọn loại: "Ứng dụng web" (Web App)
 *    - Mô tả: "Hanh Tinh Xanh Sync API"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me - địa chỉ gmail của bạn)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)
 * 6. Sao chép URL ứng dụng web (dạng https://script.google.com/macros/s/AKfycb.../exec)
 *    và dán vào biến môi trường APPS_SCRIPT_URL trên Vercel hoặc cấu hình trong app!
 * ==============================================================================
 */

// Ngân hàng 20 đáp án chuẩn của Đấu Trường Trí Tuệ (Phía máy chủ chống gian lận)
var MASTER_ANSWER_KEY = {
  "Q01": "B", "Q02": "C", "Q03": "D", "Q04": "B", "Q05": "A",
  "Q06": "C", "Q07": "B", "Q08": "D", "Q09": "A", "Q10": "C",
  "Q11": "B", "Q12": "D", "Q13": "A", "Q14": "C", "Q15": "D",
  "Q16": "B", "Q17": "C", "Q18": "A", "Q19": "D", "Q20": "B"
};

/**
 * Xử lý yêu cầu GET: Bảng xếp hạng hoặc kiểm tra kết nối (Ping)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'leaderboard';

  // 1. Kiểm tra kết nối từ ứng dụng web
  if (action === 'ping') {
    return createJsonResponse({
      success: true,
      status: "connected",
      message: "Kết nối thành công với Google Apps Script Hành Tinh Xanh!",
      timestamp: new Date().toISOString()
    });
  }

  // 2. Thống kê nhanh tổng quan
  if (action === 'summary') {
    return getSummaryResponse();
  }

  // 3. Mặc định: Trả về Bảng xếp hạng Real-time
  return getLeaderboardResponse();
}

/**
 * Xử lý yêu cầu POST: Ghi nhận dữ liệu (Điểm thi, Tiến trình học tập, Nhật ký hành động)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Khóa tối đa 15 giây để chống ghi đè khi nhiều học sinh nộp bài cùng lúc
  if (!lock.tryLock(15000)) {
    return createJsonResponse({
      success: false,
      message: "Hệ thống đang bận ghi nhận dữ liệu cho học sinh khác. Vui lòng thử lại sau vài giây!"
    });
  }

  try {
    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);
    var action = payload.action || (payload.answers ? 'score' : 'sync_progress');

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // -------------------------------------------------------------
    // TRƯỜNG HỢP 1: GHI NHẬN ĐIỂM THI ĐẤU TRƯỜNG TRÍ TUỆ (Quiz Score)
    // -------------------------------------------------------------
    if (action === 'score' || payload.answers) {
      return handleQuizSubmission(ss, payload);
    }

    // -------------------------------------------------------------
    // TRƯỜNG HỢP 2: ĐỒNG BỘ TIẾN TRÌNH & THỜI LƯỢNG HỌC (Student Progress)
    // -------------------------------------------------------------
    if (action === 'sync_progress') {
      return handleProgressSync(ss, payload);
    }

    // -------------------------------------------------------------
    // TRƯỜNG HỢP 3: GHI NHẬT KÝ HÀNH ĐỘNG REAL-TIME (Activity Log)
    // -------------------------------------------------------------
    if (action === 'log_activity') {
      return handleActivityLog(ss, payload);
    }

    return createJsonResponse({
      success: false,
      message: "Hành động không xác định: " + action
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      message: "Lỗi trong quá trình xử lý: " + err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 1. Xử lý nộp bài và chấm điểm Đấu Trường Trí Tuệ
 */
function handleQuizSubmission(ss, payload) {
  var scoresSheet = ss.getSheetByName("Scores") || (setupSpreadsheet(), ss.getSheetByName("Scores"));
  var attemptId = payload.attemptId || ("att_" + new Date().getTime());

  // Kiểm tra chống ghi trùng lặp mã lượt thi
  var data = scoresSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === attemptId) {
      return createJsonResponse({
        success: true,
        message: "Lượt thi này đã được ghi nhận trước đó.",
        attemptId: attemptId
      });
    }
  }

  // Chấm điểm server-side dựa trên câu trả lời
  var studentProfile = payload.studentProfile || {};
  var rawAnswers = payload.answers || [];
  var answersSummary = {};
  var correctCount = 0;

  rawAnswers.forEach(function(item) {
    answersSummary[item.questionId] = item.selectedOption;
    if (MASTER_ANSWER_KEY[item.questionId] === item.selectedOption) {
      correctCount++;
    }
  });

  var totalQuestions = 20;
  var finalScore = correctCount * 10;
  var durationSeconds = parseInt(payload.durationSeconds, 10) || 60;
  var studentName = studentProfile.fullName || "Học sinh";
  var displayName = studentProfile.displayName || studentName;
  var className = studentProfile.className || "5A";
  var schoolName = studentProfile.schoolName || "Tiểu học";
  var province = studentProfile.province || "";
  var startedAt = payload.startedAt || new Date().toISOString();
  var submittedAt = payload.submittedAt || new Date().toISOString();
  var status = payload.isTimeout ? "Hết giờ" : "Hoàn thành";
  var formattedDuration = formatDuration(durationSeconds);

  // Ghi vào bảng Scores
  scoresSheet.appendRow([
    attemptId,
    new Date(),
    studentName,
    displayName,
    className,
    schoolName,
    province,
    finalScore,
    correctCount,
    totalQuestions,
    durationSeconds,
    formattedDuration,
    status,
    JSON.stringify(answersSummary)
  ]);

  // Cập nhật Bảng Xếp Hạng Leaderboard
  updateLeaderboardSheet(ss);

  // Cập nhật sheet StudentProgress
  updateStudentProgressRecord(ss, {
    studentName: studentName,
    className: className,
    schoolName: schoolName,
    province: province,
    arenaScore: finalScore,
    studyDurationSeconds: durationSeconds
  });

  // Tự động ghi vào ActivityLogs
  appendActivityLog(ss, {
    studentName: studentName,
    className: className,
    schoolName: schoolName,
    actionType: "Thi Đấu Trường",
    details: "Đạt " + finalScore + "/200 điểm (" + correctCount + "/20 câu đúng) trong " + formattedDuration
  });

  return createJsonResponse({
    success: true,
    message: "Ghi nhận thành tích thi thành công!",
    attempt: {
      attemptId: attemptId,
      studentName: studentName,
      displayName: displayName,
      className: className,
      schoolName: schoolName,
      province: province,
      score: finalScore,
      totalCorrect: correctCount,
      totalQuestions: totalQuestions,
      durationSeconds: durationSeconds,
      formattedDuration: formattedDuration,
      status: status
    }
  });
}

/**
 * 2. Xử lý đồng bộ tiến trình học tập và thời lượng học
 */
function handleProgressSync(ss, payload) {
  var p = payload.studentProfile || {};
  var progress = payload.progress || {};
  var studyDurationSeconds = parseInt(payload.studyDurationSeconds || progress.studyDurationSeconds, 10) || 0;

  var studentName = p.fullName || "Học sinh";
  var className = p.className || "";
  var schoolName = p.schoolName || "";
  var province = p.province || "";

  var completedLessons = (progress.completedLessons || []).join(", ");
  var completedSimulations = (progress.completedSimulations || []).join(", ");
  var practiceScore = progress.practiceCompleted || 0;
  var actionsCount = (progress.checklistActions || []).length;
  var highestScore = progress.highestScore || 0;

  // Tính % hoàn thành học tập
  var lessonPct = ((progress.completedLessons || []).length / 3) * 30;
  var simPct = ((progress.completedSimulations || []).length / 3) * 30;
  var practicePct = (Math.min(practiceScore, 8) / 8) * 20;
  var arenaPct = (progress.arenaAttempts || 0) > 0 ? 20 : 0;
  var totalPct = Math.round(lessonPct + simPct + practicePct + arenaPct);

  updateStudentProgressRecord(ss, {
    studentName: studentName,
    className: className,
    schoolName: schoolName,
    province: province,
    totalProgressPct: totalPct + "%",
    completedLessons: completedLessons || "Chưa hoàn thành",
    completedSimulations: completedSimulations || "Chưa hoàn thành",
    practiceScore: practiceScore + "/8 thử thách",
    checklistActionsCount: actionsCount + "/5 việc tốt",
    studyDurationSeconds: studyDurationSeconds,
    arenaScore: highestScore
  });

  if (payload.actionNote) {
    appendActivityLog(ss, {
      studentName: studentName,
      className: className,
      schoolName: schoolName,
      actionType: payload.actionType || "Cập nhật tiến trình",
      details: payload.actionNote + " (Tiến độ: " + totalPct + "%)"
    });
  }

  return createJsonResponse({
    success: true,
    message: "Đồng bộ tiến trình học sinh thành công!",
    totalProgressPct: totalPct
  });
}

/**
 * 3. Xử lý ghi nhật ký hành động (Activity Log)
 */
function handleActivityLog(ss, payload) {
  var p = payload.studentProfile || {};
  var studentName = p.fullName || payload.studentName || "Học sinh";
  var className = p.className || payload.className || "";
  var schoolName = p.schoolName || payload.schoolName || "";
  var actionType = payload.actionType || "Hoạt động";
  var details = payload.details || "";

  appendActivityLog(ss, {
    studentName: studentName,
    className: className,
    schoolName: schoolName,
    actionType: actionType,
    details: details
  });

  return createJsonResponse({
    success: true,
    message: "Đã ghi nhận nhật ký hành động!"
  });
}

/**
 * Cập nhật bảng StudentProgress
 */
function updateStudentProgressRecord(ss, info) {
  var progSheet = ss.getSheetByName("StudentProgress") || (setupSpreadsheet(), ss.getSheetByName("StudentProgress"));
  var data = progSheet.getDataRange().getValues();
  var studentKey = (info.studentName + "_" + info.className + "_" + info.schoolName).toLowerCase();

  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    var rowKey = (String(data[i][0]) + "_" + String(data[i][1]) + "_" + String(data[i][2])).toLowerCase();
    if (rowKey === studentKey) {
      foundRow = i + 1;
      break;
    }
  }

  var formattedMinutes = Math.round((info.studyDurationSeconds || 0) / 60) + " phút";

  if (foundRow > 0) {
    // Cập nhật dòng hiện có
    if (info.totalProgressPct !== undefined) progSheet.getRange(foundRow, 5).setValue(info.totalProgressPct);
    if (info.completedLessons !== undefined) progSheet.getRange(foundRow, 6).setValue(info.completedLessons);
    if (info.completedSimulations !== undefined) progSheet.getRange(foundRow, 7).setValue(info.completedSimulations);
    if (info.practiceScore !== undefined) progSheet.getRange(foundRow, 8).setValue(info.practiceScore);
    if (info.checklistActionsCount !== undefined) progSheet.getRange(foundRow, 9).setValue(info.checklistActionsCount);
    if (info.studyDurationSeconds > 0) progSheet.getRange(foundRow, 10).setValue(formattedMinutes);
    if (info.arenaScore > 0) {
      var currentMax = parseInt(progSheet.getRange(foundRow, 11).getValue(), 10) || 0;
      progSheet.getRange(foundRow, 11).setValue(Math.max(currentMax, info.arenaScore));
    }
    progSheet.getRange(foundRow, 12).setValue(new Date());
  } else {
    // Thêm dòng mới
    progSheet.appendRow([
      info.studentName,
      info.className,
      info.schoolName,
      info.province || "",
      info.totalProgressPct || "0%",
      info.completedLessons || "Chưa học",
      info.completedSimulations || "Chưa làm",
      info.practiceScore || "0/8",
      info.checklistActionsCount || "0/5",
      formattedMinutes,
      info.arenaScore || 0,
      new Date()
    ]);
  }
}

/**
 * Thêm dòng vào ActivityLogs
 */
function appendActivityLog(ss, log) {
  var logSheet = ss.getSheetByName("ActivityLogs") || (setupSpreadsheet(), ss.getSheetByName("ActivityLogs"));
  logSheet.appendRow([
    new Date(),
    log.studentName,
    log.className,
    log.schoolName,
    log.actionType,
    log.details
  ]);
}

/**
 * Lấy danh sách bảng xếp hạng được tổng hợp từ Google Sheets
 */
function getLeaderboardResponse() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var lbSheet = ss.getSheetByName("Leaderboard") || (setupSpreadsheet(), ss.getSheetByName("Leaderboard"));
    var values = lbSheet.getDataRange().getValues();
    var leaderboard = [];

    // Bỏ qua dòng tiêu đề (index 0)
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[1]) continue;
      leaderboard.push({
        rank: parseInt(row[0], 10) || i,
        displayName: String(row[1]),
        className: String(row[2]),
        schoolName: String(row[3]),
        province: String(row[4] || ""),
        bestScore: parseInt(row[5], 10) || 0,
        bestCorrect: parseInt(row[6], 10) || 0,
        bestDurationSeconds: parseInt(row[7], 10) || 0,
        formattedDuration: String(row[8] || formatDuration(parseInt(row[7], 10) || 0)),
        bestSubmittedAt: String(row[9] || ""),
        attemptCount: parseInt(row[10], 10) || 1
      });
    }

    return createJsonResponse({
      success: true,
      leaderboard: leaderboard,
      totalEntries: leaderboard.length,
      updatedAt: new Date().toISOString()
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      message: "Lỗi đọc bảng xếp hạng: " + err.toString(),
      leaderboard: []
    });
  }
}

/**
 * Tổng hợp dữ liệu thành tích tốt nhất từ Scores sang Leaderboard
 */
function updateLeaderboardSheet(ss) {
  var scoresSheet = ss.getSheetByName("Scores");
  var lbSheet = ss.getSheetByName("Leaderboard");
  if (!scoresSheet || !lbSheet) return;

  var scoresData = scoresSheet.getDataRange().getValues();
  if (scoresData.length <= 1) return;

  var bestMap = {};

  for (var i = 1; i < scoresData.length; i++) {
    var r = scoresData[i];
    var studentName = String(r[2]).trim();
    var displayName = String(r[3] || studentName).trim();
    var className = String(r[4]).trim();
    var schoolName = String(r[5]).trim();
    var province = String(r[6] || "").trim();
    var score = parseInt(r[7], 10) || 0;
    var correct = parseInt(r[8], 10) || 0;
    var duration = parseInt(r[10], 10) || 600;
    var submittedAt = String(r[1] || "");

    var key = (studentName + "_" + className + "_" + schoolName).toLowerCase();

    if (!bestMap[key]) {
      bestMap[key] = {
        displayName: displayName,
        className: className,
        schoolName: schoolName,
        province: province,
        bestScore: score,
        bestCorrect: correct,
        bestDurationSeconds: duration,
        bestSubmittedAt: submittedAt,
        count: 1
      };
    } else {
      bestMap[key].count++;
      var current = bestMap[key];
      if (
        score > current.bestScore ||
        (score === current.bestScore && duration < current.bestDurationSeconds)
      ) {
        current.bestScore = score;
        current.bestCorrect = correct;
        current.bestDurationSeconds = duration;
        current.bestSubmittedAt = submittedAt;
        current.displayName = displayName;
      }
    }
  }

  // Chuyển thành mảng và sắp xếp: Điểm cao -> Thời gian ngắn -> Nộp sớm
  var list = Object.keys(bestMap).map(function(k) { return bestMap[k]; });
  list.sort(function(a, b) {
    if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
    if (a.bestDurationSeconds !== b.bestDurationSeconds) return a.bestDurationSeconds - b.bestDurationSeconds;
    return new Date(a.bestSubmittedAt) - new Date(b.bestSubmittedAt);
  });

  // Ghi lại bảng Leaderboard
  lbSheet.clearContents();
  lbSheet.appendRow([
    "Thứ hạng (Rank)",
    "Tên hiển thị (DisplayName)",
    "Lớp (Class)",
    "Trường học (School)",
    "Tỉnh/Thành (Province)",
    "Điểm cao nhất (BestScore)",
    "Số câu đúng (BestCorrect)",
    "Thời gian (Giây)",
    "Thời gian làm bài",
    "Thời điểm nộp bài",
    "Số lượt thi (Attempts)"
  ]);

  var outRows = [];
  for (var j = 0; j < list.length; j++) {
    var it = list[j];
    outRows.push([
      j + 1,
      it.displayName,
      it.className,
      it.schoolName,
      it.province,
      it.bestScore,
      it.bestCorrect,
      it.bestDurationSeconds,
      formatDuration(it.bestDurationSeconds),
      it.bestSubmittedAt,
      it.count
    ]);
  }

  if (outRows.length > 0) {
    lbSheet.getRange(2, 1, outRows.length, 11).setValues(outRows);
  }

  formatSheetHeaders(lbSheet, "#1E88E5");
}

/**
 * Hàm khởi tạo 4 trang tính tự động lần đầu (Chạy 1 lần trong Apps Script Editor)
 */
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Tạo sheet Leaderboard (Bảng xếp hạng vàng)
  var lbSheet = ss.getSheetByName("Leaderboard") || ss.insertSheet("Leaderboard");
  lbSheet.clearContents();
  lbSheet.appendRow([
    "Thứ hạng (Rank)",
    "Tên hiển thị (DisplayName)",
    "Lớp (Class)",
    "Trường học (School)",
    "Tỉnh/Thành (Province)",
    "Điểm cao nhất (BestScore)",
    "Số câu đúng (BestCorrect)",
    "Thời gian (Giây)",
    "Thời gian làm bài",
    "Thời điểm nộp bài",
    "Số lượt thi (Attempts)"
  ]);
  formatSheetHeaders(lbSheet, "#1E88E5");

  // 2. Tạo sheet Scores (Lịch sử bài thi Đấu trường)
  var scoresSheet = ss.getSheetByName("Scores") || ss.insertSheet("Scores");
  scoresSheet.clearContents();
  scoresSheet.appendRow([
    "Mã lượt thi (AttemptId)",
    "Thời gian ghi nhận",
    "Họ và tên thật (StudentName)",
    "Tên hiển thị (DisplayName)",
    "Lớp (ClassName)",
    "Trường học (SchoolName)",
    "Tỉnh/Thành (Province)",
    "Điểm số (Score)",
    "Số câu đúng (TotalCorrect)",
    "Tổng số câu (TotalQuestions)",
    "Thời gian (Giây)",
    "Thời gian làm bài",
    "Trạng thái (Status)",
    "Chi tiết đáp án (AnswersJSON)"
  ]);
  formatSheetHeaders(scoresSheet, "#2E7D32");

  // 3. Tạo sheet StudentProgress (Tiến trình & Thời lượng học tập)
  var progSheet = ss.getSheetByName("StudentProgress") || ss.insertSheet("StudentProgress");
  progSheet.clearContents();
  progSheet.appendRow([
    "Họ và tên (StudentName)",
    "Lớp (Class)",
    "Trường học (School)",
    "Tỉnh/Thành (Province)",
    "Tiến độ tổng thể (%)",
    "Bài học SGK đã học",
    "Thí nghiệm đã làm",
    "Thử tài nhanh trí",
    "Việc tốt bảo vệ đất",
    "Thời lượng học qua App",
    "Điểm Đấu trường cao nhất",
    "Cập nhật lần cuối"
  ]);
  formatSheetHeaders(progSheet, "#F57C00");

  // 4. Tạo sheet ActivityLogs (Nhật ký hành động Real-time)
  var logSheet = ss.getSheetByName("ActivityLogs") || ss.insertSheet("ActivityLogs");
  logSheet.clearContents();
  logSheet.appendRow([
    "Thời điểm (Timestamp)",
    "Họ và tên học sinh",
    "Lớp",
    "Trường học",
    "Loại hành động (ActionType)",
    "Chi tiết hành động (Details)"
  ]);
  formatSheetHeaders(logSheet, "#7B1FA2");

  Logger.log("✅ Đã khởi tạo hoàn tất cấu trúc 4 trang tính Hành Tinh Xanh!");
}

function formatSheetHeaders(sheet, colorHex) {
  var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 10);
  headerRange.setBackground(colorHex || "#22B573");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function formatDuration(seconds) {
  var s = parseInt(seconds, 10) || 0;
  var m = Math.floor(s / 60);
  var remSec = s % 60;
  return (m < 10 ? "0" + m : m) + ":" + (remSec < 10 ? "0" + remSec : remSec);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
