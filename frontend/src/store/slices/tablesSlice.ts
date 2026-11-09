import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoffeeTable, TableStatus } from '../../types';

interface TablesState {
  tables: CoffeeTable[];
  selectedTable: CoffeeTable | null;
  isLoading: boolean;
}

const initialState: TablesState = {
  tables: [],
  selectedTable: null,
  isLoading: false,
};

export const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action: PayloadAction<CoffeeTable[]>) => {
      state.tables = action.payload;
      state.isLoading = false;
    },
    selectTable: (state, action: PayloadAction<CoffeeTable | null>) => {
      state.selectedTable = action.payload;
    },
    updateTableStatusInStore: (
      state,
      action: PayloadAction<{ tableId: number; status: TableStatus }>
    ) => {
      const idx = state.tables.findIndex((t) => t.id === action.payload.tableId);
      if (idx !== -1) {
        state.tables[idx].status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setTables, selectTable, updateTableStatusInStore, setLoading } = tablesSlice.actions;
export default tablesSlice.reducer;
