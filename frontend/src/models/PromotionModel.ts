import { axiosClient } from '../config/axiosClient';
import { Promotion } from '../types';

let MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    code: 'PAMWELCOME',
    title: 'Ưu đãi khách hàng mới',
    description: 'Giảm ngay 20% cho đơn đặt bàn đầu tiên tại Pam Coffee & Tea',
    discountPercent: 20,
    maxDiscount: 50000,
    minOrderValue: 50000,
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 2,
    code: 'HAPPYHOUR',
    title: 'Happy Hour Sáng Vàng',
    description: 'Giảm 15% tổng hóa đơn khung giờ 08:00 - 11:00 các ngày trong tuần',
    discountPercent: 15,
    maxDiscount: 40000,
    minOrderValue: 40000,
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 3,
    code: 'WEEKENDVIP',
    title: 'Cuối tuần tụ họp VIP',
    description: 'Giảm 10% cho bàn tiệc từ 4 người trở lên vào Thứ 7 & Chủ Nhật',
    discountPercent: 10,
    maxDiscount: 100000,
    minOrderValue: 100000,
    validUntil: '2026-12-31',
    isActive: true,
  },
];

export class PromotionModel {
  static async getAllPromotions(): Promise<Promotion[]> {
    try {
      const res = await axiosClient.get('/promotions');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return MOCK_PROMOTIONS;
    } catch {
      return MOCK_PROMOTIONS;
    }
  }

  static async getActivePromotions(): Promise<Promotion[]> {
    try {
      const res = await axiosClient.get('/promotions/active');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return MOCK_PROMOTIONS.filter((p) => p.isActive);
    } catch {
      return MOCK_PROMOTIONS.filter((p) => p.isActive);
    }
  }

  static async createPromotion(data: Partial<Promotion>): Promise<Promotion> {
    try {
      const res = await axiosClient.post('/promotions', data);
      return res.data;
    } catch {
      const newPromo: Promotion = {
        id: Date.now(),
        code: (data.code || 'PROMO').toUpperCase(),
        title: data.title || 'Ưu đãi mới',
        description: data.description || '',
        discountPercent: data.discountPercent || 10,
        maxDiscount: data.maxDiscount || 50000,
        minOrderValue: data.minOrderValue || 0,
        validUntil: data.validUntil || '2026-12-31',
        isActive: data.isActive !== undefined ? data.isActive : true,
      };
      MOCK_PROMOTIONS = [newPromo, ...MOCK_PROMOTIONS];
      return newPromo;
    }
  }

  static async togglePromotion(promoId: number): Promise<Promotion | null> {
    try {
      const res = await axiosClient.put(`/promotions/${promoId}/toggle`);
      return res.data;
    } catch {
      const p = MOCK_PROMOTIONS.find((item) => item.id === promoId);
      if (p) p.isActive = !p.isActive;
      return p || null;
    }
  }

  static async deletePromotion(promoId: number): Promise<void> {
    try {
      await axiosClient.delete(`/promotions/${promoId}`);
    } catch {
      MOCK_PROMOTIONS = MOCK_PROMOTIONS.filter((item) => item.id !== promoId);
    }
  }
}

export default PromotionModel;
