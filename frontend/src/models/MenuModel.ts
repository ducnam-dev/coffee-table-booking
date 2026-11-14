import { axiosClient } from '../config/axiosClient';
import { MenuItem } from '../types';

const MOCK_MENU: MenuItem[] = [
  {
    id: 1,
    name: 'Cà Phê Muối Pam Signature',
    category: 'COFFEE',
    price: 45000,
    description: 'Cà phê Robusta Đắk Lắk đậm đà kết hợp cùng lớp kem muối béo ngậy mằn mặn',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500',
    isAvailable: true,
    isSignature: true,
    sweetnessOptions: ['0%', '30%', '50%', '100%'],
    iceOptions: ['Không đá', 'Ít đá', 'Đầy đủ'],
    toppings: [{ name: 'Kem muối thêm', price: 10000 }, { name: 'Thạch cà phê', price: 8000 }],
  },
  {
    id: 2,
    name: 'Cà Phê Trứng Hà Nội',
    category: 'COFFEE',
    price: 55000,
    description: 'Lớp bọt trứng bông mịn thơm lừng phủ trên cốt cà phê phin nguyên bản',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
    isAvailable: true,
    isSignature: true,
  },
  {
    id: 3,
    name: 'Bạc Xỉu Kem Béo',
    category: 'COFFEE',
    price: 39000,
    description: 'Vị ngọt dịu của sữa đặc hòa quyện cà phê phin thơm lừng',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500',
    isAvailable: true,
  },
  {
    id: 4,
    name: 'Trà Sen Vàng Hạt Dẻ',
    category: 'TEA',
    price: 49000,
    description: 'Trà Oolong thượng hạng kết hợp hạt sen tươi bùi bùi và kem béo nhẹ',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
    isAvailable: true,
    isSignature: true,
  },
  {
    id: 5,
    name: 'Trà Đào Cam Sả Tươi',
    category: 'TEA',
    price: 45000,
    description: 'Thanh mát giải nhiệt, hương cam vàng ngọt lịm và miếng đào giòn',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
    isAvailable: true,
  },
  {
    id: 6,
    name: 'Matcha Freeze Kem Tuyết',
    category: 'FREEZE',
    price: 59000,
    description: 'Matcha Uji Nhật Bản xay đá cùng thạch matcha giòn dai',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500',
    isAvailable: true,
  },
  {
    id: 7,
    name: 'Bánh Croissant Bơ Pháp',
    category: 'PASTRY',
    price: 35000,
    description: 'Bánh sừng bò nướng nóng hổi thơm nức mùi bơ thượng hạng',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
    isAvailable: true,
  },
  {
    id: 8,
    name: 'Tiramisu Cacao Nguyên Bản',
    category: 'PASTRY',
    price: 48000,
    description: 'Bánh phô mai Mascarpone mềm mượt thấm đẫm hương vị cà phê espresso',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
    isAvailable: true,
  },
];

export class MenuModel {
  static async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const res = await axiosClient.get('/menu');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((m: any) => ({
          id: m.id,
          name: m.name,
          category: (m.category === 'Trà Sữa' ? 'TEA' : m.category === 'Trà Trái Cây' ? 'TEA' : m.category === 'Ca Cao' ? 'COFFEE' : m.category === 'Sữa Tươi' ? 'SPECIAL' : m.category || 'COFFEE') as any,
          price: m.price || 20000,
          description: m.description || '',
          image: m.image || 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500',
          isAvailable: m.available !== undefined ? m.available : true,
          isSignature: m.isSignature || false,
        }));
      }
      return MOCK_MENU;
    } catch {
      return MOCK_MENU;
    }
  }

  static async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    try {
      const res = await axiosClient.get(`/menu/${id}`);
      return res.data;
    } catch {
      return MOCK_MENU.find((item) => item.id === id);
    }
  }

  static async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const res = await axiosClient.post('/menu', {
        name: item.name,
        category: item.category === 'COFFEE' ? 'Cà Phê' : item.category === 'TEA' ? 'Trà Trái Cây' : item.category === 'PASTRY' ? 'Bánh Ngọt' : 'Đặc Sản',
        price: item.price || 40000,
        description: item.description || '',
        available: item.isAvailable !== undefined ? item.isAvailable : true,
      });
      return {
        id: res.data.id,
        name: res.data.name,
        category: item.category || 'COFFEE',
        price: res.data.price,
        description: res.data.description,
        image: item.image || 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500',
        isAvailable: res.data.available,
      };
    } catch {
      const newItem: MenuItem = {
        id: Date.now(),
        name: item.name || 'Món mới',
        category: item.category || 'COFFEE',
        price: item.price || 40000,
        description: item.description || '',
        image: item.image || 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500',
        isAvailable: true,
      };
      MOCK_MENU.push(newItem);
      return newItem;
    }
  }
}

export default MenuModel;

