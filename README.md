# HÀNH TINH XANH – CHIẾN BINH BẢO VỆ ĐẤT
**GREEN PLANET – SOIL PROTECTORS**

Ứng dụng web học tập tương tác Khoa học Tiểu học (Bài 2: Ô nhiễm, xói mòn đất và bảo vệ môi trường đất) dành cho học sinh tiểu học với Đấu trường trí tuệ 20 câu hỏi và Bảng xếp hạng trực tuyến kết nối Google Sheets qua Google Apps Script.

---

## 🌟 TÍNH NĂNG CHÍNH

1. **Cửa Đăng Nhập Học Sinh**:
   - Yêu cầu bắt buộc: Họ và tên, Lớp, Trường (tùy chọn Tỉnh/Thành phố).
   - Kiểm tra tính hợp lệ và chuẩn hóa khoảng trắng.
   - Tùy chọn bảo vệ quyền riêng tư: hiển thị tên viết tắt trên Bảng xếp hạng công khai (Ví dụ: `N. M. Anh`).
   - Lưu trữ tạm thời trên trình duyệt qua `localStorage`.

2. **Trang Chủ (Dashboard)**:
   - Nhân vật hoạt hình **Đội trưởng Đất Xanh** chào đón và tương tác qua giọng đọc tiếng Việt Web Speech API.
   - Thanh tiến trình tổng thể học tập.
   - 6 Thẻ điều hướng lớn trực quan.
   - Khu vực "Em có thể làm gì hôm nay?" với 6 việc làm thiết thực có tích điểm kinh nghiệm.

3. **Phân Hệ 1: Khám Phá Kiến Thức SGK**:
   - 3 Chủ đề bám sát SGK Khoa học lớp 5:
     - Chủ đề 1: Ô nhiễm đất (khái niệm, nguyên nhân con người/tự nhiên, 4 nhóm hình minh họa, tác hại, biện pháp phòng chống).
     - Chủ đề 2: Xói mòn đất (khái niệm, nguyên nhân, tác hại, giải thích cơ chế rễ cây giữ đất, tán cây giảm lực mưa, thảm cỏ cản dòng chảy).
     - Chủ đề 3: Bảo vệ môi trường đất (hành động phù hợp lứa tuổi, 3R, phân loại rác, nguyên tắc sử dụng thuốc BVTV).
   - Nút "Em đã hiểu", câu hỏi kiểm tra nhanh và tình huống thực tế.
   - Tính năng đọc to bài học bằng giọng đọc tiếng Việt cho học sinh.

4. **Phân Hệ 2: Sơ Đồ Tư Duy Tương Tác**:
   - Chủ đề trung tâm: "Ô NHIỄM, XÓI MÒN ĐẤT VÀ BẢO VỆ MÔI TRƯỜNG ĐẤT".
   - 3 Nhánh phân biệt bằng màu sắc: Cam, Xanh lam, Xanh lục.
   - Tính năng "Mở rộng tất cả", "Thu gọn", xem chi tiết nhánh và In/Lưu sơ đồ.

5. **Phân Hệ 3: Thử Tài Nhanh Trí**:
   - 8 hoạt động tương tác đa dạng:
     - Thử thách 1: Chọn nguyên nhân ô nhiễm do con người (Trắc nghiệm).
     - Thử thách 2: Phân loại nguyên nhân do con người vs tự nhiên (Bucket sorting).
     - Thử thách 3: Nối tác hại với hiện tượng tương ứng (Ghép cặp).
     - Thử thách 4: Chọn hành động đúng để bảo vệ đất (Nhiều lựa chọn đúng).
     - Thử thách 5: Nhận diện dấu hiệu xói mòn đất.
     - Thử thách 6: Đúng/Sai về tác dụng của cây xanh.
     - Thử thách 7: Sắp xếp thứ tự quy trình ủ rác hữu cơ.
     - Thử thách 8: Xử lý tình huống thực tế tại sân trường.
   - Phản hồi giải thích tức thì kèm hiệu ứng pháo giấy chúc mừng.

6. **Phân Hệ 4: Thí Nghiệm Vui**:
   - Thí nghiệm 1: Đất có cây và đất trống (thanh trượt cường độ mưa, mô phỏng rửa trôi đất mặt và nước ngầm).
   - Thí nghiệm 2: Hành trình của rác thải (chọn loại rác + phương án xử lý -> xem tác động sau 50 năm).
   - Thí nghiệm 3: Quy trình 5 bước trạm xử lý nước thải công nghiệp đạt chuẩn QCVN trước khi xả ra môi trường.

7. **Phân Hệ 5: Game "Đấu Trường Trí Tuệ" (Trọng tâm)**:
   - 20 câu hỏi chuẩn từ Q01 đến Q20 (7 cơ bản, 8 trung bình, 5 nâng cao).
   - Đồng hồ đếm ngược 10 phút, tự động nộp bài khi hết giờ.
   - Thang điểm 200 (10 điểm / câu).
   - **Chấm điểm bảo mật phía máy chủ (`/api/score`)**: Máy chủ trực tiếp đối chiếu đáp án với Master Key, chống gian lận.
   - 4 Cấp bậc huy hiệu:
     - 180 - 200 điểm: Chiến Binh Bảo Vệ Đất Xuất Sắc 🌟
     - 140 - 170 điểm: Chuyên Gia Đất Xanh 🌿
     - 100 - 130 điểm: Người Bạn Của Trái Đất 🌍
     - < 100 điểm: Mầm Xanh Đang Lớn 🌱

8. **Phân Hệ 6: Bảng Xếp Hạng Toàn Quốc**:
   - Bục vinh danh Top 3 với huy chương Vàng, Bạc, Đồng.
   - Quy tắc xếp hạng: Điểm cao hơn xếp trên; nếu bằng điểm, thời gian ngắn hơn xếp trên; nếu bằng nhau, nộp sớm hơn xếp trên.
   - Lọc theo Lớp, Trường, chế độ "Điểm cao nhất" (Best record) và tìm kiếm thí sinh.

9. **Tích Hợp Google Sheets & Google Apps Script**:
   - File mã nguồn `google-apps-script/Code.gs` hoàn chỉnh, sử dụng `LockService` chống ghi đè đồng thời.
   - Tự động quản lý 2 trang tính: `Scores` (toàn bộ lượt thi) và `Leaderboard` (thành tích tốt nhất).
   - Cửa sổ hướng dẫn và công cụ kiểm tra kết nối trực tiếp trong ứng dụng.

---

## 🚀 HƯỚNG DẪN CẤU HÌNH GOOGLE SHEETS

1. Tạo một bảng tính Google Sheets mới tại [sheets.new](https://sheets.new).
2. Vào menu **Tiện ích mở rộng (Extensions) → Apps Script**.
3. Xóa mã mặc định và dán toàn bộ nội dung từ tệp `google-apps-script/Code.gs`.
4. Trong Apps Script, chọn hàm `setupSpreadsheet` và nhấn nút **Chạy (Run)** để khởi tạo bảng `Scores` và `Leaderboard`.
5. Nhấn **Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)**:
   - Loại: **Ứng dụng web (Web App)**
   - Thực thi dưới dạng: **Tôi (Me)**
   - Ai có quyền truy cập: **Bất kỳ ai (Anyone)**
6. Sao chép URL Web App (ví dụ: `https://script.google.com/macros/s/AKfycb.../exec`).
7. Mở file `.env` và thêm:
   ```env
   APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
   SHEETS_SHARED_SECRET="green-planet-secret-key-2026"
   ```
8. Khởi động lại server (`npm run dev`), kết quả thi sẽ tự động đồng bộ lên Google Sheets!
