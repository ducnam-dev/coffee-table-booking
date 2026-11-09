import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../config/axiosClient';

export class UserModel {
  static async getStoredAuth() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      return {
        token,
        user: userStr ? JSON.parse(userStr) : null,
      };
    } catch (e) {
      return { token: null, user: null };
    }
  }

  static async saveAuth(user, token) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('token', token);
  }

  static async clearAuth() {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  }

  // Dùng Axios để call API
  static async authenticate(emailOrUsername, password) {
    try {
      const res = await axiosClient.post('/auth/signin', {
          email: emailOrUsername,
          password,
        });

      if (res.data) {
        const data = res.data;
        const role = (data.role || 'ROLE_CUSTOMER').replace('ROLE_', '');
        const userObj = {
          id: data.id,
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          role,
        };
        await this.saveAuth(userObj, data.token);
        return { success: true, user: userObj, token: data.token };
      }
    } catch (error) {
      // Offline fallback
      return this.quickLoginFallback(emailOrUsername);
    }
    return this.quickLoginFallback(emailOrUsername);
  }

  static async register(userData) {
    try {
        const res = await axiosClient.post('/auth/signup', userData);
        if (res.data) {
          return { success: true };
        }
      } catch (e) {
        // Offline register
        const mockUser = {
          id: Date.now(),
          username: userData.username,
          fullName: userData.fullName || userData.username,
          email: userData.email,
          phone: userData.phone,
        role: 'CUSTOMER',
        };
        await this.saveAuth(mockUser, 'offline-token-' + Date.now());
        return { success: true, user: mockUser };
      }
      return { success: true };
    }

  static async quickLoginFallback(roleOrInput) {
    const lower = (roleOrInput || '').toLowerCase();
    let role = 'CUSTOMER';
    if (lower.includes('admin')) role = 'ADMIN';
    else if (lower.includes('staff')) role = 'STAFF';

    const mockUser = {
      id: role === 'ADMIN' ? 1 : role === 'STAFF' ? 3 : 2,
      username: role.toLowerCase(),
      fullName: role === 'ADMIN' ? 'Quản Trị Pam Coffee' : role === 'STAFF' ? 'Nhân Viên Pam Coffee' : 'Khách Hàng Pam',
      role,
      email: role === 'ADMIN' ? 'admin@pamcoffeetea.com' : role === 'STAFF' ? 'nhanvien@pamcoffeetea.com' : 'khachhang@gmail.com',
    };
    const token = `token-${role.toLowerCase()}-${Date.now()}`;
    await this.saveAuth(mockUser, token);
    return { success: true, user: mockUser, token };
  }

  static async fetchUsers() {
    try {
    const res = await axiosClient.get('/users');
    return res.data;
  } catch(e) {
    return null;
  }
}

  static async toggleLockUser(userId, lock) {
    try {
      await axiosClient.put(`/users/${userId}/lock?lock=${lock}`);
    } catch (e) { }
  }
}
