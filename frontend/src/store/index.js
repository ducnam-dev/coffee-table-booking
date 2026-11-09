import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tablesReducer from './slices/tablesSlice';
import menuReducer from './slices/menuSlice';
import bookingsReducer from './slices/bookingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tablesReducer,
    menu: menuReducer,
    bookings: bookingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

