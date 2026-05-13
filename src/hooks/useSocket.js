import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateFromSocket } from '../store/slices/vaultSlice.js';
import { addNotification } from '../store/slices/notificationSlice.js';
import API_URL_BASE from '../utils/apiConfig.js';

const SOCKET_URL = API_URL_BASE.replace('/api', '');

const useSocket = (user) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socket = io(SOCKET_URL, {
        withCredentials: true
      });

      socket.on('connect', () => {
        socket.emit('join', user._id);
      });

      socket.on('vault_update', (data) => {
        dispatch(updateFromSocket(data));
      });

      socket.on('new_notification', (notification) => {
        dispatch(addNotification(notification));
        toast(notification.message, {
          icon: '🔔',
          duration: 4000
        });
      });

      socket.on('user_status_update', (data) => {
        if (data.userId === user._id && data.status !== 'ACTIVE') {
          window.location.reload();
        }
      });

      return () => socket.disconnect();
    }
  }, [user, dispatch]);
};

export default useSocket;
