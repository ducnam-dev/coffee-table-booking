import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrackingState {
  favorites: number[]; // menuItemIds
  recommendations: {
    personalRecommendations: any[];
    trendingItems: any[];
    reason: string;
  } | null;
  productAnalytics: any | null;
  loading: boolean;
}

const initialState: TrackingState = {
  favorites: [],
  recommendations: null,
  productAnalytics: null,
  loading: false,
};

export const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<number[]>) => {
      state.favorites = action.payload;
    },
    addFavoriteItem: (state, action: PayloadAction<number>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavoriteItem: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },
    setRecommendations: (
      state,
      action: PayloadAction<{
        personalRecommendations: any[];
        trendingItems: any[];
        reason: string;
      } | null>
    ) => {
      state.recommendations = action.payload;
    },
    setProductAnalytics: (state, action: PayloadAction<any | null>) => {
      state.productAnalytics = action.payload;
    },
    setTrackingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setFavorites,
  addFavoriteItem,
  removeFavoriteItem,
  setRecommendations,
  setProductAnalytics,
  setTrackingLoading,
} = trackingSlice.actions;

export default trackingSlice.reducer;
