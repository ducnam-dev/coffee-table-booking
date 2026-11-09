import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reservation, ReservationStatus } from '../../types';

interface BookingsState {
  reservations: Reservation[];
  currentBooking: Partial<Reservation>;
  isLoading: boolean;
}

const initialState: BookingsState = {
  reservations: [],
  currentBooking: {
    guestCount: 2,
    orderItems: [],
  },
  isLoading: false,
};

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload;
      state.isLoading = false;
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.unshift(action.payload);
    },
    updateReservationStatusInStore: (
      state,
      action: PayloadAction<{ id: number; status: ReservationStatus }>
    ) => {
      const idx = state.reservations.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) {
        state.reservations[idx].status = action.payload.status;
      }
    },
    setCurrentBooking: (state, action: PayloadAction<Partial<Reservation>>) => {
      state.currentBooking = { ...state.currentBooking, ...action.payload };
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = { guestCount: 2, orderItems: [] };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setReservations,
  addReservation,
  updateReservationStatusInStore,
  setCurrentBooking,
  clearCurrentBooking,
  setLoading,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;

