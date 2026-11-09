import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../config/axiosClient';
import { INITIAL_MENU } from '../config/api';

export class MenuModel {
  static async getCachedMenu() {
    try {
      const json = await AsyncStorage.getItem('pam_menu');
      return json ? JSON.parse(json) : INITIAL_MENU;
    } catch (e) {
      return INITIAL_MENU;
    }
  }

  static async cacheMenu(menu) {
    try {
      await AsyncStorage.setItem('pam_menu', JSON.stringify(menu));
    } catch (e) { }
  }

  // Dùng Axios để get API
  static async fetchMenu() {
    try {
        const res = await axiosClient.get('/menu');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          await this.cacheMenu(res.data);
          return res.data;
        }
      } catch (e) { }
      return await this.getCachedMenu();
    }

  static async createMenuItem(itemData) {
    try {
    const res = await axiosClient.post('/menu', itemData);
    return res.data;
  } catch(e) {
    return null;
  }
}

  static async updateMenuItem(id, itemData) {
    try {
    const res = await axiosClient.put(`/menu/${id}`, itemData);
    return res.data;
  } catch (e) {
    return null;
  }
}

  static async deleteMenuItem(id) {
    try {
      await axiosClient.delete(`/menu/${id}`);
    } catch (e) { }
  }
}
