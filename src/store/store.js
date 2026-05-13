import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vaultReducer from './slices/vaultSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vault: vaultReducer,
    notifications: notificationReducer,
  },
});
