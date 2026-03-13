import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchExhibitors = createAsyncThunk(
  'exhibitors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/exhibitors');
      return data.data || data.exhibitors || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load exhibitors');
    }
  }
);

export const updateExhibitorStatus = createAsyncThunk(
  'exhibitors/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/exhibitors/${id}/status`, { status });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update exhibitor');
    }
  }
);

export const deleteExhibitor = createAsyncThunk(
  'exhibitors/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/exhibitors/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete exhibitor');
    }
  }
);

const exhibitorSlice = createSlice({
  name: 'exhibitors',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExhibitors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchExhibitors.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchExhibitors.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateExhibitorStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteExhibitor.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e._id !== action.payload);
      });
  },
});

export default exhibitorSlice.reducer;
