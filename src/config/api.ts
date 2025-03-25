import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:3000/', // Mock API URL for now
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle success messages if they exist in the response
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // For development/demo purposes, return mock data instead of throwing errors
    if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
      const path = error.config.url;
      
      // Mock responses based on the endpoint
      if (path.includes('/student/dashboard')) {
        return Promise.resolve({
          data: {
            subjectCount: "6",
            totalAttendance: 85
          }
        });
      }
      
      if (path.includes('/student/subjects')) {
        return Promise.resolve({
          data: {
            subjectCount: "6",
            totalAttendance: 85,
            subjectsWithAttendance: [
              {
                id: 1,
                name: "Algoritmos e estruturas de dados",
                hour: "19:00 - 22:30",
                teacher: "Dr. Silva",
                attendancePercentage: "90",
                classes: []
              },
              {
                id: 2,
                name: "Redes de computadores",
                hour: "19:00 - 22:30",
                teacher: "Dra. Santos",
                attendancePercentage: "85",
                classes: []
              }
            ]
          }
        });
      }
    }

    const message = error.response?.data?.message || 'Ocorreu um erro na requisiçãossssss';
    
    // Only redirect to login for 401 errors when token is invalid/expired
    if (error.response?.status === 401 && error.response?.data?.code === 'token_invalid') {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Sessão expirada. Por favor, faça login novamente.');
    } else {
      // For all other errors, just show the error message
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;