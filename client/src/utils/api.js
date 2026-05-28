import axios from 'axios';

// Vite uses import.meta.env.VITE_API_URL, we'll fall back to localhost:5000/api
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
