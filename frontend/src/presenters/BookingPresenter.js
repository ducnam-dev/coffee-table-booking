import { ReservationModel } from '../models/ReservationModel';
import { TableModel } from '../models/TableModel';

export class BookingPresenter {
  constructor(view) {
    this.view = view;
  }

  calculatePreOrderTotal(preOrder, menuList) {
    return Object.entries(preOrder).reduce((sum, [id, qty]) => {
      const item = menuList.find(m => m.id === Number(id));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }

  async submitBooking({
    customerName,
    customerPhone,
    customerEmail,
    selectedTable,
    selectedDate,
    selectedTime,
    guestCount,
    note,
    preOrder,
    menuList,
    token
  }) {
    if (!selectedTable) {
      this.view.showError('Vui lòng chọn 1 bàn còn trống trên sơ đồ');
      return;
    }
    if (!customerName || !customerName.trim() || !customerPhone || !customerPhone.trim()) {
      this.view.showError('Vui lòng nhập họ tên và số điện thoại liên hệ');
      return;
    }

    this.view.showLoading(true);
    this.view.clearError();

    try {
      const orderItems = Object.entries(preOrder).map(([menuId, qty]) => {
        const item = menuList.find(m => m.id === Number(menuId));
        return { menuItem: item, quantity: qty };
      });

      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail || 'customer@gmail.com',
        coffeeTable: { id: selectedTable.id, name: selectedTable.name },
        reservationTime: new Date().toISOString(),
        timeDisplay: `${selectedTime} - ${selectedDate}`,
        guestNumber: Number(guestCount) || 2,
        note: (note || '').trim(),
        orderItems
      };

      const result = await ReservationModel.createReservation(payload, token);
      await TableModel.updateStatus(selectedTable.id, 'RESERVED', token);

      this.view.onBookingSuccess(result);
    } catch (e) {
      this.view.showError('Đặt bàn thất bại, vui lòng kiểm tra lại kết nối');
    } finally {
      this.view.showLoading(false);
    }
  }
}

