import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

<<<<<<< HEAD
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: () => void }> = [];

function processQueue(token: string | null, err?: any) {
  pendingQueue.forEach((p) => (err ? p.reject() : p.resolve(token!)));
  pendingQueue = [];
}

=======
// Gắn access token vào mọi request (nếu đã đăng nhập)
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

<<<<<<< HEAD
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await api.post('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(data.accessToken);
        return api(original);
      } catch (e) {
        processQueue(null, e);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject: () => {
            reject(error);
          },
        });
      });
    }
  }
=======
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
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
);
