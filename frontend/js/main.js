// main.js - Shared JavaScript for authentication and UI components

// Kiểm tra trạng thái đăng nhập
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}

// Đăng xuất
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = './login.html';
}

// Cập nhật Header động dựa trên trạng thái đăng nhập
function updateHeader() {
  const headerUserContainer = document.getElementById('header-user-container');
  const headerGuestContainer = document.getElementById('header-guest-container');
  const mobileUserContainer = document.getElementById('mobile-user-container');
  const mobileGuestContainer = document.getElementById('mobile-guest-container');
  const isLoggedIn = checkAuth();
  const user = getCurrentUser();

  if (isLoggedIn && user) {
    // Hiển thị giao diện khi đã đăng nhập (Desktop)
    if (headerGuestContainer) headerGuestContainer.classList.add('hidden');
    if (headerUserContainer) {
      headerUserContainer.classList.remove('hidden');
      headerUserContainer.classList.add('flex');
      
      const isStaffOrAdmin = user.role === 'ADMIN' || user.role === 'STAFF';
      const adminBtnHtml = isStaffOrAdmin 
        ? `<a href="./admin.html" class="flex items-center gap-1.5 rounded-lg border border-amber-600/30 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            ${user.role === 'ADMIN' ? 'Trang Quản Trị' : 'Trang Nhân Viên'}
           </a>`
        : '';

      headerUserContainer.innerHTML = `
        ${adminBtnHtml}
        <div class="flex items-center gap-3 border-l border-stone-200 pl-4">
          <!-- Notification Bell -->
          <div class="relative">
            <button id="notification-bell-btn" class="relative p-2 text-stone-500 hover:text-amber-600 hover:bg-stone-50 rounded-xl transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span id="notification-badge" class="absolute -top-0.5 -right-0.5 min-h-[16px] min-w-[16px] rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white hidden px-1 flex items-center justify-center"></span>
            </button>
            
            <!-- Notification Dropdown -->
            <div id="notification-dropdown" class="absolute right-0 mt-3.5 w-80 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl hidden z-50">
              <div class="flex items-center justify-between border-b border-stone-100 pb-2 mb-2.5">
                <h3 class="font-bold text-stone-900 text-sm">Thông báo</h3>
                <button onclick="markAllNotificationsAsRead()" class="text-xs font-bold text-amber-600 hover:text-amber-700">Đánh dấu đã đọc</button>
              </div>
              <div id="notification-list" class="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                <!-- Loaded dynamically -->
              </div>
            </div>
          </div>

          <div class="flex flex-col text-right">
            <span class="text-sm font-semibold text-stone-900">${user.fullName || user.username}</span>
            <span class="text-xs text-stone-500 capitalize">${user.role === 'ADMIN' ? 'Quản trị viên' : (user.role === 'STAFF' ? 'Nhân viên' : 'Khách hàng')}</span>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold uppercase shadow-sm">
            ${user.username.substring(0, 2)}
          </div>
          <button id="logout-btn" title="Đăng xuất" class="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      `;
      
      document.getElementById('logout-btn').addEventListener('click', logout);

      // Xử lý sự kiện click mở Notification Dropdown
      const bellBtn = document.getElementById('notification-bell-btn');
      const dropdown = document.getElementById('notification-dropdown');
      if (bellBtn && dropdown) {
        bellBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('hidden');
          renderNotifications();
        });
        document.addEventListener('click', () => {
          dropdown.classList.add('hidden');
        });
        dropdown.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      // Render danh sách thông báo ban đầu
      renderNotifications();
    }

    // Hiển thị giao diện khi đã đăng nhập (Mobile)
    if (mobileGuestContainer) mobileGuestContainer.classList.add('hidden');
    if (mobileUserContainer) {
      mobileUserContainer.classList.remove('hidden');
      
      const adminBtnMobileHtml = isStaffOrAdmin
        ? `<a href="./admin.html" class="flex items-center justify-center gap-2 rounded-lg bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors w-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            ${user.role === 'ADMIN' ? 'Trang Quản Trị' : 'Trang Nhân Viên'}
           </a>`
        : '';
                
      mobileUserContainer.innerHTML = `
        ${adminBtnMobileHtml}
        <div class="flex items-center justify-between py-2 px-1">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-xs">
              ${user.username.substring(0, 2)}
            </div>
            <span class="text-sm font-semibold text-stone-850">${user.fullName || user.username}</span>
          </div>
          <button id="mobile-logout-btn" class="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>

        <!-- Vùng thông báo trên điện thoại (Mobile Notification List) -->
        <div class="border-t border-stone-150 mt-3 pt-3">
          <div class="flex items-center justify-between mb-2.5 px-1">
            <span class="text-xs font-bold text-stone-500 uppercase tracking-wider">Thông báo mới nhất</span>
            <button onclick="markAllNotificationsAsRead()" class="text-[10px] font-bold text-amber-600">Đọc tất cả</button>
          </div>
          <div id="mobile-notification-list" class="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            <!-- Loaded dynamically -->
          </div>
        </div>
      `;
      document.getElementById('mobile-logout-btn').addEventListener('click', logout);
      renderNotifications();
    }

  } else {
    // Hiển thị giao diện chưa đăng nhập
    if (headerUserContainer) headerUserContainer.classList.add('hidden');
    if (headerGuestContainer) {
      headerGuestContainer.classList.remove('hidden');
      headerGuestContainer.classList.add('flex');
    }
    
    if (mobileUserContainer) mobileUserContainer.classList.add('hidden');
    if (mobileGuestContainer) mobileGuestContainer.classList.remove('hidden');
  }
}

// --- LOGIC HỆ THỐNG THÔNG BÁO (NOTIFICATION SYSTEM) ---

function getNotificationsKey() {
  const user = getCurrentUser();
  return user ? `notifications_${user.username}` : 'notifications_guest';
}

window.getNotifications = function() {
  const key = getNotificationsKey();
  let list = localStorage.getItem(key);
  if (!list) {
    // Seed dữ liệu thông báo mẫu phong phú, đúng các loại yêu cầu của người dùng
    const defaultList = [
      {
        id: 'n1',
        title: 'Đơn đặt bàn đã được duyệt! 🎉',
        body: 'Đơn đặt bàn Bàn 01 (Cửa sổ) mã PAM-91014 của bạn đã được duyệt thành công. Chào đón bạn lúc 08:30!',
        time: '5 phút trước',
        type: 'CONFIRMED',
        read: false
      },
      {
        id: 'n2',
        title: 'Yêu cầu đặt bàn bị từ chối 🚫',
        body: 'Đơn đặt bàn Bàn 03 (Phòng lạnh) mã PAM-52479 đã bị hủy do trùng lịch bảo trì của quán. Rất tiếc vì sự bất tiện này.',
        time: '2 giờ trước',
        type: 'CANCELLED',
        read: false
      },
      {
        id: 'n3',
        title: 'Món mới cực HOT vừa cập bến! ☕',
        body: 'Salted Caramel Macchiato vừa được thêm vào thực đơn. Sự kết hợp hoàn hảo giữa kem sữa mặn béo ngậy và espresso đậm đà!',
        time: '1 ngày trước',
        type: 'NEW_ITEM',
        read: false
      },
      {
        id: 'n4',
        title: 'Siêu sale 20% mừng khai trương 🏷️',
        body: 'Giảm giá cực đậm 20% cho toàn bộ trà, cà phê và bánh ngọt duy nhất từ ngày 05/06 đến 12/06. Mau ghé quán thưởng thức!',
        time: '2 ngày trước',
        type: 'PROMOTION',
        read: true
      }
    ];
    localStorage.setItem(key, JSON.stringify(defaultList));
    return defaultList;
  }
  return JSON.parse(list);
}

function saveNotifications(notifications) {
  const key = getNotificationsKey();
  localStorage.setItem(key, JSON.stringify(notifications));
}

// Thêm thông báo cho 1 user bất kỳ
window.addNotification = function(username, title, body, type) {
  const key = `notifications_${username}`;
  let list = JSON.parse(localStorage.getItem(key) || '[]');
  
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} - Hôm nay`;
  
  const newNotif = {
    id: 'n_' + Date.now() + Math.random().toString(36).substr(2, 5),
    title,
    body,
    time: timeStr,
    type,
    read: false
  };
  
  list.unshift(newNotif);
  localStorage.setItem(key, JSON.stringify(list));
  
  // Nếu là user đang hoạt động hiện tại, render lại lập tức
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.username === username) {
    renderNotifications();
  }
};

// Phát thông báo khuyến mãi, món mới cho mọi tài khoản
window.addNotificationToAll = function(title, body, type) {
  let userKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('notifications_')) {
      userKeys.push(key);
    }
  }
  
  // Đảm bảo user hiện tại luôn được thêm
  const user = getCurrentUser();
  if (user) {
    const currentKey = `notifications_${user.username}`;
    if (!userKeys.includes(currentKey)) {
      userKeys.push(currentKey);
    }
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} - Hôm nay`;

  userKeys.forEach(key => {
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    const newNotif = {
      id: 'n_' + Date.now() + Math.random().toString(36).substr(2, 5),
      title,
      body,
      time: timeStr,
      type,
      read: false
    };
    list.unshift(newNotif);
    localStorage.setItem(key, JSON.stringify(list));
  });

  renderNotifications();
};

window.markAllNotificationsAsRead = function() {
  let list = getNotifications();
  list = list.map(n => ({ ...n, read: true }));
  saveNotifications(list);
  renderNotifications();
};

window.readSingleNotification = function(id) {
  let list = getNotifications();
  list = list.map(n => n.id === id ? { ...n, read: true } : n);
  saveNotifications(list);
  renderNotifications();
};

window.renderNotifications = function() {
  const badge = document.getElementById('notification-badge');
  const desktopList = document.getElementById('notification-list');
  const mobileList = document.getElementById('mobile-notification-list');
  
  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Render Badge
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  const generateNotifHtml = (n) => {
    let iconHtml = '';
    if (n.type === 'CONFIRMED' || n.type === 'APPROVED') {
      iconHtml = `<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>`;
    } else if (n.type === 'CANCELLED' || n.type === 'REJECTED') {
      iconHtml = `<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </div>`;
    } else if (n.type === 'NEW_ITEM') {
      iconHtml = `<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
      </div>`;
    } else {
      iconHtml = `<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      </div>`;
    }

    const unreadIndicator = !n.read ? `<span class="h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0 mt-1"></span>` : '';

    return `
      <div onclick="readSingleNotification('${n.id}')" class="flex gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer ${!n.read ? 'bg-amber-50/10' : ''}">
        ${iconHtml}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-1.5">
            <h4 class="text-xs font-bold text-stone-900 leading-tight">${n.title}</h4>
            ${unreadIndicator}
          </div>
          <p class="text-[10px] text-stone-600 mt-0.5 leading-normal break-words">${n.body}</p>
          <span class="text-[9px] text-stone-400 mt-1 block">${n.time}</span>
        </div>
      </div>
    `;
  };

  const html = notifications.length === 0 
    ? `<div class="text-center py-8 text-stone-400 text-xs">Không có thông báo nào.</div>`
    : notifications.map(generateNotifHtml).join('');

  if (desktopList) desktopList.innerHTML = html;
  if (mobileList) mobileList.innerHTML = html;
};

// Xử lý đóng mở Menu trên thiết bị di động
document.addEventListener('DOMContentLoaded', () => {
  // Cập nhật header trước
  updateHeader();

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenuDropdown) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenuDropdown.classList.contains('hidden');
      if (isOpen) {
        mobileMenuDropdown.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      } else {
        mobileMenuDropdown.classList.remove('hidden');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
      }
    });
  }
});

// Hàm hiển thị Modal Danh Sách Bàn Đã Đặt
window.showBookingsModal = async function(e) {
  if (e) e.preventDefault();
  
  if (!checkAuth()) {
    window.location.href = './login.html?from=' + encodeURIComponent(window.location.pathname);
    return;
  }

  const user = getCurrentUser();
  if (!user) return;

  // Tạo modal nếu chưa tồn tại
  let modal = document.getElementById('global-bookings-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-bookings-modal';
    modal.className = 'fixed inset-0 z-50 overflow-hidden hidden';
    modal.innerHTML = `
      <!-- Backdrop overlay -->
      <div class="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300" onclick="closeBookingsModal()"></div>
      
      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="w-screen max-w-md transform transition-all duration-300 translate-x-full" id="global-bookings-panel">
          <div class="h-full flex flex-col bg-white shadow-2xl rounded-l-3xl border-l border-stone-200">
            <!-- Header -->
            <div class="px-6 py-5 bg-stone-900 text-white flex items-center justify-between rounded-tl-3xl">
              <div>
                <h2 class="text-lg font-bold">Lịch Sử Đặt Bàn</h2>
                <p class="text-xs text-stone-400 mt-0.5">Danh sách bàn đã đặt của ${user.fullName || user.username}</p>
              </div>
              <button onclick="closeBookingsModal()" class="rounded-lg p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4" id="global-bookings-content">
              <div class="animate-pulse flex flex-col items-center justify-center py-12 text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-stone-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                </svg>
                <span>Đang tải danh sách đặt bàn...</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-stone-150 px-6 py-4 bg-stone-50 flex items-center justify-between rounded-bl-3xl">
              <button onclick="refreshGlobalBookings()" class="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                </svg>
                Làm mới
              </button>
              <button onclick="closeBookingsModal()" class="rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 transition-colors active:scale-95">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Mở modal với hiệu ứng mượt
  modal.classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('global-bookings-panel').classList.remove('translate-x-full');
  }, 10);

  // Tải danh sách đặt bàn
  refreshGlobalBookings();
};

// Hàm đóng Modal
window.closeBookingsModal = function() {
  const panel = document.getElementById('global-bookings-panel');
  const modal = document.getElementById('global-bookings-modal');
  if (panel && modal) {
    panel.classList.add('translate-x-full');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
};

// Hàm tải danh sách đặt bàn trong Modal
window.refreshGlobalBookings = async function() {
  const user = getCurrentUser();
  if (!user) return;

  const contentContainer = document.getElementById('global-bookings-content');
  if (!contentContainer) return;

  contentContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 text-stone-400">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
      <span class="text-xs mt-3">Đang đồng bộ dữ liệu...</span>
    </div>
  `;

  let bookings = [];

  // 1. Tải từ API Backend
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
          bookings = data.map(r => {
            const tableObj = r.coffeeTable || {};
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
              status: r.status,
              totalAmount: totalAmount
            };
          });
        }
      }
    } catch (e) {
      console.warn("Backend offline.");
    }
  }

  // 2. Tải từ localStorage
  const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  localBookings.forEach(lb => {
    const isOwner = lb.username === user.username || lb.userId === user.id || (!lb.username && user.role === 'CUSTOMER');
    if (isOwner) {
      if (!bookings.some(cb => cb.id === lb.id)) {
        bookings.push(lb);
      }
    }
  });

  if (bookings.length === 0) {
    contentContainer.innerHTML = `
      <div class="text-center py-16 text-stone-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-sm font-semibold">Chưa có đặt bàn nào.</span>
        <p class="text-xs text-stone-400 mt-1">Các bàn bạn đặt sẽ được hiển thị tại đây.</p>
      </div>
    `;
    return;
  }

  bookings.sort((a, b) => b.id.localeCompare(a.id));

  contentContainer.innerHTML = bookings.map(b => {
    let statusClass = '';
    let statusText = '';
    if (b.status === 'CONFIRMED') {
      statusClass = 'bg-emerald-50 text-emerald-700 ring-emerald-600/10';
      statusText = 'Đã duyệt';
    } else if (b.status === 'PENDING') {
      statusClass = 'bg-amber-50 text-amber-700 ring-amber-600/10';
      statusText = 'Chờ duyệt';
    } else {
      statusClass = 'bg-rose-50 text-rose-700 ring-rose-600/10';
      statusText = 'Đã hủy';
    }

    const cancelBtn = b.status === 'PENDING'
      ? `<button onclick="cancelBookingFromModal('${b.id}')" class="text-xs text-rose-600 hover:text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded transition-colors active:scale-95">Hủy</button>`
      : '';

    return `
      <div class="rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:border-stone-300 transition-colors flex flex-col justify-between gap-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-stone-400">Mã: ${b.id}</span>
          <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusClass}">
            ${statusText}
          </span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-stone-900">${b.table}</h4>
          <p class="text-xs text-stone-500 mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${b.time}
          </p>
          <p class="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Khách: ${b.guests} người
          </p>
        </div>
        <div class="flex items-center justify-between border-t border-stone-100 pt-2 mt-1">
          <span class="text-xs text-stone-400 font-medium">${b.totalAmount > 0 ? `Pre-order: ${b.totalAmount.toLocaleString('vi-VN')}đ` : ''}</span>
          ${cancelBtn}
        </div>
      </div>
    `;
  }).join('');
};

// Hàm hủy đặt bàn từ Modal
window.cancelBookingFromModal = async function(id) {
  if (!confirm('Bạn có chắc chắn muốn hủy yêu cầu đặt bàn này không?')) return;

  let localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  localBookings = localBookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b);
  localStorage.setItem('bookings', JSON.stringify(localBookings));

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
    } catch (e) {
      console.error(e);
    }
  }

  // Tải lại danh sách trong modal
  refreshGlobalBookings();
  
  // Tải lại danh sách ở trang booking (nếu đang ở trang booking)
  if (window.loadCustomerBookings) {
    window.loadCustomerBookings();
  }
  
  // Tải lại sơ đồ bàn trang chủ (nếu đang ở trang chủ)
  if (window.loadTablesAndStatus) {
    window.loadTablesAndStatus();
  }
};

// Đồng bộ danh sách đặt bàn của khách hàng từ backend về localStorage để giữ trạng thái đồng nhất
window.syncLocalBookings = async function() {
  const user = getCurrentUser();
  if (!user || user.role !== 'CUSTOMER') return;

  const API_BASE_URL = 'http://localhost:8080/api';
  const token = localStorage.getItem('token');
  if (!token || !user.id) return;

  try {
    const res = await fetch(`${API_BASE_URL}/reservations/user/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const backendReservations = await res.json();
      if (backendReservations) {
        let localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        let updated = false;

        backendReservations.forEach(r => {
          const rId = r.id.toString();
          const localIndex = localBookings.findIndex(b => b.id === rId);

          const tableObj = r.coffeeTable || {};
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

          let totalAmount = 0;
          if (r.note && r.note.includes('Tổng tiền:')) {
            const match = r.note.match(/Tổng tiền:\s*(\d+)đ/);
            if (match) {
              totalAmount = parseInt(match[1]);
            }
          }

          const matchedLocal = localIndex >= 0 ? localBookings[localIndex] : null;

          // Tạo/cập nhật thông báo nếu trạng thái thay đổi
          if (matchedLocal && matchedLocal.status !== r.status) {
            // Trạng thái thay đổi! Phát thông báo cho user
            const title = r.status === 'CONFIRMED' ? 'Đơn đặt bàn đã được duyệt! 🎉' : 'Yêu cầu đặt bàn bị từ chối 🚫';
            const body = r.status === 'CONFIRMED'
              ? `Đơn đặt bàn ${matchedLocal.table} mã ${rId} của bạn đã được duyệt thành công. Chào mừng bạn ghé quán!`
              : `Đơn đặt bàn ${matchedLocal.table} mã ${rId} của bạn đã bị từ chối do trùng lịch vận hành.`;
            if (window.addNotification) {
              window.addNotification(user.username, title, body, r.status);
            }
          }

          if (localIndex >= 0) {
            if (localBookings[localIndex].status !== r.status) {
              localBookings[localIndex].status = r.status;
              updated = true;
            }
          } else {
            // Thêm mới vào localBookings nếu chưa có
            localBookings.push({
              id: rId,
              userId: user.id,
              username: user.username,
              table: tableObj.name || `Bàn ${tableObj.id || ''}`,
              time: timeFormatted,
              guests: r.guestCount || 2,
              status: r.status,
              totalAmount: totalAmount
            });
            updated = true;
          }
        });

        if (updated) {
          localStorage.setItem('bookings', JSON.stringify(localBookings));
        }
      }
    }
  } catch (e) {
    console.warn("Backend offline, không thể đồng bộ đặt bàn.");
  }
};

