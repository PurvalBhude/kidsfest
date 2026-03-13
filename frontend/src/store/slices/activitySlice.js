import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchActivities = createAsyncThunk(
  'activities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/activities');
      return data.data || data.activities || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load activities');
    }
  }
);

export const createActivity = createAsyncThunk(
  'activities/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/activities', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create activity');
    }
  }
);

export const updateActivity = createAsyncThunk(
  'activities/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/activities/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update activity');
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'activities/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/activities/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete activity');
    }
  }
);

const activitySlice = createSlice({
  name: 'activities',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchActivities.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchActivities.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createActivity.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
      });
  },
});

export default activitySlice.reducer;
