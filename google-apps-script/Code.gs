/**
 * HÀNH TINH XANH – CHIẾN BINH BẢO VỆ ĐẤT
 * GOOGLE APPS SCRIPT BACKEND CHẤM ĐIỂM VÀ ĐỒNG BỘ BẢNG XẾP HẠNG
 * 
 * Hướng dẫn sử dụng:
 * 1. Mở Google Sheets mới hoặc đã có.
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Dán toàn bộ mã nguồn này vào tệp Code.gs.
 * 4. Chạy hàm `setupSpreadsheet()` một lần để khởi tạo 2 trang tính "Scores" và "Leaderboard".
 * 5. (Tùy chọn) Cài đặt Script Properties: SHARED_SECRET = "green-planet-secret-key-2026".
 * 6. Bấm Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment) -> Loại: Ứng dụng web (Web App).
 *    - Thực thi dưới dạng (Execute as): Tôi (Me).
 *    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone).
 * 7. Sao chép URL ứng dụng web (dạng https://script.google.com/macros/s/AKfycb.../exec)
 *    và dán vào biến môi trường APPS_SCRIPT_URL trong file .env của máy chủ!
 */

// Ngân hàng đáp án chuẩn phía máy chủ (Master key)
var MASTER_ANSWER_KEY = {
  "Q01": "B",
  "Q02": "C",
  "Q03": "D",
  "Q04": "B",
  "Q05": "A",
  "Q06": "C",
  "Q07": "B",
  "Q08": "D",
  "Q09": "A",
  "Q10": "C",
  "Q11": "B",
  "Q12": "D",
  "Q13": "A",
  "Q14": "C",
  "Q15": "D",
  "Q16": "B",
  "Q17": "C",
  "Q18": "A",
  "Q19": "D",
  "Q20": "B"
};

/**
 * Xử lý yêu cầu GET: Trả về Bảng xếp hạng hoặc kiểm tra kết nối
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'leaderboard';
  
  if (action === 'ping') {
    return createJsonResponse({
      success: true,
      status: "connected",
      message: "Kết nối thành công với Google Apps Script Hành Tinh Xanh!",
      timestamp: new Date().toISOString()
    });
  }

  return getLeaderboardResponse();
}

/**
 * Xử lý yêu cầu POST: Chấm điểm và lưu kết quả thi
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Khóa script tối đa 15 giây để chống xung đột ghi dữ liệu đồng thời
  if (!lock.tryLock(15000)) {
    return createJsonResponse({
      success: false,
      message: "Hệ thống đang bận ghi kết quả cho nhiều học sinh. Vui lòng thử lại sau vài giây!"
    });
  }

  try {
    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);

    // Xác thực Shared Secret (nếu được cấu hình trong Script Properties)
    var scriptSecret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (scriptSecret && payload.secret && payload.secret !== scriptSecret) {
      return createJsonResponse({
        success: false,
        message: "Mã bí mật xác thực không hợp lệ."
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var scoresSheet = ss.getSheetByName("Scores");
    if (!scoresSheet) {
      setupSpreadsheet();
      scoresSheet = ss.getSheetByName("Scores");
    }

    var attemptId = payload.attemptId || ("att_" + new Date().getTime());

    // Kiểm tra chống ghi trùng lặp attemptId
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
    var rawAnswers = payload.answers || []; // [{ questionId: 'Q01', selectedOption: 'B' }]
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
    
    // Tên hiển thị (viết tắt nếu chọn bảo vệ quyền riêng tư)
    var displayName = studentName;
    if (studentProfile.useAbbreviatedName) {
      var parts = studentName.trim().split(/\s+/);
      if (parts.length > 1) {
        displayName = parts.map(function(part, idx) {
          return idx === parts.length - 1 ? part : (part.charAt(0) + ".");
        }).join(" ");
      }
    }

    var className = studentProfile.className || "5A";
    var schoolName = studentProfile.schoolName || "Tiểu học";
    var province = studentProfile.province || "";
    var startedAt = payload.startedAt || new Date().toISOString();
    var submittedAt = payload.submittedAt || new Date().toISOString();
    var status = payload.isTimeout ? "timeout" : "completed";

    // Ghi dòng mới vào bảng Scores
    scoresSheet.appendRow([
      attemptId,
      studentName,
      displayName,
      className,
      schoolName,
      province,
      finalScore,
      correctCount,
      totalQuestions,
      durationSeconds,
      startedAt,
      submittedAt,
      status,
      JSON.stringify(answersSummary)
    ]);

    // Cập nhật bảng xếp hạng thành tích tốt nhất
    updateLeaderboardSheet(ss);

    return createJsonResponse({
      success: true,
      message: "Ghi nhận thành tích thành công!",
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
        startedAt: startedAt,
        submittedAt: submittedAt,
        status: status,
        answersSummary: answersSummary
      }
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
 * Lấy danh sách bảng xếp hạng được tổng hợp từ Google Sheets
 */
function getLeaderboardResponse() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var lbSheet = ss.getSheetByName("Leaderboard");
    if (!lbSheet) {
      setupSpreadsheet();
      lbSheet = ss.getSheetByName("Leaderboard");
    }

    var values = lbSheet.getDataRange().getValues();
    var leaderboard = [];

    // Bỏ qua dòng tiêu đề (index 0)
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[1]) continue; // Bỏ qua nếu không có tên hiển thị
      leaderboard.push({
        rank: parseInt(row[0], 10) || i,
        displayName: String(row[1]),
        className: String(row[2]),
        schoolName: String(row[3]),
        province: String(row[4] || ""),
        bestScore: parseInt(row[5], 10) || 0,
        bestCorrect: parseInt(row[6], 10) || 0,
        bestDurationSeconds: parseInt(row[7], 10) || 0,
        bestSubmittedAt: String(row[8] || "")
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

  var bestMap = {}; // key: "studentName_className_schoolName"

  for (var i = 1; i < scoresData.length; i++) {
    var r = scoresData[i];
    var studentName = String(r[1]).trim();
    var displayName = String(r[2]).trim();
    var className = String(r[3]).trim();
    var schoolName = String(r[4]).trim();
    var province = String(r[5] || "").trim();
    var score = parseInt(r[6], 10) || 0;
    var correct = parseInt(r[7], 10) || 0;
    var duration = parseInt(r[9], 10) || 600;
    var submittedAt = String(r[11] || "");

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
      // Quy tắc xếp hạng: Điểm cao hơn -> Nếu bằng điểm, thời gian ngắn hơn
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

  // Chuyển thành mảng và sắp xếp
  var list = Object.keys(bestMap).map(function(k) { return bestMap[k]; });
  list.sort(function(a, b) {
    if (b.bestScore !== a.bestScore) {
      return b.bestScore - a.bestScore; // Điểm cao hơn xếp trên
    }
    if (a.bestDurationSeconds !== b.bestDurationSeconds) {
      return a.bestDurationSeconds - b.bestDurationSeconds; // Thời gian ngắn hơn xếp trên
    }
    return new Date(a.bestSubmittedAt) - new Date(b.bestSubmittedAt); // Sớm hơn xếp trên
  });

  // Ghi lại toàn bộ bảng Leaderboard
  lbSheet.clearContents();
  lbSheet.appendRow([
    "Thứ hạng (Rank)",
    "Tên hiển thị (DisplayName)",
    "Lớp (Class)",
    "Trường học (School)",
    "Tỉnh/Thành (Province)",
    "Điểm cao nhất (BestScore)",
    "Số câu đúng (BestCorrect)",
    "Thời gian (DurationSeconds)",
    "Thời điểm nộp (SubmittedAt)",
    "Số lượt thi (Attempts)"
  ]);

  var outRows = [];
  for (var j = 0; j < list.length; j++) {
    var item = list[j];
    outRows.push([
      j + 1,
      item.displayName,
      item.className,
      item.schoolName,
      item.province,
      item.bestScore,
      item.bestCorrect,
      item.bestDurationSeconds,
      item.bestSubmittedAt,
      item.count
    ]);
  }

  if (outRows.length > 0) {
    lbSheet.getRange(2, 1, outRows.length, 10).setValues(outRows);
  }

  formatSheetHeaders(lbSheet);
}

/**
 * Hàm khởi tạo trang tính lần đầu (Chạy trong trình soạn thảo Apps Script)
 */
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Tạo sheet Scores
  var scoresSheet = ss.getSheetByName("Scores");
  if (!scoresSheet) {
    scoresSheet = ss.insertSheet("Scores");
  }
  scoresSheet.clearContents();
  scoresSheet.appendRow([
    "Mã lượt thi (AttemptId)",
    "Họ và tên thật (StudentName)",
    "Tên hiển thị (DisplayName)",
    "Lớp (ClassName)",
    "Trường học (SchoolName)",
    "Tỉnh/Thành (Province)",
    "Điểm số (Score)",
    "Số câu đúng (TotalCorrect)",
    "Tổng số câu (TotalQuestions)",
    "Thời gian (DurationSeconds)",
    "Bắt đầu (StartedAt)",
    "Nộp bài (SubmittedAt)",
    "Trạng thái (Status)",
    "Chi tiết đáp án (AnswersJSON)"
  ]);
  formatSheetHeaders(scoresSheet);

  // 2. Tạo sheet Leaderboard
  var lbSheet = ss.getSheetByName("Leaderboard");
  if (!lbSheet) {
    lbSheet = ss.insertSheet("Leaderboard");
  }
  lbSheet.clearContents();
  lbSheet.appendRow([
    "Thứ hạng (Rank)",
    "Tên hiển thị (DisplayName)",
    "Lớp (Class)",
    "Trường học (School)",
    "Tỉnh/Thành (Province)",
    "Điểm cao nhất (BestScore)",
    "Số câu đúng (BestCorrect)",
    "Thời gian (DurationSeconds)",
    "Thời điểm nộp (SubmittedAt)",
    "Số lượt thi (Attempts)"
  ]);
  formatSheetHeaders(lbSheet);

  Logger.log("Đã khởi tạo thành công cấu trúc Google Sheets cho Hành Tinh Xanh!");
}

function formatSheetHeaders(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 10);
  headerRange.setBackground("#22B573");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
