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
    if (!bookingData.customerName.trim()) {
      this.view.showError('Vui lòng nhập tên người đặt');
      return;
    }
    if (!bookingData.phone.trim()) {
      this.view.showError('Vui lòng nhập số điện thoại liên hệ');
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

