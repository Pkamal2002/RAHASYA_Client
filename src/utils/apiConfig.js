const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_URL = import.meta.env.VITE_API_URL || 
  (isLocalhost ? 'http://localhost:5001/api' : 'https://rahaysa-server.onrender.com/api');

export default API_URL;
