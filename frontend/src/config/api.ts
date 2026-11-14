import { Platform } from 'react-native';

const getDevHost = (): string => {
  if (Platform.OS === 'web') {
    return 'localhost';
  }
  // Dùng IP LAN máy tính để điện thoại quét mã Expo Go kết nối được FastAPI
  return '192.168.1.105';
};

export const API_CONFIG = {
  BASE_URL: `http://${getDevHost()}:8080/api`,
  FASTAPI_DOCS: `http://${getDevHost()}:8080/docs`,
  TIMEOUT: 8000,
  ENDPOINTS: {
    AUTH_LOGIN: '/auth/login',
    AUTH_SIGNUP: '/auth/signup',
    TABLES: '/tables',
    MENU: '/menu',
    RESERVATIONS: '/reservations',
    USERS: '/users',
    AI_RECOMMEND: '/ai/recommend',
    TRACKING_EVENT: '/tracking/event',
    TRACKING_FAVORITES: '/tracking/favorites',
    TRACKING_RECOMMENDATIONS: '/tracking/recommendations',
    TRACKING_ANALYTICS: '/tracking/analytics',
    PROMOTIONS: '/promotions',
  },
};

export default API_CONFIG;

