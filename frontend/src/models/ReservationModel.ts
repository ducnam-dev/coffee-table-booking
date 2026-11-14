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

export class ReservationModel {
  static async getAllReservations(userId?: number): Promise<Reservation[]> {
    try {
      const url = userId ? `/reservations?user_id=${userId}` : '/reservations';
      const res = await axiosClient.get(url);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((r: any) => ({
          id: r.id,
          customerName: r.customerName || 'Khách đặt',
          phone: r.customerPhone || r.phone || '0901234567',
          email: r.customerEmail || r.email || '',
          tableId: r.coffeeTable?.id || r.tableId || 1,
          tableNumber: r.tableNumber || r.coffeeTable?.name || `B0${r.coffeeTable?.id || r.tableId || 1}`,
          reservationDate: r.reservationTime ? r.reservationTime.split('T')[0] : r.reservationDate || '2026-11-14',
          reservationTime: r.timeDisplay || (r.reservationTime ? r.reservationTime.split('T')[1]?.slice(0, 5) : '19:00'),
          guestCount: r.guestNumber || r.guestCount || 2,
          orderItems: r.orderItems || [],
          totalAmount: r.totalAmount || 50000,
          depositAmount: r.depositAmount || 0,
          status: r.status || 'PENDING',
          specialRequests: r.note || r.specialRequests || '',
          qrCode: `PAM-RES-${r.id}`,
          createdAt: r.createdAt || 'Vừa xong',
        }));
      }
      return res.data;
    } catch {
      return MOCK_RESERVATIONS;
    }
  }

  static async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    try {
      const res = await axiosClient.post('/reservations', data);
      return res.data;
    } catch {
      const newRes: Reservation = {
        id: Date.now(),
        customerName: data.customerName || 'Khách đặt',
        phone: data.phone || '0900000000',
        email: data.email || '',
        tableId: data.tableId || 1,
        tableNumber: data.tableNumber || 'B01',
        reservationDate: data.reservationDate || new Date().toISOString().split('T')[0],
        reservationTime: data.reservationTime || '10:00',
        guestCount: data.guestCount || 2,
        orderItems: data.orderItems || [],
        totalAmount: data.totalAmount || 50000,
        depositAmount: data.depositAmount || 50000,
        status: 'PENDING',
        specialRequests: data.specialRequests || '',
        qrCode: `PAM-RES-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toLocaleString(),
      };
      MOCK_RESERVATIONS = [newRes, ...MOCK_RESERVATIONS];
      return newRes;
    }
  }

  static async updateStatus(reservationId: number, status: ReservationStatus): Promise<Reservation> {
    try {
      const res = await axiosClient.put(`/reservations/${reservationId}/status`, { status });
      return res.data;
    } catch {
      const found = MOCK_RESERVATIONS.find((r) => r.id === reservationId);
      if (found) found.status = status;
      return found || ({ id: reservationId, status } as Reservation);
    }
  }
}

export default ReservationModel;

