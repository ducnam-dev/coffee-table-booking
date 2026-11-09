import axiosClient from '../config/axiosClient';
import { TableModel } from './TableModel';
import { MenuModel } from './MenuModel';

export class AIModel {
  static async getRecommendation(purpose, guestCount, preference) {
    try {
      const res = await axiosClient.post('/ai/recommend', {
        purpose,
        guestCount,
        preference,
      });
      if (res.data) return res.data;
    } catch (e) {}

    // Offline AI heuristic fallback
    const tables = await TableModel.fetchTables();
    const menu = await MenuModel.fetchMenu();

    let matchedTable = tables.find(t => t.status === 'AVAILABLE') || tables[0];
    if (purpose.includes('làm việc') || purpose.includes('học')) {
      matchedTable = tables.find(t => t.hasSocket && t.status === 'AVAILABLE') || matchedTable;
    } else if (purpose.includes('hẹn hò')) {
      matchedTable = tables.find(t => t.isNearWindow && t.status === 'AVAILABLE') || matchedTable;
    }

    return {
      aiMessage: `🤖 Pam AI (Chế độ offline): Dựa trên phân tích nhu cầu "${purpose}" cho ${guestCount} người, tôi đề xuất ${matchedTable.name} với không gian tối ưu nhất!`,
      recommendedTable: matchedTable,
      recommendedDrinks: menu.slice(0, 3),
      suitabilityScore: 96,
    };
  }
}

