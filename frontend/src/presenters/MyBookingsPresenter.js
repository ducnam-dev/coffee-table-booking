import { ReservationModel } from '../models/ReservationModel';
import { TableModel } from '../models/TableModel';

export class MyBookingsPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadReservations(userId, token) {
    this.view.showLoading(true);
    try {
      const data = await ReservationModel.fetchUserReservations(userId, token);
      this.view.displayReservations(data);
    } catch (e) {
      this.view.showError('Không thể tải lịch sử đặt bàn');
    } finally {
      this.view.showLoading(false);
    }
  }

  filterReservations(reservations, filterStatus) {
    if (!filterStatus || filterStatus === 'Tất cả') return reservations;
    return reservations.filter(r => r.status === filterStatus);
  }

  async cancelBooking(bookingId, tableId, token) {
    this.view.showLoading(true);
    try {
      await ReservationModel.updateStatus(bookingId, 'CANCELLED', token);
      if (tableId) {
        await TableModel.updateStatus(tableId, 'AVAILABLE', token);
      }
      this.view.onCancelSuccess(bookingId);
    } catch (e) {
      this.view.showError('Không thể hủy lượt đặt bàn này');
    } finally {
      this.view.showLoading(false);
    }
  }
}

