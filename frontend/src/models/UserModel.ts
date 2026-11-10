import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosClient } from '../config/axiosClient';
import { User } from '../types';

const USER_STORAGE_KEY = 'current_user';
const TOKEN_STORAGE_KEY = 'user_token';

const DEMO_USERS: Record<string, User> = {
  manager: {
    id: 1,
    username: 'manager',
    email: 'manager@pamcoffee.vn',
    fullName: 'Quản Lý Pam Coffee',
    phone: '0901234567',
    role: 'ROLE_MANAGER',
    isActive: true,
  },
  admin: {
    id: 1,
    username: 'manager',
    email: 'manager@pamcoffee.vn',
    fullName: 'Quản Lý Pam Coffee',
    phone: '0901234567',
    role: 'ROLE_MANAGER',
    isActive: true,
  },
  customer: {
    id: 2,
    username: 'customer',
    email: 'customer@pamcoffee.vn',
    fullName: 'Nguyễn Văn Khách',
    phone: '0987654321',
    role: 'ROLE_CUSTOMER',
    isActive: true,
  },
  khachhang: {
    id: 2,
    username: 'customer',
    email: 'customer@pamcoffee.vn',
    fullName: 'Nguyễn Văn Khách',
    phone: '0987654321',
    role: 'ROLE_CUSTOMER',
    isActive: true,
  },
};

export class UserModel {
  static async login(username: string, password: string):Promise<User> {
    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      const data = response.data;
      const isManager = data.role === 'ROLE_MANAGER' || data.role === 'ROLE_ADMIN' || data.roles?.[0] === 'ROLE_MANAGER' || data.roles?.[0] === 'ROLE_ADMIN';
      const user: User = {
        id: data.id || 1,
        username: data.username,
        email: data.email,
        fullName: data.fullName || data.username,
        phone: data.phone || '0901234567',
        role: isManager ? 'ROLE_MANAGER' : 'ROLE_CUSTOMER',
        isActive: true,
      };
      if (data.token) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      }
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch {
      // Fallback for offline demo
      const user = DEMO_USERS[username.toLowerCase()] || {
        id: 99,
        username,
        email: `${username}@gmail.com`,
        fullName: username,
        phone: '0900000000',
        role: username.toLowerCase().includes('manager') || username.toLowerCase().includes('admin') ? 'ROLE_MANAGER' : 'ROLE_CUSTOMER',
        isActive: true,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, 'mock-jwt-token-pam-coffee');
      return user;
    }
  }

  static async register(userData: { username: string; password: string; email: string; fullName: string; phone?: string }): Promise<User> {
    try {
      const response = await axiosClient.post('/auth/signup', userData);
      return response.data;
    } catch {
      const newUser: User = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone || '',
        role: 'ROLE_CUSTOMER',
        isActive: true,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export default UserModel;

