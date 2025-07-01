import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getFrontendSecret, FRONTEND_CONFIG } from '../config/auth';

// Configuración para desarrollo vs producción
const isDevelopment = import.meta.env.DEV;

// URL del servidor estático para obtener tokens
const getStaticServerUrl = () => {
  // Usar el dominio base desde variables de entorno
  return import.meta.env.VITE_BASE_DOMAIN || 'https://myassist-me.com';
};

// Siempre usar nginx como proxy reverse
const api = axios.create({
  baseURL: isDevelopment ? 'http://localhost:3003/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener token del servidor estático (CON SEGURIDAD)
export const getAuthToken = async () => {
  try {
    console.log('Obteniendo token de autenticación...');
    
    const staticServerUrl = getStaticServerUrl();
    const response = await axios.post(`${staticServerUrl}/api/auth/frontend-token`, {}, {
      headers: {
        'X-Frontend-Secret': getFrontendSecret()
      }
    });
    
    if (response.data.success) {
      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_expiry', (Date.now() + (response.data.expires_in * 1000)).toString());
      console.log('Token obtenido exitosamente');
      return token;
    } else {
      console.error('Error en respuesta del servidor:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

// Función para verificar si el token está expirado
export const isTokenExpired = () => {
  const expiry = localStorage.getItem('token_expiry');
  if (!expiry) return true;
  
  const now = Date.now();
  const expiryTime = parseInt(expiry);
  
  // Considerar expirado si faltan menos de 5 minutos
  return now >= (expiryTime - (FRONTEND_CONFIG.RENEWAL_THRESHOLD * 1000));
};

// Función para obtener token válido (obtiene nuevo si es necesario)
export const getValidToken = async () => {
  const token = localStorage.getItem('access_token');
  
  if (!token || isTokenExpired()) {
    console.log('Token no válido o expirado, obteniendo nuevo...');
    return await getAuthToken();
  }
  
  return token;
};

// Inicializar token al cargar la aplicación
export const initializeAuth = async () => {
  try {
    const token = await getValidToken();
    if (token) {
      console.log('Autenticación inicializada correctamente');
      return true;
    } else {
      console.error('No se pudo inicializar la autenticación');
      return false;
    }
  } catch (error) {
    console.error('Error inicializando autenticación:', error);
    return false;
  }
};

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Obtener token válido antes de cada petición
    const token = await getValidToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('Token expirado, obteniendo nuevo...');
      // Limpiar token expirado
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expiry');
      
      // Intentar obtener nuevo token
      const newToken = await getAuthToken();
      if (newToken && error.config) {
        // Reintentar la petición original con el nuevo token
        const originalRequest = error.config;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 