import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_URL_BASE from '../../utils/apiConfig.js';

const API_URL = `${API_URL_BASE}/passwords`;

const getAuthConfig = (getState) => {
  const { auth: { token } } = getState();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get all passwords
export const getPasswords = createAsyncThunk('vault/getPasswords', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL, getAuthConfig(thunkAPI.getState));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create new password
export const createPassword = createAsyncThunk('vault/createPassword', async (passwordData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, passwordData, getAuthConfig(thunkAPI.getState));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update password
export const updatePassword = createAsyncThunk('vault/updatePassword', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig(thunkAPI.getState));
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete password
export const deletePassword = createAsyncThunk('vault/deletePassword', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthConfig(thunkAPI.getState));
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Scan health
export const scanHealth = createAsyncThunk('vault/scanHealth', async (_, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/health-scan`, {}, getAuthConfig(thunkAPI.getState));
    return response.data.report;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  passwords: [],
  healthReport: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    reset: (state) => initialState,
    updateFromSocket: (state, action) => {
      const { action: socketAction, data, id } = action.payload;
      if (socketAction === 'create') {
        state.passwords.unshift(data);
      } else if (socketAction === 'update') {
        const index = state.passwords.findIndex(p => p._id === data._id);
        if (index !== -1) state.passwords[index] = data;
      } else if (socketAction === 'delete') {
        state.passwords = state.passwords.filter(p => p._id !== id);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPasswords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPasswords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.passwords = action.payload;
      })
      .addCase(getPasswords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deletePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.passwords = state.passwords.filter(p => p._id !== action.payload);
      })
      .addCase(scanHealth.fulfilled, (state, action) => {
        state.healthReport = action.payload;
      });
  }
});

export const { reset, updateFromSocket } = vaultSlice.actions;
export default vaultSlice.reducer;
