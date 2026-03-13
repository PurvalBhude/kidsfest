import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// ── Thunks ──────────────────────────────────────────

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/login', { email, password });
      localStorage.setItem('kidsfest_admin', JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/admin/logout');
    } catch { /* ignore */ }
    localStorage.removeItem('kidsfest_admin');
  }
);

// ── Slice ───────────────────────────────────────────

const stored = localStorage.getItem('kidsfest_admin');
let initialAdmin = null;
try { initialAdmin = stored ? JSON.parse(stored) : null; } catch { /* ignore */ }

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: initialAdmin,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.loading = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
