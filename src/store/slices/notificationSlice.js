import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL_BASE from '../../utils/apiConfig';

const API_URL = `${API_URL_BASE}/notifications`;

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      if (!token) return [];
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      if (error.response?.status !== 401) {
        toast.error(message);
      }
      return rejectWithValue(message);
    }
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  'notifications/markRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      await axios.patch(`${API_URL}/mark-as-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark notifications as read';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(markNotificationsAsRead.fulfilled, (state) => {
        state.items = state.items.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
