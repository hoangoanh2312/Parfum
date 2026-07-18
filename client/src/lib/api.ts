import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: () => void;
}> = [];

function processQueue(token: string | null, err?: any) {
  pendingQueue.forEach((p) => (err ? p.reject() : p.resolve(token!)));
  pendingQueue = [];
}

<<<<<<< HEAD
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: () => void }> = [];

function processQueue(token: string | null, err?: any) {
  pendingQueue.forEach((p) => (err ? p.reject() : p.resolve(token!)));
  pendingQueue = [];
}

=======
>>>>>>> feature/pf-32-category-brand-crud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
<<<<<<< HEAD
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
=======
    if (error.response?.status !== 401 || original._retry)
      return Promise.reject(error);
>>>>>>> feature/pf-32-category-brand-crud

    if (!isRefreshing) {
      isRefreshing = true;
      try {
<<<<<<< HEAD
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await api.post('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
=======
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await api.post("/auth/refresh", { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
>>>>>>> feature/pf-32-category-brand-crud
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(data.accessToken);
        return api(original);
      } catch (e) {
        processQueue(null, e);
<<<<<<< HEAD
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
=======
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
>>>>>>> feature/pf-32-category-brand-crud
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
<<<<<<< HEAD
  }
=======
  },
>>>>>>> feature/pf-32-category-brand-crud
);
