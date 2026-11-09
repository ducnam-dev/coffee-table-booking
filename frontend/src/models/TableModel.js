import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../config/axiosClient';
import { INITIAL_TABLES } from '../config/api';

export class TableModel {
  static async getCachedTables() {
    try {
      const json = await AsyncStorage.getItem('pam_tables');
      return json ? JSON.parse(json) : INITIAL_TABLES;
    } catch (e) {
      return INITIAL_TABLES;
    }
  }

  static async cacheTables(tables) {
    try {
      await AsyncStorage.setItem('pam_tables', JSON.stringify(tables));
    } catch (e) { }
  }

  // Dùng Axios để get API
  static async fetchTables() {
    try {
        const res = await axiosClient.get('/tables');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          await this.cacheTables(res.data);
          return res.data;
        }
      } catch (e) { }
      return await this.getCachedTables();
    }

  static async updateStatus(tableId, status) {
    try {
      await axiosClient.put(`/tables/${tableId}/status?status=${status}`);
    } catch (e) { }
  }

  static async createTable(tableData) {
    try {
    const res = await axiosClient.post('/tables', tableData);
    return res.data;
  } catch(e) {
    return null;
  }
}

  static async deleteTable(tableId) {
    try {
      await axiosClient.delete(`/tables/${tableId}`);
    } catch (e) { }
  }
}
