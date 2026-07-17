import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Gắn access token vào mọi request (nếu đã đăng nhập)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Nếu token hết hạn / không hợp lệ (401): xóa token cũ và đưa về trang đăng nhập,
// tránh app bị kẹt ở trạng thái "Invalid token".
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
