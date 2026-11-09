import { ReservationModel } from '../models/ReservationModel';
import { TableModel } from '../models/TableModel';
import { MenuModel } from '../models/MenuModel';
import { Reservation, CoffeeTable, MenuItem } from '../types';

export interface AdminDashboardData {
  totalReservations: number;
  pendingCount: number;
  confirmedCount: number;
  totalRevenue: number;
  availableTables: number;
  totalTables: number;
  occupancyRate: number;
  recentReservations: Reservation[];
  tables: CoffeeTable[];
  menuItems: MenuItem[];
}

export interface AdminDashboardViewInterface {
  showLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  renderDashboard: (data: AdminDashboardData) => void;
}

export class AdminDashboardPresenter {
  private view: AdminDashboardViewInterface;

  constructor(view: AdminDashboardViewInterface) {
    this.view = view;
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.view.showLoading(true);
      const [reservations, tables, menuItems] = await Promise.all([
        ReservationModel.getAllReservations(),
        TableModel.getAllTables(),
        MenuModel.getAllMenuItems(),
      ]);

      const pendingCount = reservations.filter((r) => r.status === 'PENDING').length;
      const confirmedCount = reservations.filter((r) => r.status === 'CONFIRMED').length;
      const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
      const availableTables = tables.filter((t) => t.status === 'AVAILABLE').length;
      const occupancyRate = tables.length > 0 ? Math.round(((tables.length - availableTables) / tables.length) * 100) : 0;

      this.view.renderDashboard({
        totalReservations: reservations.length,
        pendingCount,
        confirmedCount,
        totalRevenue,
        availableTables,
        totalTables: tables.length,
        occupancyRate,
        recentReservations: reservations.slice(0, 5),
        tables,
        menuItems,
      });
      this.view.showLoading(false);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Không thể tải dữ liệu quản trị.');
    }
  }

  async approveReservation(id: number): Promise<void> {
    await ReservationModel.updateStatus(id, 'CONFIRMED');
    await this.loadDashboardData();
  }

  async rejectReservation(id: number): Promise<void> {
    await ReservationModel.updateStatus(id, 'CANCELLED');
    await this.loadDashboardData();
  }
}

export default AdminDashboardPresenter;

