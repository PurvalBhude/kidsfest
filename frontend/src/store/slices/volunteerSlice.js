import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchVolunteers = createAsyncThunk(
  'volunteers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/volunteers');
      return data.data || data.volunteers || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load volunteers');
    }
  }
);

export const updateVolunteerStatus = createAsyncThunk(
  'volunteers/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/volunteers/${id}/status`, { status });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update volunteer');
    }
  }
);

export const deleteVolunteer = createAsyncThunk(
  'volunteers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/volunteers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete volunteer');
    }
  }
);

const volunteerSlice = createSlice({
  name: 'volunteers',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVolunteers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVolunteers.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchVolunteers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateVolunteerStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((v) => v._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v._id !== action.payload);
      });
  },
});

export default volunteerSlice.reducer;
