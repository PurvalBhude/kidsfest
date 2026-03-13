import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchPromoCodes = createAsyncThunk(
  'promoCodes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/promo-codes');
      return data.data || data.promoCodes || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load promo codes');
    }
  }
);

export const createPromoCode = createAsyncThunk(
  'promoCodes/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/promo-codes', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create promo code');
    }
  }
);

export const updatePromoCode = createAsyncThunk(
  'promoCodes/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/promo-codes/${id}`, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update promo code');
    }
  }
);

export const deletePromoCode = createAsyncThunk(
  'promoCodes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/promo-codes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete promo code');
    }
  }
);

const promoCodeSlice = createSlice({
  name: 'promoCodes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromoCodes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPromoCodes.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchPromoCodes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createPromoCode.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updatePromoCode.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePromoCode.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default promoCodeSlice.reducer;
