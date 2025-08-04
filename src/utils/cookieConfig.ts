// Configuración de cookies según el entorno
export const COOKIE_CONFIG = {
  // En desarrollo, no usar secure para permitir HTTP
  secure: import.meta.env.PROD,
  
  // En desarrollo, usar Lax para permitir navegación
  sameSite: import.meta.env.PROD ? 'Strict' : 'Lax' as 'Strict' | 'Lax',
  
  // Dominio (vacío para el dominio actual)
  domain: '',
  
  // Path (toda la aplicación)
  path: '/',
  
  // Tiempo de expiración por defecto (24 horas)
  maxAge: 24 * 60 * 60 * 1000,
  
  // Tiempo de expiración para refresh tokens (7 días)
  refreshMaxAge: 7 * 24 * 60 * 60 * 1000
};

// Configuración específica para JWT
export const JWT_CONFIG = {
  // Nombre de las cookies
  tokenName: 'jwt_token',
  refreshTokenName: 'jwt_refresh_token',
  expiryName: 'jwt_token_expiry',
  
  // Tiempo de expiración del token (24 horas)
  tokenExpiry: 24 * 60 * 60,
  
  // Tiempo de expiración del refresh token (7 días)
  refreshTokenExpiry: 7 * 24 * 60 * 60,
  
  // Tiempo de advertencia antes de expirar (5 minutos)
  expiryWarningTime: 5 * 60 * 1000
};

// Función para obtener opciones de cookie según el entorno
export const getCookieOptions = (customOptions: any = {}) => {
  return {
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    domain: COOKIE_CONFIG.domain,
    path: COOKIE_CONFIG.path,
    maxAge: COOKIE_CONFIG.maxAge,
    ...customOptions
  };
}; 