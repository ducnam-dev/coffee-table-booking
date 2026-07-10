// admin.js - Logic for admin dashboard (Tabs, Filters, Tables, Menu, and Backend API)

// 1. Guard Check: Phải là Admin hoặc Nhân Viên mới được xem trang này
const user = getCurrentUser();
if (!checkAuth() || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
  alert('Bạn không có quyền truy cập trang quản trị này!');
  window.location.href = './index.html';
}

const API_BASE_URL = 'http://localhost:8080/api';
const authToken = localStorage.getItem('token');

// State variables
let currentFilter = 'ALL';
let activeTab = 'dashboard';

// Mock/API Data Lists
let recentBookings = [
  { id: 'B001', customer: 'Lê Hoàng Khách VIP', phone: '0901234567', table: 'Bàn 01 (Cửa sổ)', time: '19:00 - Hôm nay', guests: 2, status: 'PENDING' },
  { id: 'B002', customer: 'Nguyễn Trần Huy', phone: '0988776655', table: 'Bàn 03 (Phòng lạnh)', time: '20:30 - Hôm nay', guests: 5, status: 'CONFIRMED' },
  { id: 'B003', customer: 'Phạm Minh Đức', phone: '0911223344', table: 'Bàn 04 (Gác lửng)', time: '09:00 - Ngày mai', guests: 2, status: 'CANCELLED' },
  { id: 'B004', customer: 'Trần Thanh Hằng', phone: '0922334455', table: 'Bàn 02 (Sân vườn)', time: '18:00 - Hôm nay', guests: 4, status: 'PENDING' }
];

let tablesList = [
  { id: 1, name: 'Bàn 01 (Cửa sổ)', capacity: 2, type: 'Cặp đôi', status: 'EMPTY' },
  { id: 2, name: 'Bàn 02 (Sân vườn)', capacity: 4, type: 'Gia đình', status: 'RESERVED' },
  { id: 3, name: 'Bàn 03 (Phòng lạnh)', capacity: 6, type: 'Nhóm làm việc', status: 'RESERVED' },
  { id: 4, name: 'Bàn 04 (Gác lửng)', capacity: 2, type: 'Cặp đôi', status: 'EMPTY' }
];

let menuList = [
  { id: 1, name: 'Trà Sữa Gạo Rang', category: 'Trà Sữa', price: 18000, description: 'Trà sữa gạo rang thơm bùi, ngọt ngào đặc trưng.', available: true },
  { id: 2, name: 'Trà Sữa Thái', category: 'Trà Sữa', price: 15000, description: 'Trà sữa Thái xanh/đỏ thơm mát đậm đà vị trà thảo mộc.', available: true },
  { id: 3, name: 'Trà Sữa Môn', category: 'Trà Sữa', price: 15000, description: 'Trà sữa khoai môn ngọt bùi, béo ngậy sắc tím.', available: true },
  { id: 4, name: 'Trà Sữa Socola', category: 'Trà Sữa', price: 15000, description: 'Trà sữa hương vị Socola đậm vị đắng ngọt hòa quyện.', available: true },
  { id: 5, name: 'Trà Sữa Truyền Thống', category: 'Trà Sữa', price: 15000, description: 'Trà sữa truyền thống thơm ngon đậm vị trà béo vị sữa.', available: true },
  { id: 6, name: 'Ca Cao Dầm Trân Châu', category: 'Ca Cao', price: 20000, description: 'Ca cao dầm đậm đặc kèm trân châu dai ngon sần sật.', available: true },
  { id: 7, name: 'Sữa Tươi Dâu Tằm', category: 'Sữa Tươi', price: 20000, description: 'Sữa tươi béo ngậy quyện mứt dâu tằm chua ngọt tự nhiên.', available: true },
  { id: 8, name: 'Sữa Tươi Việt Quất', category: 'Sữa Tươi', price: 20000, description: 'Sữa tươi thơm béo kết hợp sốt việt quất chua ngọt tươi mát.', available: true },
  { id: 9, name: 'Sữa Tươi Trân Châu Đường Đen', category: 'Sữa Tươi', price: 20000, description: 'Sữa tươi trân châu đường đen trứ danh ngọt ngào thơm ngon.', available: true },
  { id: 10, name: 'Trà Đào', category: 'Trà Trái Cây', price: 15000, description: 'Trà đào thơm thanh mát cùng những lát đào giòn ngọt.', available: true },
  { id: 11, name: 'Trà Tắc', category: 'Trà Trái Cây', price: 15000, description: 'Trà tắc/quất chua chua ngọt ngọt giải nhiệt cực đã.', available: true },
  { id: 12, name: 'Trà Dâu', category: 'Trà Trái Cây', price: 15000, description: 'Trà dâu tây tươi mát ngập tràn vị dâu ngọt ngào.', available: true }
];

// Instance biểu đồ toàn cục
let revenueChartInstance = null;
let statusChartInstance = null;

// Helper headers cho REST API
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authToken}`
});

// --- API INTEGRATION ---

// Load danh sách Bàn
async function loadTables() {
  try {
    const res = await fetch(`${API_BASE_URL}/tables`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        tablesList = data.map(t => ({
          id: t.id,
          name: t.name,
          capacity: t.seats || 2,
          type: t.isNearWindow ? 'Cặp đôi' : (t.isOutdoor ? 'Sân vườn' : 'Phòng lạnh'),
          status: t.status === 'AVAILABLE' ? 'EMPTY' : t.status
        }));
        localStorage.setItem('tables', JSON.stringify(tablesList));
      }
    }
  } catch (e) {
    console.warn("Backend offline. Sử dụng mock/local tables list.");
    const localTablesJson = localStorage.getItem('tables');
    if (localTablesJson) {
      try {
        tablesList = JSON.parse(localTablesJson);
      } catch (err) {}
    }
  }
  renderTables();
  updateDashboardStats();
}

// Helper to map menu item properties between frontend (available) and backend (isAvailable)
function mapMenuItem(item) {
  if (!item) return item;
  return {
    ...item,
    available: item.isAvailable !== undefined ? item.isAvailable : item.available,
    isAvailable: item.isAvailable !== undefined ? item.isAvailable : item.available
  };
}

// Load danh sách Thực đơn
async function loadMenu() {
  try {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        menuList = data.map(mapMenuItem);
      }
    }
  } catch (e) {
    console.warn("Backend offline. Sử dụng mock menu list.");
  }
  renderMenu();
}

// Load danh sách Đặt bàn từ API + localStorage
async function loadReservations() {
  try {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      headers: getHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        // Map backend reservations sang format của chúng ta
        const backendBookings = data.map(r => {
          const tableObj = r.coffeeTable || {};
          const userObj = r.user || {};
          
          // Định dạng ngày giờ: yyyy-mm-ddTHH:mm:ss -> HH:mm, ngày dd/mm/yyyy
          let timeFormatted = 'Hôm nay';
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

          return {
            id: r.id.toString(),
            customer: userObj.fullName || userObj.email || 'Khách hàng',
            phone: userObj.phone || '0901234567',
            table: tableObj.name || `Bàn ${tableObj.id || ''}`,
            time: timeFormatted,
            guests: r.guestCount || 2,
            status: r.status // PENDING, CONFIRMED, CANCELLED
          };
        });

        // Chỉ giữ lại những đặt bàn từ backend
        recentBookings = [...backendBookings];
      }
    }
  } catch (e) {
    console.warn("Backend offline. Sử dụng mock reservations.");
  }

  // Load thêm các đặt bàn từ localStorage (do khách hàng đặt trực tiếp trên trình duyệt)
  const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  localBookings.forEach(lb => {
    // Tránh trùng lặp với dữ liệu từ backend
    if (!recentBookings.some(rb => rb.id === lb.id)) {
      recentBookings.unshift(lb);
    }
  });

  renderBookingsTable();
  updateStatusChart();
}


// Thêm hoặc cập nhật Bàn qua API
async function saveTableApi(tableObj) {
  const isEdit = !!tableObj.id;
  try {
    let res;
    if (isEdit) {
      // API update status
      const statusParam = tableObj.status === 'EMPTY' ? 'AVAILABLE' : tableObj.status;
      res = await fetch(`${API_BASE_URL}/tables/${tableObj.id}/status?status=${statusParam}`, {
        method: 'PUT',
        headers: getHeaders()
      });
    } else {
      // API create table
      const backendTable = {
        name: tableObj.name,
        seats: tableObj.capacity,
        status: tableObj.status === 'EMPTY' ? 'AVAILABLE' : tableObj.status,
        isNearWindow: tableObj.type === 'Cặp đôi',
        isOutdoor: tableObj.type === 'Sân vườn',
        hasPowerSocket: tableObj.type === 'Nhóm làm việc'
      };
      res = await fetch(`${API_BASE_URL}/tables`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(backendTable)
      });
    }
    
    if (res.ok) {
      const savedTable = await res.json();
      const mappedTable = {
        id: savedTable.id,
        name: savedTable.name,
        capacity: savedTable.seats || 2,
        type: savedTable.isNearWindow ? 'Cặp đôi' : (savedTable.isOutdoor ? 'Sân vườn' : 'Phòng lạnh'),
        status: savedTable.status === 'AVAILABLE' ? 'EMPTY' : savedTable.status
      };

      if (isEdit) {
        tablesList = tablesList.map(t => t.id === mappedTable.id ? mappedTable : t);
      } else {
        tablesList.push(mappedTable);
      }
      localStorage.setItem('tables', JSON.stringify(tablesList));
      return true;
    }
  } catch (e) {
    console.error("API Error, lưu offline:", e);
  }

  // Fallback Local
  if (isEdit) {
    tablesList = tablesList.map(t => t.id === tableObj.id ? tableObj : t);
  } else {
    tableObj.id = tablesList.length > 0 ? Math.max(...tablesList.map(t => t.id)) + 1 : 1;
    tablesList.push(tableObj);
  }
  localStorage.setItem('tables', JSON.stringify(tablesList));
  return true;
}

// Xóa Bàn qua API
async function deleteTableApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (res.ok) {
      tablesList = tablesList.filter(t => t.id !== id);
      localStorage.setItem('tables', JSON.stringify(tablesList));
      return true;
    }
  } catch (e) {
    console.error("API Error, xóa offline:", e);
  }

  // Fallback
  tablesList = tablesList.filter(t => t.id !== id);
  localStorage.setItem('tables', JSON.stringify(tablesList));
  return true;
}

// Thêm hoặc cập nhật món ăn qua API
async function saveMenuApi(menuObj) {
  const isEdit = !!menuObj.id;
  try {
    let res;
    if (isEdit) {
      res = await fetch(`${API_BASE_URL}/menu/${menuObj.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(menuObj)
      });
    } else {
      res = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(menuObj)
      });
    }

    if (res.ok) {
      const savedMenu = mapMenuItem(await res.json());
      if (isEdit) {
        menuList = menuList.map(m => m.id === savedMenu.id ? savedMenu : m);
      } else {
        menuList.push(savedMenu);
      }
      return true;
    }
  } catch (e) {
    console.error("API Error, lưu món offline:", e);
  }

  // Fallback Local
  if (isEdit) {
    menuList = menuList.map(m => m.id === menuObj.id ? menuObj : m);
  } else {
    menuObj.id = menuList.length > 0 ? Math.max(...menuList.map(m => m.id)) + 1 : 1;
    menuList.push(menuObj);
  }
  return true;
}

// Xóa món ăn qua API
async function deleteMenuApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (res.ok) {
      menuList = menuList.filter(m => m.id !== id);
      return true;
    }
  } catch (e) {
    console.error("API Error, xóa món offline:", e);
  }

  // Fallback
  menuList = menuList.filter(m => m.id !== id);
  return true;
}


// --- UI RENDERING & CHARTS ---

function initCharts() {
  const revCtx = document.getElementById('revenueChart');
  if (revCtx) {
    revenueChartInstance = new Chart(revCtx, {
      type: 'bar',
      data: {
        labels: ['Thứ 6', 'Thứ 7', 'Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5 (Hôm nay)'],
        datasets: [{
          label: 'Doanh thu (đ)',
          data: [3500000, 4800000, 5200000, 3100000, 3800000, 4200000, 4850000],
          backgroundColor: '#d97706',
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' },
            ticks: { color: '#78716c', font: { family: 'Outfit' } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#78716c', font: { family: 'Outfit' } }
          }
        }
      }
    });
  }

  const statusCtx = document.getElementById('statusChart');
  if (statusCtx) {
    const counts = getStatusCounts();
    statusChartInstance = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Chờ duyệt', 'Đã xác nhận', 'Đã hủy'],
        datasets: [{
          data: [counts.pending, counts.confirmed, counts.cancelled],
          backgroundColor: ['#f59e0b', '#10b981', '#f43f5e'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'Outfit', size: 12 }, color: '#44403c', padding: 16 }
          }
        },
        cutout: '65%'
      }
    });
  }
}

function getStatusCounts() {
  const pending = recentBookings.filter(b => b.status === 'PENDING').length;
  const confirmed = recentBookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelled = recentBookings.filter(b => b.status === 'CANCELLED').length;
  return { pending, confirmed, cancelled };
}

function updateStatusChart() {
  if (statusChartInstance) {
    const counts = getStatusCounts();
    statusChartInstance.data.datasets[0].data = [counts.pending, counts.confirmed, counts.cancelled];
    statusChartInstance.update();
  }
}

// Cập nhật card thống kê trên dashboard dựa trên danh sách bàn thực tế
function updateDashboardStats() {
  const total = tablesList.length;
  const reserved = tablesList.filter(t => t.status === 'RESERVED').length;
  const activeTablesEl = document.getElementById('dashboard-active-tables');
  const pctEl = document.getElementById('dashboard-tables-pct');
  
  if (activeTablesEl) {
    activeTablesEl.textContent = `${reserved} / ${total} bàn`;
  }
  if (pctEl) {
    const pct = total > 0 ? Math.round((reserved / total) * 100) : 0;
    pctEl.innerHTML = `${pct}% <span class="text-stone-400 font-medium">công suất phục vụ</span>`;
  }
}

// Đổi Tab
function switchTab(tabName) {
  if (tabName === 'users' && user.role !== 'ADMIN') {
    alert('Bạn không có quyền truy cập tab quản lý tài khoản!');
    switchTab('dashboard');
    return;
  }
  activeTab = tabName;
  const tabs = {
    dashboard: { el: document.getElementById('tab-content-dashboard'), btn: document.getElementById('tab-btn-dashboard'), title: 'Tổng Quan Hệ Thống', desc: 'Chào mừng ngày mới! Dưới đây là hiệu suất vận hành của quán.' },
    bookings: { el: document.getElementById('tab-content-bookings'), btn: document.getElementById('tab-btn-bookings'), title: 'Quản Lý Đặt Bàn', desc: 'Xem danh sách chi tiết và kiểm duyệt các yêu cầu giữ chỗ.' },
    tables: { el: document.getElementById('tab-content-tables'), btn: document.getElementById('tab-btn-tables'), title: 'Quản Lý Bàn', desc: 'Thiết lập danh sách khu vực bàn ghế và cập nhật trạng thái sử dụng.' },
    menu: { el: document.getElementById('tab-content-menu'), btn: document.getElementById('tab-btn-menu'), title: 'Quản Lý Thực Đơn', desc: 'Xem danh sách thực đơn đồ uống & món ngọt của Pam Coffee.' },
    users: { el: document.getElementById('tab-content-users'), btn: document.getElementById('tab-btn-users'), title: 'Quản Lý Tài Khoản', desc: 'Xem, tìm kiếm, khóa/mở khóa, và cập nhật thông tin tài khoản thành viên.' }
  };

  // Ẩn tất cả và bỏ class active
  Object.keys(tabs).forEach(k => {
    const t = tabs[k];
    if (t.el) t.el.classList.add('hidden');
    if (t.btn) t.btn.className = 'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors duration-200';
  });

  // Hiện tab được chọn
  const active = tabs[tabName];
  if (active) {
    if (active.el) active.el.classList.remove('hidden');
    if (active.btn) active.btn.className = 'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-amber-700 bg-amber-50 transition-colors duration-200';
    document.getElementById('view-title').textContent = active.title;
    document.getElementById('view-desc').textContent = active.desc;
  }

  // Load / Render tương ứng
  if (tabName === 'dashboard') {
    setTimeout(() => {
      if (revenueChartInstance) revenueChartInstance.resize();
      if (statusChartInstance) statusChartInstance.resize();
    }, 50);
  } else if (tabName === 'bookings') {
    renderBookingsTable();
  } else if (tabName === 'tables') {
    loadTables();
  } else if (tabName === 'menu') {
    loadMenu();
  } else if (tabName === 'users') {
    loadUsers();
  }
}

// Render danh sách đặt bàn
function renderBookingsTable() {
  const tbody = document.getElementById('admin-bookings-tbody');
  if (!tbody) return;

  const filteredList = recentBookings.filter(booking => {
    if (currentFilter === 'ALL') return true;
    return booking.status === currentFilter;
  });

  const countSpan = document.getElementById('filtered-count');
  if (countSpan) countSpan.textContent = filteredList.length;

  tbody.innerHTML = filteredList.map(booking => {
    const isPending = booking.status === 'PENDING';
    const isConfirmed = booking.status === 'CONFIRMED';
    
    let statusClass = isConfirmed ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' : (isPending ? 'bg-amber-50 text-amber-700 ring-amber-600/10' : 'bg-rose-50 text-rose-700 ring-rose-600/10');
    let statusText = isConfirmed ? 'Đã xác nhận' : (isPending ? 'Chờ duyệt' : 'Đã hủy');

    const actionHtml = isPending
      ? `<div class="flex justify-end gap-2">
          <button onclick="updateBookingStatus('${booking.id}', 'CONFIRMED')" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all" title="Xác nhận">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          </button>
          <button onclick="updateBookingStatus('${booking.id}', 'CANCELLED')" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all" title="Hủy">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>`
      : `<span class="text-xs text-stone-400 italic">Đã xử lý</span>`;

    return `
      <tr class="hover:bg-stone-50/50 transition-colors">
        <td class="px-6 py-4 font-bold text-stone-900">${booking.id}</td>
        <td class="px-6 py-4"><div class="flex flex-col"><span class="font-semibold text-stone-850">${booking.customer}</span><span class="text-xs text-stone-400">${booking.phone}</span></div></td>
        <td class="px-6 py-4 text-stone-700">${booking.table}</td>
        <td class="px-6 py-4 text-stone-700">${booking.time}</td>
        <td class="px-6 py-4 font-semibold text-stone-850">${booking.guests} người</td>
        <td class="px-6 py-4"><span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusClass}">${statusText}</span></td>
        <td class="px-6 py-4 text-right">${actionHtml}</td>
      </tr>
    `;
  }).join('');

  updateBadges();
}

// Render danh sách bàn
function renderTables() {
  const tbody = document.getElementById('admin-tables-tbody');
  if (!tbody) return;

  document.getElementById('tables-total-count').textContent = tablesList.length;

  tbody.innerHTML = tablesList.map(table => {
    const isEmpty = table.status === 'EMPTY' || table.status === 'AVAILABLE';
    const isReserved = table.status === 'RESERVED' || table.status === 'OCCUPIED';
    
    let statusClass = isEmpty ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' : (isReserved ? 'bg-amber-50 text-amber-700 ring-amber-600/10' : 'bg-stone-100 text-stone-600 ring-stone-600/10');
    let statusText = isEmpty ? 'Còn trống' : (isReserved ? 'Đang sử dụng' : 'Bảo trì');

    return `
      <tr class="hover:bg-stone-50/50 transition-colors">
        <td class="px-6 py-4 font-bold text-stone-900">TABLE-${table.id}</td>
        <td class="px-6 py-4 font-semibold text-stone-850">${table.name}</td>
        <td class="px-6 py-4 text-stone-700">${table.capacity} người</td>
        <td class="px-6 py-4 text-stone-600 font-medium">${table.type}</td>
        <td class="px-6 py-4"><span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusClass}">${statusText}</span></td>
        <td class="px-6 py-4 text-right">
          <div class="flex justify-end gap-2">
            <button onclick="editTable(${table.id})" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all" title="Sửa">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onclick="deleteTable(${table.id})" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all" title="Xóa">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Render danh sách Thực đơn
function renderMenu() {
  const tbody = document.getElementById('admin-menu-tbody');
  if (!tbody) return;

  document.getElementById('menu-total-count').textContent = menuList.length;

  tbody.innerHTML = menuList.map(item => {
    let statusClass = item.available ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' : 'bg-stone-100 text-stone-400 ring-stone-600/10';
    let statusText = item.available ? 'Đang bán' : 'Hết hàng';

    return `
      <tr class="hover:bg-stone-50/50 transition-colors">
        <td class="px-6 py-4 font-bold text-stone-900">MENU-${item.id}</td>
        <td class="px-6 py-4 font-semibold text-stone-850">${item.name}</td>
        <td class="px-6 py-4 text-stone-700">${item.category}</td>
        <td class="px-6 py-4 font-extrabold text-amber-700">${item.price.toLocaleString('vi-VN')}đ</td>
        <td class="px-6 py-4"><span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusClass}">${statusText}</span></td>
        <td class="px-6 py-4 text-right">
          <div class="flex justify-end gap-2">
            <button onclick="editMenuItem(${item.id})" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all" title="Sửa">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onclick="deleteMenuItem(${item.id})" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all" title="Xóa">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Cập nhật các badge chờ duyệt
function updateBadges() {
  const counts = getStatusCounts();
  const sidebarBadge = document.getElementById('sidebar-pending-badge');
  if (sidebarBadge) {
    if (counts.pending > 0) {
      sidebarBadge.textContent = counts.pending;
      sidebarBadge.classList.remove('hidden');
    } else {
      sidebarBadge.classList.add('hidden');
    }
  }

  const tableBadge = document.getElementById('pending-count-badge');
  if (tableBadge) {
    if (counts.pending > 0) {
      tableBadge.textContent = `Có ${counts.pending} yêu cầu mới`;
      tableBadge.classList.remove('hidden');
    } else {
      tableBadge.classList.add('hidden');
    }
  }
}

// Lọc đặt bàn theo trạng thái
window.filterBookings = function(status) {
  currentFilter = status;
  const filterBtns = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'];
  filterBtns.forEach(btnType => {
    const btn = document.getElementById(`filter-btn-${btnType}`);
    if (btn) {
      btn.className = (btnType === status)
        ? 'rounded-xl px-4 py-2 text-xs font-bold bg-amber-600 text-white shadow-md shadow-amber-600/10 hover:bg-amber-700 transition-all'
        : 'rounded-xl px-4 py-2 text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-all';
    }
  });
  renderBookingsTable();
};

// Cập nhật trạng thái đặt bàn qua API & localStorage
window.updateBookingStatus = async function(id, newStatus) {
  // Tìm đặt bàn trước để lấy thông tin bàn và username khách hàng
  let localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const matchedBooking = localBookings.find(b => b.id === id) || recentBookings.find(b => b.id === id);

  // 1. Cập nhật cục bộ trong mảng recentBookings
  recentBookings = recentBookings.map(b => b.id === id ? { ...b, status: newStatus } : b);

  // 2. Cập nhật trong localStorage
  localBookings = localBookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
  localStorage.setItem('bookings', JSON.stringify(localBookings));

  // Thêm thông báo duyệt/từ chối bàn cho khách hàng
  if (matchedBooking && matchedBooking.username) {
    const title = newStatus === 'CONFIRMED' ? 'Đơn đặt bàn đã được duyệt! 🎉' : 'Yêu cầu đặt bàn bị từ chối 🚫';
    const body = newStatus === 'CONFIRMED'
      ? `Đơn đặt bàn ${matchedBooking.table} mã ${id} của bạn đã được duyệt thành công. Chào mừng bạn ghé quán!`
      : `Đơn đặt bàn ${matchedBooking.table} mã ${id} của bạn đã bị từ chối do trùng lịch vận hành.`;
    if (window.addNotification) {
      window.addNotification(matchedBooking.username, title, body, newStatus);
    }
  }

  // 3. Gọi API lên Backend (nếu id là dạng số - tức là được tạo từ backend)
  if (!isNaN(id)) {
    try {
      await fetch(`${API_BASE_URL}/reservations/${id}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: getHeaders()
      });
      console.log(`Đã cập nhật trạng thái đặt bàn #${id} lên server: ${newStatus}`);
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái đặt bàn lên server:", e);
    }
  }

  // Nếu bị hủy, trả bàn về trạng thái trống (EMPTY) locally
  if (newStatus === 'CANCELLED' && matchedBooking) {
    tablesList = tablesList.map(t => {
      if (t.name === matchedBooking.table || `Bàn ${t.id}` === matchedBooking.table || matchedBooking.table.startsWith(t.name)) {
        return { ...t, status: 'EMPTY' };
      }
      return t;
    });
  }

  // Load lại danh sách bàn thực tế từ backend (nếu có)
  await loadTables();

  renderBookingsTable();
  updateStatusChart();
};


// --- TABLE ACTIONS (MODAL) ---

window.openTableModal = function() {
  document.getElementById('table-form-id').value = '';
  document.getElementById('table-name').value = '';
  document.getElementById('table-capacity').value = '4';
  document.getElementById('table-type').value = 'Gia đình';
  document.getElementById('table-status').value = 'EMPTY';
  document.getElementById('table-modal-title').textContent = 'Thêm Bàn Mới';
  document.getElementById('table-modal').classList.remove('hidden');
};

window.closeTableModal = function() {
  document.getElementById('table-modal').classList.add('hidden');
};

window.editTable = function(id) {
  const tableObj = tablesList.find(t => t.id === id);
  if (!tableObj) return;

  document.getElementById('table-form-id').value = tableObj.id;
  document.getElementById('table-name').value = tableObj.name;
  document.getElementById('table-capacity').value = tableObj.capacity;
  document.getElementById('table-type').value = tableObj.type;
  document.getElementById('table-status').value = tableObj.status;
  document.getElementById('table-modal-title').textContent = 'Sửa Thông Tin Bàn';
  document.getElementById('table-modal').classList.remove('hidden');
};

window.deleteTable = async function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
    await deleteTableApi(id);
    renderTables();
    updateDashboardStats();
  }
};

// Form submit Bàn
document.getElementById('table-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const idVal = document.getElementById('table-form-id').value;
  const nameVal = document.getElementById('table-name').value.trim();
  const capacityVal = parseInt(document.getElementById('table-capacity').value);
  const typeVal = document.getElementById('table-type').value;
  const statusVal = document.getElementById('table-status').value;

  const tableObj = {
    id: idVal ? parseInt(idVal) : null,
    name: nameVal,
    capacity: capacityVal,
    type: typeVal,
    status: statusVal
  };

  await saveTableApi(tableObj);
  closeTableModal();
  renderTables();
  updateDashboardStats();
});


// --- MENU ACTIONS (MODAL) ---

window.openMenuModal = function() {
  document.getElementById('menu-form-id').value = '';
  document.getElementById('menu-name').value = '';
  document.getElementById('menu-category').value = '';
  document.getElementById('menu-price').value = '';
  document.getElementById('menu-description').value = '';
  document.getElementById('menu-available').checked = true;
  document.getElementById('menu-modal-title').textContent = 'Thêm Món Mới';
  document.getElementById('menu-modal').classList.remove('hidden');
};

window.closeMenuModal = function() {
  document.getElementById('menu-modal').classList.add('hidden');
};

window.editMenuItem = function(id) {
  const item = menuList.find(m => m.id === id);
  if (!item) return;

  document.getElementById('menu-form-id').value = item.id;
  document.getElementById('menu-name').value = item.name;
  document.getElementById('menu-category').value = item.category;
  document.getElementById('menu-price').value = item.price;
  document.getElementById('menu-description').value = item.description || '';
  document.getElementById('menu-available').checked = item.available;
  document.getElementById('menu-modal-title').textContent = 'Sửa Món Ăn / Đồ Uống';
  document.getElementById('menu-modal').classList.remove('hidden');
};

window.deleteMenuItem = async function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa món nước này?')) {
    await deleteMenuApi(id);
    renderMenu();
  }
};

// Form submit Thực đơn
document.getElementById('menu-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const idVal = document.getElementById('menu-form-id').value;
  const nameVal = document.getElementById('menu-name').value.trim();
  const categoryVal = document.getElementById('menu-category').value.trim();
  const priceVal = parseInt(document.getElementById('menu-price').value);
  const descVal = document.getElementById('menu-description').value.trim();
  const availVal = document.getElementById('menu-available').checked;

  const isEdit = !!idVal;
  let oldPrice = 0;
  if (isEdit) {
    const existing = menuList.find(m => m.id === parseInt(idVal));
    if (existing) {
      oldPrice = existing.price;
    }
  }

  const menuObj = {
    id: idVal ? parseInt(idVal) : null,
    name: nameVal,
    category: categoryVal,
    price: priceVal,
    description: descVal,
    isAvailable: availVal,
    available: availVal
  };

  await saveMenuApi(menuObj);
  closeMenuModal();
  renderMenu();

  // Phát thông báo
  if (window.addNotificationToAll) {
    if (!isEdit) {
      // Món mới
      window.addNotificationToAll(
        'Món mới cực HOT vừa cập bến! ☕',
        `Món mới "${nameVal}" thuộc phân loại "${categoryVal}" vừa được ra mắt với giá chỉ ${priceVal.toLocaleString('vi-VN')}đ. Thử ngay!`,
        'NEW_ITEM'
      );
    } else if (priceVal < oldPrice) {
      // Giảm giá (sale)
      window.addNotificationToAll(
        'Ưu đãi giảm giá đặc biệt! 🔥',
        `Món nước "${nameVal}" vừa được giảm giá cực sốc từ ${oldPrice.toLocaleString('vi-VN')}đ xuống còn ${priceVal.toLocaleString('vi-VN')}đ! Đặt bàn và ghé quán thưởng thức ngay thôi!`,
        'PROMOTION'
      );
    }
  }
});


// --- USER ACTIONS (MODAL & API) ---

// State for users
let usersList = [];
let userSearchTimeout = null;

// Load users from API
async function loadUsers() {
  const search = document.getElementById('user-search') ? document.getElementById('user-search').value.trim() : '';
  const role = document.getElementById('user-filter-role') ? document.getElementById('user-filter-role').value : '';
  const statusSelect = document.getElementById('user-filter-status') ? document.getElementById('user-filter-status').value : '';
  
  let url = `${API_BASE_URL}/users?`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (role) url += `role=${encodeURIComponent(role)}&`;
  if (statusSelect === 'locked') url += `locked=true&`;
  if (statusSelect === 'active') url += `locked=false&`;

  try {
    const res = await fetch(url, {
      headers: getHeaders()
    });
    if (res.ok) {
      usersList = await res.json();
    }
  } catch (e) {
    console.error("Lỗi khi tải danh sách người dùng:", e);
  }
  renderUsers();
}

// Render users in table
function renderUsers() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;

  tbody.innerHTML = usersList.map(u => {
    let roleText = 'Khách Hàng';
    if (u.role === 'ROLE_ADMIN') roleText = 'Quản Trị Viên';
    else if (u.role === 'ROLE_STAFF') roleText = 'Nhân Viên';
    
    const isLocked = u.locked;
    const statusText = isLocked ? 'Bị khóa' : 'Hoạt động';
    const statusClass = isLocked ? 'bg-rose-50 text-rose-700 ring-rose-600/10' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/10';

    const createdAtStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'N/A';

    return `
      <tr class="hover:bg-stone-50/50 transition-colors">
        <td class="px-6 py-4 font-bold text-stone-900">${u.id}</td>
        <td class="px-6 py-4 font-semibold text-stone-850">${u.fullName || ''}</td>
        <td class="px-6 py-4 text-stone-700">${u.username || ''}</td>
        <td class="px-6 py-4 text-stone-700">${u.email || ''}</td>
        <td class="px-6 py-4 text-stone-600">${u.phone || ''}</td>
        <td class="px-6 py-4 text-stone-600 font-medium">${roleText}</td>
        <td class="px-6 py-4"><span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusClass}">${statusText}</span></td>
        <td class="px-6 py-4 text-stone-600 text-xs">${createdAtStr}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex justify-end gap-2">
            <button onclick="toggleLockUser(${u.id}, ${!isLocked})" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all" title="${isLocked ? 'Mở khóa' : 'Khóa'}">
              ${isLocked 
                ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`
              }
            </button>
            <button onclick="editUser(${u.id})" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all" title="Sửa">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onclick="deleteUser(${u.id})" class="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all" title="Xóa">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// User Debounce Search
window.debounceUserSearch = function() {
  clearTimeout(userSearchTimeout);
  userSearchTimeout = setTimeout(() => {
    loadUsers();
  }, 300);
};

// Open user modal
window.openUserModal = function() {
  document.getElementById('user-form-id').value = '';
  document.getElementById('user-fullname').value = '';
  document.getElementById('user-username').value = '';
  document.getElementById('user-username').disabled = false;
  document.getElementById('user-email').value = '';
  document.getElementById('user-password').value = '';
  document.getElementById('user-password-container').classList.remove('hidden');
  document.getElementById('user-password').required = true;
  document.getElementById('user-phone').value = '';
  document.getElementById('user-role').value = 'ROLE_CUSTOMER';
  document.getElementById('user-status-container').classList.add('hidden');
  document.getElementById('user-modal-title').textContent = 'Thêm Tài Khoản Mới';
  document.getElementById('user-modal').classList.remove('hidden');
};

window.closeUserModal = function() {
  document.getElementById('user-modal').classList.add('hidden');
};

// Edit user modal
window.editUser = function(id) {
  const u = usersList.find(item => item.id === id);
  if (!u) return;

  document.getElementById('user-form-id').value = u.id;
  document.getElementById('user-fullname').value = u.fullName || '';
  document.getElementById('user-username').value = u.username || '';
  document.getElementById('user-username').disabled = true; // Không được sửa username
  document.getElementById('user-email').value = u.email || '';
  document.getElementById('user-password').value = '';
  document.getElementById('user-password-container').classList.add('hidden'); // Sửa không cần nhập lại pass
  document.getElementById('user-password').required = false;
  document.getElementById('user-phone').value = u.phone || '';
  document.getElementById('user-role').value = u.role || 'ROLE_CUSTOMER';
  
  document.getElementById('user-status-container').classList.remove('hidden');
  document.getElementById('user-status').value = u.locked ? 'locked' : 'active';
  
  document.getElementById('user-modal-title').textContent = 'Sửa Thông Tin Tài Khoản';
  document.getElementById('user-modal').classList.remove('hidden');
};

// Toggle Lock User
window.toggleLockUser = async function(id, lock) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}/lock?lock=${lock}`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (res.ok) {
      alert(lock ? 'Đã khóa tài khoản thành công!' : 'Đã mở khóa tài khoản thành công!');
      loadUsers();
    } else {
      const err = await res.json();
      alert(err.message || 'Lỗi khi cập nhật trạng thái khóa');
    }
  } catch (e) {
    alert('Không thể kết nối đến máy chủ');
  }
};

// Soft Delete User
window.deleteUser = async function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa (xóa mềm) tài khoản này?')) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        alert('Đã xóa mềm tài khoản thành công!');
        loadUsers();
      } else {
        const err = await res.json();
        alert(err.message || 'Lỗi khi xóa tài khoản');
      }
    } catch (e) {
      alert('Không thể kết nối đến máy chủ');
    }
  }
};

// Submit form
document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const idVal = document.getElementById('user-form-id').value;
  const fullName = document.getElementById('user-fullname').value.trim();
  const username = document.getElementById('user-username').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const password = document.getElementById('user-password').value;
  const phone = document.getElementById('user-phone').value.trim();
  const role = document.getElementById('user-role').value;
  
  const userObj = {
    fullName,
    email,
    phone,
    role
  };

  if (!idVal) {
    userObj.username = username;
    userObj.password = password;
    userObj.locked = false;
    userObj.deleted = false;
  } else {
    userObj.locked = document.getElementById('user-status').value === 'locked';
    userObj.deleted = false;
  }

  const method = idVal ? 'PUT' : 'POST';
  const url = idVal ? `${API_BASE_URL}/users/${idVal}` : `${API_BASE_URL}/users`;

  try {
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(userObj)
    });

    if (res.ok) {
      closeUserModal();
      loadUsers();
    } else {
      const err = await res.json();
      alert(err.message || 'Có lỗi xảy ra, vui lòng kiểm tra lại');
    }
  } catch (err) {
    alert('Không thể lưu thông tin, vui lòng kiểm tra kết nối');
  }
});


// Khởi chạy khi load trang
document.addEventListener('DOMContentLoaded', () => {
  // Cập nhật thông tin profile của user đăng nhập vào sidebar và header
  const sidebarAvatar = document.getElementById('admin-sidebar-avatar');
  const sidebarName = document.getElementById('admin-sidebar-name');
  const sidebarEmail = document.getElementById('admin-sidebar-email');
  const sidebarTitle = document.getElementById('admin-sidebar-title');
  const mobileTitle = document.getElementById('admin-mobile-title');
  
  if (user) {
    if (sidebarAvatar) {
      sidebarAvatar.textContent = user.username.substring(0, 2).toUpperCase();
    }
    if (sidebarName) {
      sidebarName.textContent = user.fullName || user.username;
    }
    if (sidebarEmail) {
      sidebarEmail.textContent = user.email || '';
    }
    if (sidebarTitle) {
      sidebarTitle.textContent = user.role === 'ADMIN' ? 'Pam Admin' : 'Pam Staff';
    }
    if (mobileTitle) {
      mobileTitle.textContent = user.role === 'ADMIN' ? 'Pam Admin' : 'Pam Staff';
    }
  }

  // Nếu là STAFF thì ẩn chức năng quản lý tài khoản
  if (user && user.role === 'STAFF') {
    const btnUsers = document.getElementById('tab-btn-users');
    if (btnUsers) btnUsers.classList.add('hidden');
    
    const mobileSelect = document.getElementById('mobile-tab-select');
    if (mobileSelect) {
      const userOpt = mobileSelect.querySelector('option[value="users"]');
      if (userOpt) userOpt.remove();
    }
  }

  // Ràng buộc trường menu-price chỉ được nhập số
  const menuPriceInput = document.getElementById('menu-price');
  if (menuPriceInput) {
    menuPriceInput.addEventListener('keydown', (e) => {
      // Cho phép Backspace, Delete, Tab, Escape, Enter
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
          // Cho phép Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
          (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
          (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
          (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
          // Cho phép Home, End, Left, Right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      // Chặn nếu không phải là số (0-9 trên bàn phím chính hoặc numpad)
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  }

  // Tab click listeners
  const btnDashboard = document.getElementById('tab-btn-dashboard');
  const btnBookings = document.getElementById('tab-btn-bookings');
  const btnTables = document.getElementById('tab-btn-tables');
  const btnMenu = document.getElementById('tab-btn-menu');
  const btnUsers = document.getElementById('tab-btn-users');
  
  if (btnDashboard) btnDashboard.addEventListener('click', () => switchTab('dashboard'));
  if (btnBookings) btnBookings.addEventListener('click', () => switchTab('bookings'));
  if (btnTables) btnTables.addEventListener('click', () => switchTab('tables'));
  if (btnMenu) btnMenu.addEventListener('click', () => switchTab('menu'));
  if (btnUsers) btnUsers.addEventListener('click', () => switchTab('users'));

  // Mobile select tab switcher
  const mobileSelect = document.getElementById('mobile-tab-select');
  if (mobileSelect) {
    mobileSelect.addEventListener('change', (e) => switchTab(e.target.value));
  }

  // Khởi chạy charts, badges, table/menu/reservations load
  initCharts();
  updateBadges();

  // Khởi tạo localStorage nếu chưa có để các trang khác đồng bộ ngay
  if (!localStorage.getItem('tables')) {
    localStorage.setItem('tables', JSON.stringify(tablesList));
  }
  if (!localStorage.getItem('menu')) {
    localStorage.setItem('menu', JSON.stringify(menuList));
  }
  
  // Mặc định load bàn và lịch đặt để lấy dữ liệu ban đầu
  loadTables();
  loadReservations();
});
