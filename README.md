# Coffee Shop Table Booking System (Pam Coffee & Tea)

Hệ thống quản lý và đặt bàn trực tuyến cho quán cà phê **Pam Coffee & Tea**, bao gồm giao diện khách hàng đặt bàn, xem thực đơn và bảng quản trị (Admin Dashboard) dành cho quản lý quán.

Hệ thống được thiết kế theo cơ chế **Hybrid** (Đồng bộ hóa linh hoạt giữa Backend API và Trình duyệt Cache local), cho phép giao diện hoạt động mượt mà ngay cả khi backend ở chế độ offline.

---

## Tính năng chính

### 1. Phía Khách hàng (Customer Interface)
* **Trang chủ:** Giới thiệu quán, hiển thị 3 thực đơn nổi bật, các tiện ích nổi bật.
* **Đặt bàn trực tuyến:** Chọn sơ đồ bàn trực quan, điền thông tin đặt bàn (ngày giờ, số lượng khách, ghi chú), tùy chọn đặt trước thực đơn.
* **Xem thực đơn:** Xem danh sách thực đơn phân theo nhóm danh mục (Trà Sữa, Ca Cao, Sữa Tươi, Trà Trái Cây) với mức giá rõ ràng.
* **Sơ đồ bàn động:** Hiển thị trực quan vị trí bàn (cặp đôi, sân vườn, phòng lạnh, gác lửng) và trạng thái hiện tại (Còn trống / Đã đặt).

### 2. Phía Quản lý (Admin Dashboard)
* **Thống kê tổng quan:** Theo dõi doanh thu, số lượng đặt bàn, bàn đang sử dụng và món ăn bán chạy nhất bằng biểu đồ trực quan (Chart.js).
* **Quản lý đặt bàn:** Xem danh sách khách hàng đặt bàn, phê duyệt (`CONFIRMED`) hoặc hủy (`CANCELLED`) lượt đặt.
* **Quản lý danh sách bàn:** Thêm bàn mới, sửa đổi trạng thái bàn, xóa bàn và thiết lập thuộc tính bàn (gần cửa sổ, ngoài trời, ổ cắm điện, số ghế).
* **Đồng bộ hóa tự động:** Mọi thao tác thêm/sửa/xóa bàn từ trang Admin sẽ ngay lập tức được đồng bộ và phản ánh sang trang đặt bàn của Khách hàng.

---

## 🛠️ Công nghệ sử dụng

* **Frontend:**
  * HTML5 
  * CSS3 
  * TailwindCSS 
  * JavaScript ES6+ (Xử lý logic động, tương tác APIs, LocalStorage fallback)
* **Backend:**
  * Java Spring Boot 3
  * Spring Security & JWT (Bảo mật xác thực phân quyền Admin / Customer)
  * Spring Data MongoDB
* **Database:**
  * MongoDB 

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu hệ thống
* Đã cài đặt **Java JDK 17** hoặc mới hơn.
* Đã cài đặt **Node.js** và **npm**.
* Đã bật dịch vụ **MongoDB** local (cổng mặc định `27017`).

### 1. Khởi chạy Backend (Spring Boot)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Biên dịch dự án:
   ```bash
   ./mvnw compile
   ```
3. Chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```


### 2. Khởi chạy Giao diện (Frontend)
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các dependencies cần thiết (nếu có):
   ```bash
   npm install
   ```
3. Chạy server phát triển cục bộ:
   ```bash
   npm run dev
   ```
*Mở trình duyệt truy cập đường dẫn hiển thị trên terminal (thường là `http://localhost:5173`).*

---

## 🔐 Tài khoản thử nghiệm 

Hệ thống đã được seeder sẵn tài khoản mẫu để bạn kiểm tra các chức năng phân quyền:

* **Tài khoản Admin (Quản trị viên):**
  * Email: `admin@pamcoffeetea.com`
  * Mật khẩu: `admin`
* **Tài khoản Customer (Khách hàng):**
  * Email: `khachhang@gmail.com`
  * Mật khẩu: `customer`

---

## 📁 Cấu trúc thư mục dự án

```text
├── backend/                   # Mã nguồn Spring Boot Backend
│   ├── src/main/java/         # Mã nguồn Java (Controllers, Services, Models, Repositories)
│   └── src/main/resources/    # Cấu hình dự án (application.yml)
├── frontend/                  # Mã nguồn giao diện tĩnh và assets
│   ├── assets/                # Hình ảnh, logo, tài nguyên tĩnh
│   ├── js/                    # Các file xử lý logic Javascript (main.js, booking.js, admin.js)
│   ├── index.html             # Trang chủ khách hàng
│   ├── booking.html           # Trang đặt bàn
│   ├── tables.html            # Trang sơ đồ bàn
│   ├── menu.html              # Trang thực đơn
│   ├── login.html             # Trang đăng nhập
│   └── register.html          # Trang đăng ký
└── README.md                  # Hướng dẫn dự án
```
