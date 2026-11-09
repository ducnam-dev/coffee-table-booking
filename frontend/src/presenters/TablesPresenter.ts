import { TableModel } from '../models/TableModel';
import { CoffeeTable, TableArea } from '../types';

export interface TablesViewInterface {
  showLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  renderTables: (tables: CoffeeTable[]) => void;
}

export class TablesPresenter {
  private view: TablesViewInterface;
  private allTables: CoffeeTable[] = [];

  constructor(view: TablesViewInterface) {
    this.view = view;
  }

  async loadTables(): Promise<void> {
    try {
      this.view.showLoading(true);
      this.allTables = await TableModel.getAllTables();
      this.view.renderTables(this.allTables);
      this.view.showLoading(false);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Không thể tải sơ đồ bàn.');
    }
  }

  filterByArea(area: TableArea | 'ALL'): CoffeeTable[] {
    if (area === 'ALL') return this.allTables;
    return this.allTables.filter((t) => t.area === area);
  }

  getAvailableCount(): number {
    return this.allTables.filter((t) => t.status === 'AVAILABLE').length;
  }
}

export default TablesPresenter;
