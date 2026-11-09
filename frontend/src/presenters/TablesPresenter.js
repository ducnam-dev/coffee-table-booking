import { TableModel } from '../models/TableModel';

export class TablesPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadTables() {
    this.view.showLoading(true);
    try {
      const tables = await TableModel.fetchTables();
      this.view.displayTables(tables);
    } catch (e) {
      this.view.showError('Không thể tải danh sách bàn');
    } finally {
      this.view.showLoading(false);
    }
  }

  filterTables(tables, selectedArea) {
    if (!selectedArea || selectedArea === 'Tất cả') return tables;
    return tables.filter(t => t.type === selectedArea);
  }

  calculateStats(tables) {
    const available = tables.filter(t => t.status === 'AVAILABLE').length;
    const reserved = tables.filter(t => t.status === 'RESERVED').length;
    const occupied = tables.filter(t => t.status === 'OCCUPIED').length;
    return { available, reserved, occupied, total: tables.length };
  }
}

