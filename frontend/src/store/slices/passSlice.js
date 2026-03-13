import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchPasses = createAsyncThunk(
  'passes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/passes');
      return data.data || data.passes || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load passes');
    }
  }
);

export const createPass = createAsyncThunk(
  'passes/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/passes', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create pass');
    }
  }
);

export const updatePass = createAsyncThunk(
  'passes/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/passes/${id}`, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update pass');
    }
  }
);

export const deletePass = createAsyncThunk(
  'passes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/passes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete pass');
    }
  }
);

const passSlice = createSlice({
  name: 'passes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPasses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPasses.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchPasses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // create
      .addCase(createPass.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      // update
      .addCase(updatePass.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // delete
      .addCase(deletePass.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export default passSlice.reducer;
