export type UserRole = 'ROLE_CUSTOMER' | 'ROLE_MANAGER' | 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
export type TableArea = 'INDOOR' | 'OUTDOOR' | 'BALCONY' | 'VIP';

export interface CoffeeTable {
  id: number;
  tableNumber: string;
  capacity: number;
  area: TableArea;
  status: TableStatus;
  description?: string;
  hasPowerOutlet?: boolean;
  isWindowView?: boolean;
}

export type MenuCategory = 'COFFEE' | 'TEA' | 'FREEZE' | 'PASTRY' | 'SPECIAL';

export interface MenuItem {
  id: number;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isSignature?: boolean;
  sweetnessOptions?: string[];
  iceOptions?: string[];
  toppings?: { name: string; price: number }[];
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  size?: 'M' | 'L';
  sugar?: string;
  ice?: string;
  toppings?: string[];
  note?: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Reservation {
  id: number;
  userId?: number;
  customerName: string;
  phone: string;
  email?: string;
  tableId: number;
  tableNumber: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm
  guestCount: number;
  orderItems: OrderItem[];
  totalAmount: number;
  depositAmount: number;
  status: ReservationStatus;
  specialRequests?: string;
  qrCode?: string;
  createdAt?: string;
}

export interface AICoffeeRecommendation {
  recommendedDrinks: Array<{
    name: string;
    reason: string;
    flavorNotes: string[];
    suggestedSweetness: string;
    price: number;
  }>;
  moodAnalysis: string;
  baristaTip: string;
}

