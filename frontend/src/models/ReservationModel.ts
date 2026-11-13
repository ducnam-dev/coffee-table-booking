import { axiosClient } from '../config/axiosClient';
import { Reservation, ReservationStatus } from '../types';

let MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 101,
    customerName: 'Nguyễn Văn Khách',
    phone: '0987654321',
    tableId: 1,
    tableNumber: 'B01',
    reservationDate: '2026-11-10',
    reservationTime: '09:00',
    guestCount: 2,
    orderItems: [{ menuItemId: 1, name: 'Cà Phê Muối Pam Signature', price: 45000, quantity: 2 }],
    totalAmount: 90000,
    depositAmount: 50000,
    status: 'CONFIRMED',
    specialRequests: 'Bàn cạnh cửa sổ thoáng đãng',
    qrCode: 'PAM-RES-101-CONFIRMED',
    createdAt: '2026-11-09 10:00',
  },
  {
    id: 102,
    customerName: 'Trần Thị Mai',
    phone: '0912345678',
    tableId: 3,
    tableNumber: 'B03',
    reservationDate: '2026-11-10',
    reservationTime: '15:30',
    guestCount: 4,
    orderItems: [{ menuItemId: 4, name: 'Trà Sen Vàng Hạt Dẻ', price: 49000, quantity: 4 }],
    totalAmount: 196000,
    depositAmount: 100000,
    status: 'PENDING',
    specialRequests: 'Có trẻ nhỏ đi cùng',
    qrCode: 'PAM-RES-102-PENDING',
    createdAt: '2026-11-09 11:30',
  },
];

export function normalizeReservation(raw: any, fallback?: Partial<Reservation>): Reservation {
  const tableId = raw.tableId || raw.coffeeTable?.id || fallback?.tableId || 1;
  let tableNumber = raw.tableNumber || raw.coffeeTable?.name || fallback?.tableNumber;
  if (!tableNumber) {
    tableNumber = `B0${tableId}`;
  }

  return {
    id: raw.id || Date.now(),
    customerName: raw.customerName || fallback?.customerName || 'Khách đặt',
    phone: raw.phone || raw.customerPhone || fallback?.phone || '',
    email: raw.email || raw.customerEmail || fallback?.email || '',
    tableId,
    tableNumber,
    reservationDate: raw.reservationDate || fallback?.reservationDate || new Date().toISOString().split('T')[0],
    reservationTime: raw.reservationTime || fallback?.reservationTime || '09:00',
    guestCount: raw.guestCount || raw.guestNumber || fallback?.guestCount || 2,
    orderItems: raw.orderItems || fallback?.orderItems || [],
    totalAmount: raw.totalAmount || fallback?.totalAmount || 0,
    depositAmount: raw.depositAmount || fallback?.depositAmount || 50000,
    status: raw.status || 'PENDING',
    specialRequests: raw.specialRequests || raw.note || fallback?.specialRequests || '',
    qrCode: raw.qrCode || `PAM-RES-${(raw.id || Date.now()).toString().slice(-4)}`,
    createdAt: raw.createdAt || new Date().toLocaleString(),
  };
}

export class ReservationModel {
  static async getAllReservations(): Promise<Reservation[]> {
    try {
      const res = await axiosClient.get('/reservations');
      if (Array.isArray(res.data)) {
        return res.data.map((r: any) => normalizeReservation(r));
      }
      return MOCK_RESERVATIONS;
    } catch {
      return MOCK_RESERVATIONS;
    }
  }

  static async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    try {
      const res = await axiosClient.post('/reservations', data);
      const normalized = normalizeReservation(res.data, data);
      MOCK_RESERVATIONS = [normalized, ...MOCK_RESERVATIONS];
      return normalized;
    } catch {
      const newRes = normalizeReservation(data, data);
      MOCK_RESERVATIONS = [newRes, ...MOCK_RESERVATIONS];
      return newRes;
    }
  }

  static async updateStatus(reservationId: number, status: ReservationStatus): Promise<Reservation> {
    try {
      const res = await axiosClient.put(`/reservations/${reservationId}/status`, { status });
      return normalizeReservation(res.data);
    } catch {
      const found = MOCK_RESERVATIONS.find((r) => r.id === reservationId);
      if (found) found.status = status;
      return found || ({ id: reservationId, status } as Reservation);
    }
  }
}

export default ReservationModel;

