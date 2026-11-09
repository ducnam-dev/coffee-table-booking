# Coffee Shop Table Booking System (Pam Coffee & Tea)

Hệ thống quản lý và đặt bàn trực tuyến cho quán cà phê **Pam Coffee & Tea** được xây dựng theo kiến trúc **MVP (Model - View - Presenter)** trên nền tảng **React Native**, kết hợp cùng **FastAPI Backend (Python)** và hỗ trợ đồng bộ dữ liệu thông minh (Online / Offline).

---

## 🏛️ Kiến Trúc Dự Án: MVP (Model - View - Presenter)

Dự án phân tách độc lập và rành mạch giữa giao diện hiển thị, tầng xử lý trình diễn và tầng dữ liệu:

```text
frontend/src/
├── models/                     # [M] MODEL: Quản lý thực thể, gọi API & bộ nhớ đệm Offline
│   ├── UserModel.js            # Xác thực người dùng, lưu trữ JWT token
│   ├── TableModel.js           # Xử lý dữ liệu bàn & đồng bộ trạng thái
│   ├── MenuModel.js            # Thực đơn thức uống, phân loại danh mục
│   └── ReservationModel.js     # Tạo lượt đặt bàn, cập nhật trạng thái phê duyệt
│
├── presenters/                 # [P] PRESENTER: Xử lý logic hiển thị, tính toán & định dạng
│   ├── AuthPresenter.js        # Logic kiểm tra form đăng nhập / đăng ký / quick login
│   ├── BookingPresenter.js     # Tính tổng tiền đặt trước, quản lý quy trình đặt bàn
│   ├── TablesPresenter.js      # Lọc khu vực bàn, tính toán số lượng bàn trống
│   ├── MenuPresenter.js        # Tìm kiếm món, lọc danh mục, tăng/giảm giỏ hàng
│   ├── MyBookingsPresenter.js  # Lọc lịch sử đặt bàn, xử lý hủy bàn
│   └── AdminDashboardPresenter.js # Thống kê doanh thu, tỷ lệ lấp đầy, duyệt nhanh
│
├── views/                      # [V] VIEW: Thành phần giao diện thuần túy (Passive View)
│   ├── auth/
│   │   ├── LoginView.js        # Giao diện Đăng nhập & nút chuyển quyền Demo
│   │   └── RegisterView.js     # Giao diện Đăng ký tài khoản
│   ├── customer/
│   │   ├── HomeView.js         # Trang chủ: Giới thiệu quán, món hot, tiện ích
│   │   ├── BookingView.js      # Form đặt bàn: Ngày giờ, sơ đồ bàn, đặt trước món
│   │   ├── TablesView.js       # Sơ đồ bàn trực quan theo khu vực & tiện ích
│   │   ├── MenuView.js         # Thực đơn nước uống, tìm kiếm & giỏ hàng
│   │   ├── MyBookingsView.js   # Lịch sử đặt bàn của khách & trạng thái
│   │   └── ProfileView.js      # Thông tin cá nhân, hotline & chuyển sang Quản trị
│   └── admin/
│       ├── AdminDashboardView.js # Thống kê tổng quan, duyệt đặt bàn chờ
│       ├── AdminBookingsView.js  # Quản lý tất cả lượt đặt bàn (Duyệt / Hủy)
│       ├── AdminTablesView.js    # Thêm bàn, đổi trạng thái (Trống / Đang dùng / Đã đặt)
│       ├── AdminMenuView.js      # Thêm món mới, bật/tắt còn hàng, xóa món
│       └── AdminUsersView.js     # Quản lý tài khoản (Khóa / Mở khóa, thêm nhân viên)
│
├── context/                    # Context chia sẻ trạng thái & liên kết Presenter
├── navigation/                 # AppNavigator (Bottom Tabs + Native Stack)
├── theme/                      # Bảng màu chủ đạo Amber / Cream / Stone
└── config/                     # Cấu hình IP/API đa nền tảng (Android / iOS / Web)
```

---

## 🛠️ Công Nghệ Sử Dụng

* **Frontend (Mobile App - Kiến trúc MVP):**
  * React Native (Expo SDK 58)
  * React Navigation (Bottom Tabs, Native Stack)
  * @react-native-async-storage/async-storage
  * @expo/vector-icons (Ionicons)
  * Hỗ trợ đa nền tảng: Android, iOS và Web
* **Backend:**
  * Python 3
  * **FastAPI** (RESTful API tốc độ cao, hỗ trợ Swagger UI tài liệu tự động `/docs`)
  * Uvicorn (ASGI server)
  * Pydantic v2 (Validation dữ liệu)
  * Database lưu trữ JSON tự động đồng bộ & nạp dữ liệu mẫu

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Khởi chạy Backend (FastAPI)
1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
3. Chạy FastAPI server:
   ```bash
   python main.py
   # hoặc: uvicorn main:app --reload --host 0.0.0.0 --port 8080
   ```
*Server sẽ chạy tại `http://localhost:8080` (Tài liệu Swagger API tại `http://localhost:8080/docs`).*

### 2. Khởi chạy Ứng dụng Di động (Frontend React Native)
1. Mở terminal mới và di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng:
   ```bash
   npm start
   ```
   * **Chạy trên điện thoại di động:** Quét mã QR trên Terminal bằng ứng dụng **Expo Go** (Android/iOS).
   * **Chạy trên Android Emulator:** Nhấn phím `a` trên Terminal.
   * **Chạy thử trên Web Browser:** Nhấn phím `w` trên Terminal hoặc chạy lệnh `npm run web`.

---

## 🔐 Tài Khoản Kiểm Thử (Đăng nhập nhanh 1-chạm)

Tại màn hình Đăng nhập của ứng dụng, đã tích hợp sẵn 3 nút chuyển quyền tức thì:

* **👑 Admin (Quản trị viên):** `admin@pamcoffeetea.com` / `admin`
* **💼 Staff (Nhân viên quán):** `nhanvien@pamcoffeetea.com` / `staff`
* **☕ Customer (Khách hàng):** `khachhang@gmail.com` / `customer`
