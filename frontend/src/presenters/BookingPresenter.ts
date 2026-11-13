import { ReservationModel } from '../models/ReservationModel';
import { Reservation, OrderItem, CoffeeTable } from '../types';

export interface BookingViewInterface {
  showLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  onBookingSuccess: (reservation: Reservation) => void;
}

export class BookingPresenter {
  private view: BookingViewInterface;

  constructor(view: BookingViewInterface) {
    this.view = view;
  }

  calculateTotal(orderItems: OrderItem[]): number {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  calculateDeposit(totalDrinkAmount: number): number {
    // 50,000 VND base table deposit + 30% drink pre-order
    return 50000 + Math.round(totalDrinkAmount * 0.3);
  }

  async submitReservation(bookingData: {
    customerName: string;
    phone: string;
    email?: string;
    selectedTable: CoffeeTable | null;
    reservationDate: string;
    reservationTime: string;
    guestCount: number;
    orderItems: OrderItem[];
    specialRequests?: string;
  }): Promise<void> {
    const cleanName = bookingData.customerName.trim();
    const cleanPhone = bookingData.phone.replace(/[\s.-]/g, '');
    const vnPhoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;

    if (!cleanName) {
      this.view.showError('Vui lòng nhập họ và tên người nhận bàn');
      return;
    }
    if (!cleanPhone) {
      this.view.showError('Vui lòng nhập số điện thoại liên hệ');
      return;
    }
    if (!vnPhoneRegex.test(cleanPhone)) {
      this.view.showError(
        'Số điện thoại không hợp lệ! Vui lòng nhập đúng số điện thoại di động Việt Nam gồm 10 chữ số (bắt đầu bằng 03, 05, 07, 08 hoặc 09).'
      );
      return;
    }
    const todayStr = (() => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    })();

    const cleanDate = (bookingData.reservationDate || '').trim();
    if (!cleanDate) {
      this.view.showError('Vui lòng chọn ngày đặt bàn');
      return;
    }
    if (cleanDate < todayStr) {
      this.view.showError(`Không thể chọn ngày trong quá khứ! Vui lòng chọn từ ngày hôm nay (${todayStr}) trở đi.`);
      return;
    }

    const cleanTime = (bookingData.reservationTime || '').trim();
    if (!cleanTime) {
      this.view.showError('Vui lòng chọn hoặc tự nhập khung giờ bạn muốn đến');
      return;
    }
    if (!bookingData.selectedTable) {
      this.view.showError('Vui lòng chọn bàn bạn muốn ngồi');
      return;
    }

    const drinkTotal = this.calculateTotal(bookingData.orderItems);
    const deposit = this.calculateDeposit(drinkTotal);

    try {
      this.view.showLoading(true);
      const res = await ReservationModel.createReservation({
        customerName: bookingData.customerName,
        phone: bookingData.phone,
        email: bookingData.email,
        tableId: bookingData.selectedTable.id,
        tableNumber: bookingData.selectedTable.tableNumber,
        reservationDate: bookingData.reservationDate,
        reservationTime: bookingData.reservationTime,
        guestCount: bookingData.guestCount,
        orderItems: bookingData.orderItems,
        totalAmount: drinkTotal,
        depositAmount: deposit,
        specialRequests: bookingData.specialRequests,
      });
      this.view.showLoading(false);
      this.view.onBookingSuccess(res);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Đặt bàn không thành công. Vui lòng thử lại!');
    }
  }
}

export default BookingPresenter;

