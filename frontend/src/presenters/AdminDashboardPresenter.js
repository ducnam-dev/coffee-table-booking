import { ReservationModel } from '../models/ReservationModel';
import { TableModel } from '../models/TableModel';

export class AdminDashboardPresenter {
  constructor(view) {
    this.view = view;
  }

  calculateMetrics(reservations, tables) {
    const pending = reservations.filter(r => r.status === 'PENDING');
    const confirmed = reservations.filter(r => r.status === 'CONFIRMED');
    const available = tables.filter(t => t.status === 'AVAILABLE');
    const occupied = tables.filter(t => t.status === 'OCCUPIED');

    const totalRevenue = confirmed.reduce((sum, r) => {
      const itemsTotal = (r.orderItems || []).reduce(
        (s, oi) => s + ((oi.menuItem?.price || 20000) * (oi.quantity || 1)),
        0
      );
      return sum + (itemsTotal || 50000);
    }, 0);

    return {
      totalRevenue,
      pendingCount: pending.length,
      confirmedCount: confirmed.length,
      availableCount: available.length,
      occupiedCount: occupied.length,
      totalTables: tables.length,
      pendingList: pending
    };
  }

  async approveBooking(resId, tableId, token) {
    this.view.showLoading(true);
    try {
      await ReservationModel.updateStatus(resId, 'CONFIRMED', token);
      if (tableId) {
        await TableModel.updateStatus(tableId, 'OCCUPIED', token);
      }
      this.view.onActionSuccess('Đã duyệt và xếp bàn thành công');
    } catch (e) {
      this.view.showError('Lỗi khi duyệt đặt bàn');
    } finally {
      this.view.showLoading(false);
    }
  }

  async rejectBooking(resId, tableId, token) {
    this.view.showLoading(true);
    try {
      await ReservationModel.updateStatus(resId, 'CANCELLED', token);
      if (tableId) {
        await TableModel.updateStatus(tableId, 'AVAILABLE', token);
      }
      this.view.onActionSuccess('Đã từ chối lượt đặt bàn');
    } catch (e) {
      this.view.showError('Lỗi khi hủy đặt bàn');
    } finally {
      this.view.showLoading(false);
    }
  }
}

