// Configuración de autenticación del frontend
// Variables de entorno de Vite

export const FRONTEND_CONFIG = {
  // Clave secreta que identifica al frontend autorizado
  // Esta clave debe coincidir con FRONTEND_SECRET_KEY en el servidor
  SECRET_KEY: import.meta.env.VITE_FRONTEND_SECRET_KEY || 'super-secret-frontend-key-2024',
  
  // URL del endpoint de autenticación
  AUTH_ENDPOINT: '/api/auth/frontend-token',
  
  // Tiempo de expiración del token (en segundos)
  TOKEN_EXPIRY: parseInt(import.meta.env.VITE_TOKEN_EXPIRY || '3600'),
  
  // Tiempo de renovación anticipada (5 minutos antes de expirar)
  RENEWAL_THRESHOLD: parseInt(import.meta.env.VITE_RENEWAL_THRESHOLD || '300')
};

// Función para obtener el secreto del frontend
export const getFrontendSecret = (): string => {
  return FRONTEND_CONFIG.SECRET_KEY;
}; 