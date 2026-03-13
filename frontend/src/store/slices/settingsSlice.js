import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchSettings = createAsyncThunk(
  'settings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/settings');
      return data.data || data.settings || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load settings');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/update',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/admin/settings', payload);
      return data.data || data.settings || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    setLocalSettings(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSettings.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateSettings.pending, (state) => { state.saving = true; })
      .addCase(updateSettings.fulfilled, (state, action) => { state.saving = false; state.data = action.payload; })
      .addCase(updateSettings.rejected, (state, action) => { state.saving = false; state.error = action.payload; });
  },
});

export const { setLocalSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
