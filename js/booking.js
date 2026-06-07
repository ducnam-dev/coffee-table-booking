// booking.js - Logic for booking page

// 1. Guard check: Phải đăng nhập mới được vào trang này
if (!checkAuth()) {
  const currentParams = window.location.search;
  window.location.href = `./login.html?from=booking.html${currentParams ? '&' + currentParams.substring(1) : ''}`;
}

// Menu Mock Data cho việc preorder nước
const preorderMenuItems = [
  { id: '1', name: 'Trà Sữa Gạo Rang', price: 18000, priceFormatted: '18,000đ', category: 'Trà Sữa' },
  { id: '2', name: 'Trà Sữa Thái', price: 15000, priceFormatted: '15,000đ', category: 'Trà Sữa' },
  { id: '3', name: 'Trà Sữa Môn', price: 15000, priceFormatted: '15,000đ', category: 'Trà Sữa' },
  { id: '4', name: 'Trà Sữa Socola', price: 15000, priceFormatted: '15,000đ', category: 'Trà Sữa' },
  { id: '5', name: 'Trà Sữa Truyền Thống', price: 15000, priceFormatted: '15,000đ', category: 'Trà Sữa' },
  { id: '6', name: 'Ca Cao Dầm Trân Châu', price: 20000, priceFormatted: '20,000đ', category: 'Ca Cao' },
  { id: '7', name: 'Sữa Tươi Dâu Tằm', price: 20000, priceFormatted: '20,000đ', category: 'Sữa Tươi' },
  { id: '8', name: 'Sữa Tươi Việt Quất', price: 20000, priceFormatted: '20,000đ', category: 'Sữa Tươi' },
  { id: '9', name: 'Sữa Tươi Trân Châu Đường Đen', price: 20000, priceFormatted: '20,000đ', category: 'Sữa Tươi' },
  { id: '10', name: 'Trà Đào', price: 15000, priceFormatted: '15,000đ', category: 'Trà Trái Cây' },
  { id: '11', name: 'Trà Tắc', price: 15000, priceFormatted: '15,000đ', category: 'Trà Trái Cây' },
  { id: '12', name: 'Trà Dâu', price: 15000, priceFormatted: '15,000đ', category: 'Trà Trái Cây' }
];

// Giỏ hàng lưu trữ số lượng các món preorder: { id: quantity }
let preorderCart = {};

// Tables Mock Data fallback
const fallbackTables = [
  { id: '1', name: 'Bàn 01 (Cửa sổ)', capacity: 2, status: 'EMPTY', type: 'Cặp đôi' },
  { id: '2', name: 'Bàn 02 (Sân vườn)', capacity: 4, status: 'RESERVED', type: 'Gia đình' },
  { id: '3', name: 'Bàn 03 (Phòng lạnh)', capacity: 6, status: 'EMPTY', type: 'Nhóm làm việc' },
  { id: '4', name: 'Bàn 04 (Gác lửng)', capacity: 2, status: 'EMPTY', type: 'Cặp đôi' }
];

async function loadTablesForBooking(selectedTableId) {
  const tableSelect = document.getElementById('booking-table');
  if (!tableSelect) return;

  let tables = [...fallbackTables];

  // 1. Đọc từ localStorage trước
  const localTablesJson = localStorage.getItem('tables');
  if (localTablesJson) {
    try {
      tables = JSON.parse(localTablesJson);
    } catch(e) {}
  }

  // 2. Fetch từ Backend nếu chạy
  try {
    const res = await fetch('http://localhost:8080/api/tables');
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        tables = data.map(t => ({
          id: t.id.toString(),
          name: t.name || `Bàn ${t.id}`,
          capacity: t.seats || 2,
          status: t.status === 'AVAILABLE' ? 'EMPTY' : t.status,
          type: t.isNearWindow ? 'Cặp đôi' : (t.isOutdoor ? 'Sân vườn' : 'Phòng lạnh')
        }));
        localStorage.setItem('tables', JSON.stringify(tables));
      }
    }
  } catch (err) {
    console.warn("Backend offline, sử dụng tables local.");
  }

  // 3. Render các options
  tableSelect.innerHTML = '<option value="">Chọn bàn</option>' + 
    tables.map(t => {
      const isAvailable = t.status === 'EMPTY' || t.status === 'AVAILABLE';
      if (isAvailable || t.id === selectedTableId) {
        return `<option value="${t.id}">${t.name} - Tối đa ${t.capacity} người (${t.type})</option>`;
      }
      return '';
    }).filter(Boolean).join('');

  if (selectedTableId) {
    tableSelect.value = selectedTableId;
  }
}

// Khởi tạo trang đặt bàn
document.addEventListener('DOMContentLoaded', () => {
  // Gán ngày mặc định là hôm nay
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Pre-populate chọn bàn từ tham số query (?tableId=X)
  const urlParams = new URLSearchParams(window.location.search);
  const tableIdParam = urlParams.get('tableId');
  loadTablesForBooking(tableIdParam);

  // Render danh sách nước preorder
  const preorderContainer = document.getElementById('preorder-menu-list');
  if (preorderContainer) {
    preorderContainer.innerHTML = preorderMenuItems.map(item => {
      preorderCart[item.id] = 0; // Đặt mặc định = 0
      return `
        <div class="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 flex flex-col justify-between hover:border-amber-200 transition-colors">
          <div>
            <h4 class="text-sm font-bold text-stone-850">${item.name}</h4>
            <span class="text-xs font-extrabold text-amber-700 block mt-1">${item.priceFormatted}</span>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xs text-stone-400">Số lượng</span>
            <div class="flex items-center gap-2">
              <button type="button" onclick="changeQty('${item.id}', -1)" class="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-300 bg-white hover:bg-stone-100 font-bold active:scale-90 transition-all">-</button>
              <span id="qty-${item.id}" class="text-sm font-bold w-4 text-center">0</span>
              <button type="button" onclick="changeQty('${item.id}', 1)" class="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-300 bg-white hover:bg-stone-100 font-bold active:scale-90 transition-all">+</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Xử lý nộp form đặt bàn
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const dateVal = document.getElementById('booking-date').value;
      const timeVal = document.getElementById('booking-time').value;
      const guestsVal = document.getElementById('booking-guests').value;
      const tableSelect = document.getElementById('booking-table');
      const tableText = tableSelect.options[tableSelect.selectedIndex].text;
      
      const user = getCurrentUser() || { fullName: 'Khách hàng', username: 'Guest' };
      
      // Tạo mã booking ngẫu nhiên
      const randomCode = 'PAM-' + Math.floor(10000 + Math.random() * 90000);

      // Điền thông tin vào trang thành công
      document.getElementById('summary-code').textContent = randomCode;
      document.getElementById('summary-name').textContent = user.fullName || user.username;
      document.getElementById('summary-table').textContent = tableText.split(' - ')[0]; // lấy phần "Bàn 01 (Cửa sổ)"
      
      // Định dạng ngày hiển thị (yyyy-mm-dd -> dd/mm/yyyy)
      const dateParts = dateVal.split('-');
      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : dateVal;
      document.getElementById('summary-time').textContent = `${timeVal}, ngày ${formattedDate}`;
      document.getElementById('summary-guests').textContent = `${guestsVal} người`;

      // Xử lý danh sách nước đặt trước
      const preorderListContainer = document.getElementById('summary-preorder-container');
      const preorderList = document.getElementById('summary-preorder-list');
      const preorderTotal = document.getElementById('summary-total');

      let hasPreorders = false;
      let totalAmount = 0;
      let preorderItemsHtml = '';

      preorderMenuItems.forEach(item => {
        const qty = preorderCart[item.id];
        if (qty > 0) {
          hasPreorders = true;
          const subtotal = qty * item.price;
          totalAmount += subtotal;
          preorderItemsHtml += `
            <div class="flex justify-between items-center py-0.5">
              <span>${item.name} <span class="font-bold text-amber-700">x${qty}</span></span>
              <span class="font-medium text-stone-700">${subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
          `;
        }
      });

      if (hasPreorders) {
        preorderListContainer.classList.remove('hidden');
        preorderList.innerHTML = preorderItemsHtml;
        preorderTotal.textContent = totalAmount.toLocaleString('vi-VN') + 'đ';
      } else {
        preorderListContainer.classList.add('hidden');
      }

      // Ẩn form, hiện màn hình thành công
      document.getElementById('booking-form-section').classList.add('hidden');
      document.getElementById('booking-success-section').classList.remove('hidden');
      
      // Lưu vào localStorage phục vụ việc chia sẻ trạng thái giữa Khách hàng và Admin (đặc biệt khi offline)
      const reservationObj = {
        id: randomCode,
        customer: user.fullName || user.username || 'Khách hàng',
        phone: user.phone || '0901234567',
        table: tableText.split(' - ')[0],
        time: `${timeVal}, ngày ${formattedDate}`,
        guests: parseInt(guestsVal),
        status: 'PENDING',
        totalAmount: totalAmount,
        userId: user.id || null,
        username: user.username || null
      };
      
      let localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localBookings.unshift(reservationObj);
      localStorage.setItem('bookings', JSON.stringify(localBookings));

      // Gọi API Spring Boot để lưu vào DB (nếu backend đang chạy)
      const tableId = parseInt(tableSelect.value) || 1;
      const apiPayload = {
        coffeeTable: { id: tableId },
        reservationDate: `${dateVal}T${timeVal}:00`,
        endTime: `${dateVal}T${String(parseInt(timeVal.split(':')[0]) + 2).padStart(2, '0')}:${timeVal.split(':')[1]}:00`,
        guestCount: parseInt(guestsVal),
        note: `Mã đặt bàn: ${randomCode}. Preorder: ${JSON.stringify(preorderCart)}. Tổng tiền: ${totalAmount}đ`
      };

      fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiPayload)
      })
      .then(async res => {
        if (res.ok) {
          const savedRes = await res.json();
          console.log("Đã đồng bộ đơn đặt bàn lên Server:", savedRes);
          if (savedRes && savedRes.id) {
            let localB = JSON.parse(localStorage.getItem('bookings') || '[]');
            localB = localB.map(b => b.id === randomCode ? { ...b, id: savedRes.id.toString(), isFromBackend: true } : b);
            localStorage.setItem('bookings', JSON.stringify(localB));
            if (window.loadCustomerBookings) {
              window.loadCustomerBookings();
            }
          }
        }
      })
      .catch(err => {
        console.warn("Backend offline. Đơn đặt bàn đã được lưu dưới client (localStorage).");
      });

      // Scroll lên đầu trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Load lại danh sách đặt bàn phía dưới
      if (window.loadCustomerBookings) {
        window.loadCustomerBookings();
      }
    });
  }

  // Tải danh sách đặt bàn khi load trang
  if (window.loadCustomerBookings) {
    window.loadCustomerBookings();
  }
});

// Hàm thay đổi số lượng món nước preorder
window.changeQty = function(itemId, amount) {
  if (preorderCart[itemId] !== undefined) {
    let currentQty = preorderCart[itemId];
    currentQty += amount;
    if (currentQty < 0) currentQty = 0;
    if (currentQty > 10) currentQty = 10; // Giới hạn max 10
    
    preorderCart[itemId] = currentQty;
    const qtySpan = document.getElementById(`qty-${itemId}`);
    if (qtySpan) {
      qtySpan.textContent = currentQty;
    }
  }
};

// Hàm load danh sách bàn đã đặt của khách hàng hiện tại
window.loadCustomerBookings = async function() {
  if (window.syncLocalBookings) {
    await window.syncLocalBookings();
  }

  const user = getCurrentUser();
  if (!user) return;

  const bookingsListContainer = document.getElementById('customer-bookings-list');
  if (!bookingsListContainer) return;

  let customerBookings = [];

  // 1. Load từ Backend API nếu có
  const API_BASE_URL = 'http://localhost:8080/api';
  const token = localStorage.getItem('token');
  if (token && user.id) {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          customerBookings = data.map(r => {
            const tableObj = r.coffeeTable || {};
            
            // Định dạng ngày giờ: yyyy-mm-ddTHH:mm:ss -> HH:mm, ngày dd/mm/yyyy
            let timeFormatted = r.reservationDate || '';
            if (r.reservationDate) {
              try {
                const dt = new Date(r.reservationDate);
                const hh = String(dt.getHours()).padStart(2, '0');
                const mm = String(dt.getMinutes()).padStart(2, '0');
                const dd = String(dt.getDate()).padStart(2, '0');
                const mth = String(dt.getMonth() + 1).padStart(2, '0');
                const yyyy = dt.getFullYear();
                timeFormatted = `${hh}:${mm}, ngày ${dd}/${mth}/${yyyy}`;
              } catch (err) {
                timeFormatted = r.reservationDate;
              }
            }

            // Phân tích ghi chú để lấy tổng tiền nếu có
            let totalAmount = 0;
            if (r.note && r.note.includes('Tổng tiền:')) {
              const match = r.note.match(/Tổng tiền:\s*(\d+)đ/);
              if (match) {
                totalAmount = parseInt(match[1]);
              }
            }

            return {
              id: r.id.toString(),
              table: tableObj.name || `Bàn ${tableObj.id || ''}`,
              time: timeFormatted,
              guests: r.guestCount || 2,
              status: r.status, // PENDING, CONFIRMED, CANCELLED
              totalAmount: totalAmount,
              isFromBackend: true
            };
          });
        }
      }
    } catch (e) {
      console.warn("Backend offline. Đang lấy dữ liệu đặt bàn từ localStorage.");
    }
  }

  // 2. Load từ localStorage (đối với chế độ offline hoặc mock)
  const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  localBookings.forEach(lb => {
    // Chỉ lấy đơn đặt của user hiện tại
    const isOwner = lb.username === user.username || lb.userId === user.id || (!lb.username && user.role === 'CUSTOMER');
    if (isOwner) {
      // Tránh trùng lặp với dữ liệu từ backend
      if (!customerBookings.some(cb => cb.id === lb.id)) {
        customerBookings.push({
          ...lb,
          isFromBackend: false
        });
      }
    }
  });

  // Render danh sách
  if (customerBookings.length === 0) {
    bookingsListContainer.innerHTML = `
      <div class="sm:col-span-2 text-center py-12 text-stone-400 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-sm font-semibold">Bạn chưa đặt bàn nào.</span>
        <p class="text-xs text-stone-400 mt-1">Hãy điền form phía trên để đặt giữ bàn ngay nhé!</p>
      </div>
    `;
    return;
  }

  // Sắp xếp các đặt bàn mới nhất lên đầu
  customerBookings.sort((a, b) => b.id.localeCompare(a.id));

  bookingsListContainer.innerHTML = customerBookings.map(booking => {
    const isPending = booking.status === 'PENDING';
    const isConfirmed = booking.status === 'CONFIRMED';
    const isCancelled = booking.status === 'CANCELLED';

    let statusBadgeClass = '';
    let statusText = '';
    if (isConfirmed) {
      statusBadgeClass = 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10';
      statusText = 'Đã duyệt';
    } else if (isPending) {
      statusBadgeClass = 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10';
      statusText = 'Chờ duyệt';
    } else {
      statusBadgeClass = 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10';
      statusText = 'Đã hủy';
    }

    const preorderText = booking.totalAmount > 0 
      ? `<div class="flex items-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg self-start">
           <span>Pre-order: ${booking.totalAmount.toLocaleString('vi-VN')}đ</span>
         </div>`
      : '';

    // Nút hủy chỉ hiện khi đang chờ duyệt (PENDING)
    const cancelActionBtn = isPending
      ? `<button type="button" onclick="cancelCustomerBooking('${booking.id}')" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:border-rose-350 transition-colors active:scale-95">
           Hủy đặt bàn
         </button>`
      : '';

    return `
      <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
        <div class="space-y-3">
          <!-- Card Header -->
          <div class="flex justify-between items-center">
            <span class="text-xs font-extrabold text-stone-400">Mã: ${booking.id}</span>
            <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass}">
              ${statusText}
            </span>
          </div>

          <!-- Card Body -->
          <div>
            <h3 class="text-base font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
              ${booking.table}
            </h3>
            <div class="mt-2 space-y-1.5 text-xs text-stone-500">
              <p class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${booking.time}
              </p>
              <p class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Số lượng khách: ${booking.guests} người
              </p>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-between border-t border-stone-100 pt-3">
          ${preorderText}
          <div class="ml-auto">
            ${cancelActionBtn}
          </div>
        </div>
      </div>
    `;
  }).join('');
};

// Hàm hủy đặt bàn dành cho khách hàng
window.cancelCustomerBooking = async function(id) {
  if (!confirm('Bạn có chắc chắn muốn hủy yêu cầu đặt bàn này không?')) return;

  // 1. Cập nhật trong localStorage
  let localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  localBookings = localBookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b);
  localStorage.setItem('bookings', JSON.stringify(localBookings));

  // 2. Cập nhật lên Backend (nếu đơn này là số - tức là từ Backend)
  if (!isNaN(id)) {
    const API_BASE_URL = 'http://localhost:8080/api';
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/reservations/${id}/status?status=CANCELLED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`Đã hủy đặt bàn #${id} thành công lên server.`);
    } catch (e) {
      console.error("Lỗi gửi yêu cầu hủy đặt bàn lên server:", e);
    }
  }

  // Tải lại danh sách
  window.loadCustomerBookings();
};
