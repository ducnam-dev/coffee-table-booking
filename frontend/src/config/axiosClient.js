import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach Auth Token
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle response / error logging
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error logging for offline / mock mode
    console.log('[Axios] Network request:', error?.config?.url, error?.message || '');
    return Promise.reject(error);
  }
);

export default axiosClient;

