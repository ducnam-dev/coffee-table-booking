import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setAuth, setLoading, setError, logoutAction } = authSlice.actions;
export default authSlice.reducer;

