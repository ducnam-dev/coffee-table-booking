import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_MENU } from '../../config/api';

const initialState = {
  items: INITIAL_MENU,
  preOrder: {}, // { [menuId]: qty }
  selectedCategory: 'Tất cả',
  searchQuery: '',
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
      state.items = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    updatePreOrder: (state, action) => {
      const { id, delta } = action.payload;
      const current = state.preOrder[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        delete state.preOrder[id];
      } else {
        state.preOrder[id] = next;
      }
    },
    clearPreOrderLocal: (state) => {
      state.preOrder = {};
    },
    addMenuItemLocal: (state, action) => {
      state.items.push(action.payload);
    },
    toggleAvailableLocal: (state, action) => {
      const target = state.items.find(m => m.id === action.payload);
      if (target) target.available = !target.available;
    },
    deleteMenuItemLocal: (state, action) => {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
  },
});

export const {
  setMenuItems,
  setSelectedCategory,
  setSearchQuery,
  updatePreOrder,
  clearPreOrderLocal,
  addMenuItemLocal,
  toggleAvailableLocal,
  deleteMenuItemLocal,
} = menuSlice.actions;
export default menuSlice.reducer;

