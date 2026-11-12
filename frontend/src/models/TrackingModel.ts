import { axiosClient } from '../config/axiosClient';
import { API_CONFIG } from '../config/api';

// Mock data for offline fallback
const MOCK_FAVORITES: number[] = [1, 4];

const MOCK_RECOMMENDATIONS = {
  personalRecommendations: [
    { id: 2, name: 'Cà Phê Trứng Hà Nội', category: 'COFFEE', price: 55000, reason: 'Cùng thể loại cà phê bạn yêu thích' },
    { id: 6, name: 'Matcha Freeze Kem Tuyết', category: 'FREEZE', price: 59000, reason: 'Phổ biến trong tuần' },
  ],
  trendingItems: [
    { id: 1, name: 'Cà Phê Muối Pam Signature', category: 'COFFEE', price: 45000, orderCount: 120 },
    { id: 4, name: 'Trà Sen Vàng Hạt Dẻ', category: 'TEA', price: 49000, orderCount: 95 },
    { id: 5, name: 'Trà Đào Cam Sả Tươi', category: 'TEA', price: 45000, orderCount: 88 },
  ],
  reason: 'Dựa trên sở thích cà phê và thức uống bạn đã thích',
};

const MOCK_PRODUCT_ANALYTICS = {
  mostFavorited: [
    { menuItemId: 1, name: 'Cà Phê Muối Pam Signature', count: 45 },
    { menuItemId: 4, name: 'Trà Sen Vàng Hạt Dẻ', count: 38 },
    { menuItemId: 2, name: 'Cà Phê Trứng Hà Nội', count: 32 },
  ],
  mostViewed: [
    { menuItemId: 1, name: 'Cà Phê Muối Pam Signature', count: 230 },
    { menuItemId: 6, name: 'Matcha Freeze Kem Tuyết', count: 180 },
    { menuItemId: 5, name: 'Trà Đào Cam Sả Tươi', count: 160 },
  ],
  mostOrdered: [
    { menuItemId: 1, name: 'Cà Phê Muối Pam Signature', count: 120 },
    { menuItemId: 4, name: 'Trà Sen Vàng Hạt Dẻ', count: 95 },
    { menuItemId: 3, name: 'Bạc Xỉu Kem Béo', count: 88 },
  ],
  totalEvents: 1520,
};

export class TrackingModel {
  /**
   * Track a user event (view, order, favorite, unfavorite)
   */
  static async trackEvent(
    userId: number,
    menuItemId: number,
    action: string
  ): Promise<void> {
    try {
      await axiosClient.post(API_CONFIG.ENDPOINTS.TRACKING_EVENT, {
        userId,
        menuItemId,
        action,
      });
    } catch {
      // Silently fail tracking – non-critical
    }
  }

  /**
   * Get list of favorite menuItemIds for a user
   */
  static async getFavorites(userId: number): Promise<number[]> {
    try {
      const res = await axiosClient.get(
        `${API_CONFIG.ENDPOINTS.TRACKING_FAVORITES}/${userId}`
      );
      // API returns array of favorite objects, extract menuItemIds
      if (Array.isArray(res.data)) {
        return res.data.map((f: any) => f.menuItemId ?? f);
      }
      return res.data;
    } catch {
      return MOCK_FAVORITES;
    }
  }

  /**
   * Add a menu item to user's favorites
   */
  static async addFavorite(
    userId: number,
    menuItemId: number
  ): Promise<void> {
    try {
      await axiosClient.post(
        `${API_CONFIG.ENDPOINTS.TRACKING_FAVORITES}/${userId}/${menuItemId}`
      );
    } catch {
      // Offline – state already updated optimistically
    }
  }

  /**
   * Remove a menu item from user's favorites
   */
  static async removeFavorite(
    userId: number,
    menuItemId: number
  ): Promise<void> {
    try {
      await axiosClient.delete(
        `${API_CONFIG.ENDPOINTS.TRACKING_FAVORITES}/${userId}/${menuItemId}`
      );
    } catch {
      // Offline – state already updated optimistically
    }
  }

  /**
   * Get personalized recommendations for a user
   */
  static async getRecommendations(userId: number): Promise<{
    personalRecommendations: any[];
    trendingItems: any[];
    reason: string;
  }> {
    try {
      const res = await axiosClient.get(
        `${API_CONFIG.ENDPOINTS.TRACKING_RECOMMENDATIONS}/${userId}`
      );
      return res.data;
    } catch {
      return MOCK_RECOMMENDATIONS;
    }
  }

  /**
   * Get product analytics (admin only)
   */
  static async getProductAnalytics(): Promise<any> {
    try {
      const res = await axiosClient.get(
        `${API_CONFIG.ENDPOINTS.TRACKING_ANALYTICS}/products`
      );
      return res.data;
    } catch {
      return MOCK_PRODUCT_ANALYTICS;
    }
  }
}

export default TrackingModel;
