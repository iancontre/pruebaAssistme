import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores globales
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

export default api; 