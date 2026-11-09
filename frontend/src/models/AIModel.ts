import { axiosClient } from '../config/axiosClient';
import { AICoffeeRecommendation } from '../types';

export class AIModel {
  static async getRecommendation(userPreference: string): Promise<AICoffeeRecommendation> {
    try {
      const res = await axiosClient.post('/ai/recommend', { preference: userPreference });
      return res.data;
    } catch {
      // High-taste fallback recommendation based on mood keyword
      const query = userPreference.toLowerCase();
      if (query.includes('tỉnh') || query.includes('mệt') || query.includes('cà phê') || query.includes('sáng')) {
        return {
          recommendedDrinks: [
            {
              name: 'Cà Phê Muối Pam Signature',
              reason: 'Vị mằn mặn béo ngậy của lớp kem muối nâng tầm cốt cà phê phin Đắk Lắk đậm đà, giúp đánh thức mọi giác quan.',
              flavorNotes: ['Đậm đà', 'Béo ngậy', 'Hương caramel'],
              suggestedSweetness: '50% đường',
              price: 45000,
            },
            {
              name: 'Cà Phê Trứng Hà Nội',
              reason: 'Cốt phin rang mộc đậm chất truyền thống kết hợp bọt trứng sánh mịn thơm mùi vani.',
              flavorNotes: ['Thơm ngậy', 'Mịn màng', 'Nồng ấm'],
              suggestedSweetness: 'Nguyên bản',
              price: 55000,
            },
          ],
          moodAnalysis: 'Bạn đang tìm kiếm nguồn năng lượng tập trung và sự tỉnh táo để bắt đầu một ngày làm việc hiệu quả.',
          baristaTip: 'Nên uống từng ngụm chậm rãi từ trên xuống để cảm nhận sự chuyển đổi giữa vị béo mát của kem và vị đắng đậm đà của cà phê.',
        };
      }
      return {
        recommendedDrinks: [
          {
            name: 'Trà Sen Vàng Hạt Dẻ',
            reason: 'Vị trà Oolong thượng hạng thanh khiết kết hợp hạt sen bùi ngậy tạo cảm giác thư thái, nhẹ bụng.',
            flavorNotes: ['Thanh mát', 'Bùi béo', 'Hương hoa sen'],
            suggestedSweetness: '30% đường',
            price: 49000,
          },
          {
            name: 'Trà Đào Cam Sả Tươi',
            reason: 'Hương sả thanh lọc, cam vàng mọng nước giúp giải tỏa căng thẳng và thanh lọc cơ thể tức thì.',
            flavorNotes: ['Chua ngọt dịu', 'Thơm sả', 'Tươi mát'],
            suggestedSweetness: '50% đường',
            price: 45000,
          },
        ],
        moodAnalysis: 'Bạn đang muốn tìm một thức uống thanh nhẹ để thư giãn tâm hồn, xoa dịu giác quan sau những giờ học tập căng thẳng.',
        baristaTip: 'Khuấy đều cùng đá lạnh để các tầng hương vị cam sả hòa quyện trọn vẹn nhất.',
      };
    }
  }
}

export default AIModel;
