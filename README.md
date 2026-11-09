# Coffee Shop Table Booking System (Pam Coffee & Tea)

Hệ thống quản lý và đặt bàn trực tuyến cho quán cà phê **Pam Coffee & Tea** được xây dựng theo kiến trúc **MVP (Model - View - Presenter)** trên nền tảng **React Native (Expo)**, kết hợp cùng **FastAPI Backend (Python)**, quản lý trạng thái tập trung với **Redux Toolkit**, giao diện hiện đại với **Tamagui**, hỗ trợ **AI Coffee Assistant**, hoạt động đa nền tảng (Android / iOS / Tablet / iPad / Web) và tương thích hoàn toàn cả khi Online lẫn Offline.

---

## 📋 Bảng Đối Chiếu Tiêu Chí Chấm Điểm Của Giảng Viên

| # | Tiêu chí của Thầy | Trạng thái | Hiện thực cụ thể trong dự án |
| :-: | :--- | :-: | :--- |
| **1** | **Về chức năng**: ~10 chức năng, 10–15 màn hình | ✅ **Đạt** | **17 màn hình** hoàn chỉnh: Login, Register, Home, Menu, DrinkDetail, Booking, Tables, BookingDetail (vé QR), MyBookings, Profile, Notifications, **AICoffeeAssistant**, AdminDashboard, AdminBookings, AdminTables, AdminMenu, AdminUsers. |
| **2** | **Có backend**: tự xây hoặc mock API | ✅ **Đạt** | **FastAPI Backend (Python)** chuẩn RESTful, có Swagger UI tại `/docs`, tự động khởi tạo dữ liệu mẫu, kèm cơ chế Offline fallback dự phòng. |
| **3** | **Dùng Axios để get API** | ✅ **Đạt** | `axiosClient` trong `src/config/axiosClient.js` cấu hình interceptor, token auth, timeout và xử lý lỗi mạng thống nhất. |
| **4** | **Dùng Expo Project** | ✅ **Đạt** | Khởi tạo và cấu hình hoàn chỉnh bằng Expo, chạy được trên Expo Go, Web, Android emulator, iOS simulator. |
| **5** | **Build & phân phối qua internet** | ✅ **Đạt** | Hỗ trợ build file APK qua EAS Build (`eas build -p android --profile preview`) và export web (`npx expo export --platform web`). |
| **6** | **AI basic** | ✅ **Đạt** | **Pam AI Coffee Assistant**: Gợi ý thức uống thông minh theo tâm trạng/sở thích qua API `/api/ai/recommend` và màn hình chat chuyên biệt. |
| **7** | **ReduxToolkit** | ✅ **Đạt** | Cấu hình `@reduxjs/toolkit` tại `src/store/index.js` với các slice: `authSlice`, `tablesSlice`, `menuSlice`, `bookingsSlice`. |
| **8** | **Chạy được trên thiết bị thật (real device)** | ✅ **Đạt** | Quét mã QR bằng ứng dụng **Expo Go** trên Android/iPhone hoặc cài đặt trực tiếp qua file **APK**. |
| **9** | **Responsive (quay ngang, Tablet, iPad)** | ✅ **Đạt** | Custom hook `useResponsive()` tự động nhận diện hướng màn hình và kích thước để chia lưới hiển thị (1-4 cột) mượt mà. |
| **10** | **Animation basic** | ✅ **Đạt** | Hiệu ứng chuyển động mượt mà: `FadeInView` (hiển thị mờ dần) và `AnimatedScaleButton` (co giãn khi click nút). |
| **11** | **TamaGUI** | ✅ **Đạt** | Tích hợp thư viện UI hiện đại `tamagui` & `@tamagui/config` với `TamaguiProvider` bao bọc toàn bộ ứng dụng tại `App.js`. |

---

## 🏛️ Kiến Trúc Dự Án: MVP (Model - View - Presenter)

```text
frontend/src/
├── models/                     # [M] MODEL: Gọi API qua Axios, lưu trữ và tương tác dữ liệu
│   ├── UserModel.js            # Đăng nhập, đăng ký, xác thực token
│   ├── TableModel.js           # Lấy danh sách bàn, trạng thái bàn
│   ├── MenuModel.js            # Lấy danh sách menu, chi tiết món
│   ├── ReservationModel.js     # Đặt bàn, hủy bàn, xem lịch sử đặt bàn
│   └── AIModel.js              # Kết nối AI gợi ý thức uống theo cảm xúc
│
├── presenters/                 # [P] PRESENTER: Xử lý logic nghiệp vụ, đồng bộ Redux
│   ├── AuthPresenter.js        # Logic xác thực và chuyển đổi tài khoản
│   ├── BookingPresenter.js     # Tính tổng tiền, validate form đặt bàn
│   ├── TablesPresenter.js      # Lọc bàn theo khu vực, đếm bàn trống
│   ├── MenuPresenter.js        # Lọc danh mục món, quản lý giỏ hàng
│   ├── MyBookingsPresenter.js  # Quản lý và hủy lịch đặt chỗ cá nhân
│   └── AdminDashboardPresenter.js # Thống kê doanh thu, tỷ lệ lấp đầy, duyệt đơn
│
├── views/                      # [V] VIEW: Giao diện thuần túy (Passive View)
│   ├── auth/
│   │   ├── LoginView.js        # Đăng nhập + Demo Quick Login (Khách / Quản trị)
│   │   └── RegisterView.js     # Đăng ký tài khoản mới
│   ├── customer/
│   │   ├── HomeView.js         # Trang chủ giới thiệu quán & banner ưu đãi
│   │   ├── BookingView.js      # Form đặt bàn & chọn món trước
│   │   ├── TablesView.js       # Sơ đồ bàn trực quan theo khu vực
│   │   ├── MenuView.js         # Danh mục thức uống & giỏ hàng
│   │   ├── DrinkDetailView.js  # Chi tiết thức uống (chọn Size, Đường, Đá, Topping)
│   │   ├── BookingDetailView.js# Chi tiết vé đặt bàn hiển thị mã QR check-in
│   │   ├── MyBookingsView.js   # Lịch sử đặt bàn & trạng thái duyệt
│   │   ├── ProfileView.js      # Thông tin cá nhân & cài đặt
│   │   ├── NotificationsView.js# Thông báo khuyến mãi & sự kiện
│   │   └── AICoffeeAssistantView.js # Trợ lý Pam AI tư vấn thức uống
│   └── admin/
│       ├── AdminDashboardView.js # Thống kê tổng quan & duyệt đơn chờ
│       ├── AdminBookingsView.js  # Quản lý tất cả lượt đặt bàn (Duyệt / Từ chối)
│       ├── AdminTablesView.js    # Quản lý danh sách bàn & tình trạng
│       ├── AdminMenuView.js      # Quản lý món nước (Thêm / Sửa / Hết hàng)
│       └── AdminUsersView.js     # Quản lý danh sách khách hàng & nhân viên
│
├── store/                      # REDUX TOOLKIT: Quản lý Global State
│   ├── index.js                # Redux Root Store
│   └── slices/                 # authSlice, tablesSlice, menuSlice, bookingsSlice
├── theme/                      # Tamagui config, Responsive hooks & Theme màu
├── components/                 # Component tái sử dụng: FadeInView, AnimatedScaleButton
└── navigation/                 # AppNavigator (Bottom Tabs + Native Stack)
```

---

## 🛠️ Công Nghệ Sử Dụng

* **Frontend (Mobile App):**
  * **React Native / Expo SDK 52+**
  * **Tamagui** (`tamagui`, `@tamagui/config`)
  * **Redux Toolkit** (`@reduxjs/toolkit`, `react-redux`)
  * **Axios** (kết nối API và xử lý offline fallback)
  * **React Navigation v7** (Bottom Tabs, Native Stack)
  * **AsyncStorage** (Lưu trữ cục bộ phiên đăng nhập)
* **Backend:**
  * **FastAPI (Python)** - Framework web hiệu năng cao
  * **Uvicorn** - ASGI Server
  * **Pydantic v2** - Data validation
  * Tự động tạo dữ liệu mẫu (Seeder) lưu tại `backend/data/pam_data.json`
  * Swagger UI tài liệu API tự động tại `http://localhost:8080/docs`

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Khởi động Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Server chạy tại:* `http://localhost:8080` (Tài liệu Swagger: `http://localhost:8080/docs`)

### 2. Khởi động Frontend (React Native - Expo)
```bash
cd frontend
npm install
npm start
```
- **Chạy trên điện thoại thật**: Cài app **Expo Go** trên App Store hoặc Google Play, quét mã QR hiển thị trên màn hình terminal. *(Đảm bảo điện thoại và máy tính kết nối chung mạng WiFi LAN)*.
- **Chạy trên máy ảo Android**: Nhấn phím `a`.
- **Chạy trên máy ảo iOS (Mac)**: Nhấn phím `i`.
- **Chạy trực tiếp trên trình duyệt Web**: Nhấn phím `w`.

### 3. Build & Phân phối APK qua Internet
```bash
cd frontend
# Cài đặt EAS CLI nếu chưa có
npm install -g eas-cli

# Đăng nhập Expo
eas login

# Cấu hình và tạo file APK preview
eas build -p android --profile preview
```
*File APK sau khi build xong sẽ có link tải trực tiếp từ Expo Dashboard để gửi cho giảng viên hoặc cài vào điện thoại.*

---

## 👥 Tài Khoản Dùng Thử (Demo Credentials)

Tại màn hình Đăng nhập có 2 nút bấm tiện lợi **"Khách Demo"** và **"Quản trị Demo"** để đăng nhập 1 chạm, hoặc đăng nhập thủ công bằng tài khoản:

1. **Tài khoản Quản trị viên (Admin):**
   - Tên đăng nhập: `admin`
   - Mật khẩu: `admin123`
2. **Tài khoản Khách hàng (Customer):**
   - Tên đăng nhập: `khachhang`
   - Mật khẩu: `user123`
