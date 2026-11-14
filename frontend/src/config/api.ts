import { Platform, NativeModules } from 'react-native';

const getDevHost = (): string => {
  if (Platform.OS === 'web') {
    return 'localhost';
  }
  // Tự động lấy IP máy tính từ URL gói JS của Expo (hoạt động ở mọi mạng Wi-Fi)
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  // Dự phòng theo IP Wi-Fi hiện tại của máy tính
  return '192.168.88.179';
};

export const API_CONFIG = {
  BASE_URL: `http://${getDevHost()}:8080/api`,
  FASTAPI_DOCS: `http://${getDevHost()}:8080/docs`,
  TIMEOUT: 3500,
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

