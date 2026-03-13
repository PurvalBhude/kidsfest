import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// ─── Thunks ─────────────────────────────────────────────────────────

export const fetchSponsors = createAsyncThunk('sponsors/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/sponsors');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch sponsors');
  }
});

export const createSponsor = createAsyncThunk('sponsors/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/admin/sponsors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create sponsor');
  }
});

export const updateSponsor = createAsyncThunk('sponsors/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/sponsors/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update sponsor');
  }
});

export const deleteSponsor = createAsyncThunk('sponsors/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/sponsors/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete sponsor');
  }
});

// ─── Slice ──────────────────────────────────────────────────────────

const sponsorSlice = createSlice({
  name: 'sponsors',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSponsorError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSponsors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSponsors.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchSponsors.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Create
      .addCase(createSponsor.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createSponsor.rejected, (state, action) => { state.error = action.payload; })
      // Update
      .addCase(updateSponsor.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateSponsor.rejected, (state, action) => { state.error = action.payload; })
      // Delete
      .addCase(deleteSponsor.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSponsor.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearSponsorError } = sponsorSlice.actions;
export default sponsorSlice.reducer;
