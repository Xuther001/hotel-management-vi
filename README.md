# Haven Group — Bộ khung quản lý khách sạn (Tiếng Việt)

Giao diện React + TypeScript kết nối API Express mô phỏng, dành cho nhóm có nhiều khách sạn và doanh nghiệp marketing.

> **Chỉ dùng thử.** Đăng nhập giả lập không xác thực người dùng. API chưa có phân quyền, bảo mật sản xuất hoặc bảo đảm kế toán. Chỉ sử dụng dữ liệu giả.

## Yêu cầu
- Khuyến nghị Node.js 20.19+ hoặc 22.12+
- npm

## Chạy trên máy tính
```bash
npm install
npm run dev
```
Mở các địa chỉ sau:
- Giao diện: http://localhost:5173
- Kiểm tra API mô phỏng: http://localhost:4000/api/v1/health

API khởi tạo `server/data.json` từ dữ liệu mẫu trong lần chạy đầu tiên. Các thay đổi được ghi vào tệp JSON cục bộ để giữ lại đặt phòng, trạng thái phòng, nhân viên và chi phí sau khi khởi động lại máy chủ. Để khôi phục dữ liệu mẫu, hãy dừng máy chủ rồi xóa `server/data.json`.

## Các mô-đun hiện có
- Bảng tổng quan chủ doanh nghiệp: doanh thu mẫu, công suất phòng, so sánh cơ sở, công việc và hoạt động gần đây
- Đặt phòng: tìm kiếm, xem danh sách và tạo đặt phòng
- Phòng: tìm kiếm và cập nhật trạng thái phòng
- Nhân sự: tìm kiếm danh sách nhân viên và thêm nhân viên
- Tài chính: tìm kiếm và ghi nhận chi phí
- Danh sách công việc bảo trì
- Khách hàng và chiến dịch marketing
- Nền tảng giao diện báo cáo và cài đặt

## Các API đã triển khai
- `GET /api/v1/health`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/login` (chỉ phản hồi giả lập, không phải xác thực thật)
- `GET /api/v1/properties`
- `GET /api/v1/dashboard/overview?property_id=all|hotel-a|hotel-b`
- `GET, POST /api/v1/reservations`
- `PATCH /api/v1/reservations/:id`
- `GET /api/v1/rooms`
- `PATCH /api/v1/rooms/:id/status`
- `GET, POST /api/v1/employees`
- `GET, POST /api/v1/finance/expenses`
- `GET /api/v1/housekeeping/tasks`
- `GET /api/v1/marketing/clients`
- `GET /api/v1/marketing/campaigns`
- `GET /api/v1/audit-logs`

Các API khác mới nằm trong kế hoạch, chưa được triển khai. Những đường dẫn `/api` không được hỗ trợ sẽ trả về lỗi 404 mô phỏng.

## Kết nối backend thật sau này
- Giữ giao diện gọi các hàm trong `src/api.ts`.
- Thay URL và cách xử lý phản hồi trong `src/api.ts` bằng địa chỉ API thật.
- Đảm bảo cấu trúc phản hồi phù hợp với các thành phần giao diện hoặc chuyển đổi dữ liệu trong API client.
- Trước khi đưa vào sử dụng thực tế, cần bổ sung xác thực, phân quyền theo vai trò/cơ sở ở phía máy chủ, kiểm tra dữ liệu, giới hạn tần suất, nhật ký kiểm toán, tải tệp an toàn và cơ sở dữ liệu thật.
- Xóa dữ liệu mẫu và đăng nhập giả lập.
- Dùng biến môi trường cho URL API và bí mật. Không đưa bí mật máy chủ vào biến Vite `VITE_*`.

## Các bước phát triển tiếp theo
1. Triển khai xác thực và phân quyền theo vai trò ở máy chủ.
2. Kiểm tra tình trạng phòng trống và ngăn đặt phòng trùng trong giao dịch cơ sở dữ liệu.
3. Xây dựng sổ thanh toán, hồ sơ chi tiêu khách, quy trình phê duyệt và quy tắc kế toán.
4. Phát triển quy trình buồng phòng, nghỉ phép/chấm công, tính lương, kho và nhà cung cấp.
5. Bổ sung kiểm thử và đặc tả OpenAPI.
