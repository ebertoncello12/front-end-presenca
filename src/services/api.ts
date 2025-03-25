import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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
api.interceptors.response.use(
    (response) => {
      if (response.data?.message) {
        toast.success(response.data.message);
      }
      return response;
    },
    (error) => {
      const message = error.response?.data?.error || 'Ocorreu um erro na requisição';
      if (error.response?.status === 401 && error.response?.data?.code === 'token_invalid') {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else {
        toast.error(message);
      }

      return Promise.reject(error);
    }
);

export default api;