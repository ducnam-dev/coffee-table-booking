import { Platform } from 'react-native';

// On Android Emulator localhost is 10.0.2.2, on web/iOS it is localhost
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${DEFAULT_HOST}:8080/api`;

export const INITIAL_TABLES = [
  { id: 1, name: 'Bàn 01 (Cửa sổ)', seats: 2, capacity: 2, type: 'Cặp đôi', status: 'AVAILABLE', isNearWindow: true, isOutdoor: false, hasSocket: true },
  { id: 2, name: 'Bàn 02 (Sân vườn)', seats: 4, capacity: 4, type: 'Sân vườn', status: 'RESERVED', isNearWindow: false, isOutdoor: true, hasSocket: false },
  { id: 3, name: 'Bàn 03 (Phòng lạnh)', seats: 6, capacity: 6, type: 'Phòng lạnh', status: 'RESERVED', isNearWindow: false, isOutdoor: false, hasSocket: true },
  { id: 4, name: 'Bàn 04 (Gác lửng)', seats: 2, capacity: 2, type: 'Gác lửng', status: 'AVAILABLE', isNearWindow: true, isOutdoor: false, hasSocket: true },
  { id: 5, name: 'Bàn 05 (Sân vườn VIP)', seats: 8, capacity: 8, type: 'Sân vườn', status: 'AVAILABLE', isNearWindow: false, isOutdoor: true, hasSocket: true },
  { id: 6, name: 'Bàn 06 (Cửa sổ tầng 2)', seats: 4, capacity: 4, type: 'Cặp đôi', status: 'OCCUPIED', isNearWindow: true, isOutdoor: false, hasSocket: true },
];

export const INITIAL_MENU = [
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
  { id: 12, name: 'Trà Dâu', category: 'Trà Trái Cây', price: 15000, description: 'Trà dâu tây tươi mát ngập tràn vị dâu ngọt ngào.', available: true },
];

export const INITIAL_RESERVATIONS = [
  {
    id: 1,
    customerName: 'Lê Hoàng Khách VIP',
    customerPhone: '0901234567',
    customerEmail: 'vip@pamcoffeetea.com',
    coffeeTable: { id: 1, name: 'Bàn 01 (Cửa sổ)' },
    reservationTime: '2026-11-10T19:00:00',
    timeDisplay: '19:00 - Hôm nay',
    guestNumber: 2,
    status: 'PENDING',
    note: 'Cần góc yên tĩnh gần cửa sổ',
    orderItems: [{ menuItem: { id: 1, name: 'Trà Sữa Gạo Rang', price: 18000 }, quantity: 2 }]
  },
  {
    id: 2,
    customerName: 'Nguyễn Trần Huy',
    customerPhone: '0988776655',
    customerEmail: 'huy@gmail.com',
    coffeeTable: { id: 3, name: 'Bàn 03 (Phòng lạnh)' },
    reservationTime: '2026-11-10T20:30:00',
    timeDisplay: '20:30 - Hôm nay',
    guestNumber: 5,
    status: 'CONFIRMED',
    note: 'Họp nhóm có mang laptop',
    orderItems: [{ menuItem: { id: 9, name: 'Sữa Tươi Trân Châu Đường Đen', price: 20000 }, quantity: 4 }]
  },
  {
    id: 3,
    customerName: 'Phạm Minh Đức',
    customerPhone: '0911223344',
    customerEmail: 'duc@gmail.com',
    coffeeTable: { id: 4, name: 'Bàn 04 (Gác lửng)' },
    reservationTime: '2026-11-11T09:00:00',
    timeDisplay: '09:00 - Ngày mai',
    guestNumber: 2,
    status: 'CANCELLED',
    note: 'Hẹn bạn học bài',
    orderItems: []
  },
  {
    id: 4,
    customerName: 'Trần Thanh Hằng',
    customerPhone: '0922334455',
    customerEmail: 'hang@gmail.com',
    coffeeTable: { id: 2, name: 'Bàn 02 (Sân vườn)' },
    reservationTime: '2026-11-10T18:00:00',
    timeDisplay: '18:00 - Hôm nay',
    guestNumber: 4,
    status: 'PENDING',
    note: 'Khu vực thoáng mát',
    orderItems: [{ menuItem: { id: 10, name: 'Trà Đào', price: 15000 }, quantity: 2 }]
  }
];

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') amount = Number(amount) || 0;
  return amount.toLocaleString('vi-VN') + ' đ';
};

