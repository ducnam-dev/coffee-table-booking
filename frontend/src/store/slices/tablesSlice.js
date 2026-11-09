import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_TABLES } from '../../config/api';

const initialState = {
  items: INITIAL_TABLES,
  selectedTable: null,
  selectedArea: 'Tất cả',
  loading: false,
};

export const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.items = action.payload;
    },
    setSelectedTable: (state, action) => {
      state.selectedTable = action.payload;
    },
    setSelectedArea: (state, action) => {
      state.selectedArea = action.payload;
    },
    updateTableStatusLocal: (state, action) => {
      const { id, status } = action.payload;
      const target = state.items.find(t => t.id === id);
      if (target) target.status = status;
    },
    addTableLocal: (state, action) => {
      state.items.unshift(action.payload);
    },
    deleteTableLocal: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  setTables,
  setSelectedTable,
  setSelectedArea,
  updateTableStatusLocal,
  addTableLocal,
  deleteTableLocal,
} = tablesSlice.actions;
export default tablesSlice.reducer;

