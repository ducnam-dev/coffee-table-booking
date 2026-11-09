import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_RESERVATIONS } from '../../config/api';

const initialState = {
  items: INITIAL_RESERVATIONS,
  filterStatus: 'Tất cả',
  loading: false,
};

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.items = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    addBookingLocal: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateBookingStatusLocal: (state, action) => {
      const { id, status } = action.payload;
      const target = state.items.find(b => b.id === id);
      if (target) target.status = status;
    },
  },
});

export const {
  setBookings,
  setFilterStatus,
  addBookingLocal,
  updateBookingStatusLocal,
} = bookingsSlice.actions;
export default bookingsSlice.reducer;

