import { MenuModel } from '../models/MenuModel';

export class MenuPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadMenu() {
    this.view.showLoading(true);
    try {
      const menu = await MenuModel.fetchMenu();
      this.view.displayMenu(menu);
    } catch (e) {
      this.view.showError('Không thể tải thực đơn đồ uống');
    } finally {
      this.view.showLoading(false);
    }
  }

  filterMenu(menu, category, searchQuery) {
    return menu.filter(item => {
      const matchCat = !category || category === 'Tất cả' || item.category === category;
      const q = (searchQuery || '').toLowerCase();
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }
}

