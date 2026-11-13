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

  setView(view: MyBookingsViewInterface): void {
    this.view = view;
  }

  getBookings(): Reservation[] {
    return this.bookings;
  }

  async loadMyBookings(userId?: number): Promise<Reservation[]> {
    try {
      this.view.showLoading(true);
      const data = await ReservationModel.getAllReservations(userId);
      this.bookings = data;
      this.view.renderBookings(this.bookings);
      this.view.showLoading(false);
      return data;
    } catch {
      this.view.showLoading(false);
      this.view.showError('Không thể tải lịch sử đặt bàn.');
      return this.bookings;
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

  filterByStatus(status: ReservationStatus | 'ALL', list?: Reservation[]): Reservation[] {
    const source = list !== undefined ? list : this.bookings;
    if (status === 'ALL') return source;
    return source.filter((b) => b.status === status);
  }
}

export default MyBookingsPresenter;

