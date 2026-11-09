import { ReservationModel } from '../models/ReservationModel';
import { Reservation, ReservationStatus } from '../types';

export interface MyBookingsViewInterface {
  showLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  renderBookings: (reservations: Reservation[]) => void;
}

export class MyBookingsPresenter {
  private view: MyBookingsViewInterface;
  private bookings: Reservation[] = [];

  constructor(view: MyBookingsViewInterface) {
    this.view = view;
  }

  async loadMyBookings(): Promise<void> {
    try {
      this.view.showLoading(true);
      this.bookings = await ReservationModel.getAllReservations();
      this.view.renderBookings(this.bookings);
      this.view.showLoading(false);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Không thể tải lịch sử đặt bàn.');
    }
  }

  async cancelBooking(reservationId: number): Promise<void> {
    try {
      this.view.showLoading(true);
      await ReservationModel.updateStatus(reservationId, 'CANCELLED');
      const item = this.bookings.find((b) => b.id === reservationId);
      if (item) item.status = 'CANCELLED';
      this.view.renderBookings([...this.bookings]);
      this.view.showLoading(false);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Hủy đặt bàn thất bại.');
    }
  }

  filterByStatus(status: ReservationStatus | 'ALL'): Reservation[] {
    if (status === 'ALL') return this.bookings;
    return this.bookings.filter((b) => b.status === status);
  }
}

export default MyBookingsPresenter;
