import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../config/axiosClient';
import { INITIAL_RESERVATIONS } from '../config/api';

export class ReservationModel {
  static async getCachedReservations() {
    try {
      const json = await AsyncStorage.getItem('pam_reservations');
      return json ? JSON.parse(json) : INITIAL_RESERVATIONS;
    } catch (e) {
      return INITIAL_RESERVATIONS;
    }
  }

  static async cacheReservations(reservations) {
    try {
      await AsyncStorage.setItem('pam_reservations', JSON.stringify(reservations));
    } catch (e) { }
  }

  // Dùng Axios để get API
  static async fetchReservations() {
    try {
        const res = await axiosClient.get('/reservations');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          await this.cacheReservations(res.data);
          return res.data;
        }
      } catch (e) { }
      return await this.getCachedReservations();
    }

  static async fetchUserReservations(userId) {
    try {
      const res = await axiosClient.get(`/reservations/user/${userId}`);
      if (res.data) return res.data;
    } catch (e) { }
    const cached = await this.getCachedReservations();
    return cached.filter(r => !r.userId || r.userId === userId);
  }

  static async createReservation(reservationData) {
    try {
      const res = await axiosClient.post('/reservations', reservationData);
      if (res.data) return res.data;
    } catch (e) { }
    return {
      ...reservationData,
      id: Date.now(),
      status: 'PENDING',
    };
  }

  static async updateStatus(resId, status) {
    try {
      await axiosClient.put(`/reservations/${resId}/status?status=${status}`);
    } catch (e) { }
  }
}
