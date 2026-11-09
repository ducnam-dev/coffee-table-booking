import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, MenuCategory, OrderItem } from '../../types';

interface MenuState {
  items: MenuItem[];
  cart: OrderItem[];
  selectedCategory: MenuCategory | 'ALL';
  searchQuery: string;
  isLoading: boolean;
}

const initialState: MenuState = {
  items: [],
  cart: [],
  selectedCategory: 'ALL',
  searchQuery: '',
  isLoading: false,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    setCategory: (state, action: PayloadAction<MenuCategory | 'ALL'>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addToCart: (state, action: PayloadAction<OrderItem>) => {
      const existing = state.cart.find((i) => i.menuItemId === action.payload.menuItemId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter((i) => i.menuItemId !== action.payload);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ menuItemId: number; quantity: number }>
    ) => {
      const item = state.cart.find((i) => i.menuItemId === action.payload.menuItemId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.cart = state.cart.filter((i) => i.menuItemId !== action.payload.menuItemId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setMenuItems,
  setCategory,
  setSearchQuery,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setLoading,
} = menuSlice.actions;

export default menuSlice.reducer;
