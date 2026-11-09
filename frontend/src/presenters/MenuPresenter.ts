import { MenuModel } from '../models/MenuModel';
import { MenuItem, MenuCategory } from '../types';

export interface MenuViewInterface {
  showLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  renderMenuItems: (items: MenuItem[]) => void;
}

export class MenuPresenter {
  private view: MenuViewInterface;
  private allItems: MenuItem[] = [];

  constructor(view: MenuViewInterface) {
    this.view = view;
  }

  async loadMenu(): Promise<void> {
    try {
      this.view.showLoading(true);
      this.allItems = await MenuModel.getAllMenuItems();
      this.view.renderMenuItems(this.allItems);
      this.view.showLoading(false);
    } catch {
      this.view.showLoading(false);
      this.view.showError('Không thể tải danh sách thực đơn.');
    }
  }

  filter(category: MenuCategory | 'ALL', query: string): MenuItem[] {
    return this.allItems.filter((item) => {
      const matchCat = category === 'ALL' || item.category === category;
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }
}

export default MenuPresenter;

