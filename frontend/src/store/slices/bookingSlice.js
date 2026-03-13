import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async ({ page = 1, limit = 15, status = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      const { data } = await api.get('/admin/bookings', { params });
      return {
        bookings: data.data || data.bookings || [],
        pagination: data.pagination || { total: 0, page: 1, pages: 1 },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/bookings/${id}`);
      return data.data || data.booking || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, pages: 1 },
    selectedBooking: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedBooking(state) {
      state.selectedBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchBookings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // fetch detail
      .addCase(fetchBookingById.pending, (state) => { state.detailLoading = true; })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state) => { state.detailLoading = false; });
  },
});

export const { clearSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
