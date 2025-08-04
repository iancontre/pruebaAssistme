import { COOKIE_CONFIG, JWT_CONFIG } from './cookieConfig';

// Utilidades para manejo seguro de cookies
export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

// Configuración por defecto para cookies seguras
const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  path: COOKIE_CONFIG.path,
  secure: COOKIE_CONFIG.secure,
  sameSite: COOKIE_CONFIG.sameSite,
  maxAge: COOKIE_CONFIG.maxAge
};

/**
 * Establece una cookie de forma segura
 * @param name Nombre de la cookie
 * @param value Valor de la cookie
 * @param options Opciones de la cookie
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  const opts = { ...DEFAULT_COOKIE_OPTIONS, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (opts.expires) {
    cookieString += `; expires=${opts.expires.toUTCString()}`;
  }
  
  if (opts.maxAge) {
    cookieString += `; max-age=${opts.maxAge}`;
  }
  
  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }
  
  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }
  
  if (opts.secure) {
    cookieString += '; secure';
  }
  
  if (opts.httpOnly) {
    // Nota: httpOnly solo se puede establecer desde el servidor
    // En el frontend, usamos otras medidas de seguridad
    cookieString += '; httpOnly';
  }
  
  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }
  
  document.cookie = cookieString;
};

/**
 * Obtiene el valor de una cookie
 * @param name Nombre de la cookie
 * @returns Valor de la cookie o null si no existe
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  
  return null;
};

/**
 * Elimina una cookie
 * @param name Nombre de la cookie
 * @param options Opciones de la cookie (debe coincidir con las usadas al crearla)
 */
export const removeCookie = (name: string, options: CookieOptions = {}): void => {
  const opts = { ...DEFAULT_COOKIE_OPTIONS, ...options };
  
  // Para eliminar una cookie, establecemos su fecha de expiración en el pasado
  const expires = new Date(0);
  
  setCookie(name, '', {
    ...opts,
    expires,
    maxAge: 0
  });
};

/**
 * Verifica si una cookie existe
 * @param name Nombre de la cookie
 * @returns true si la cookie existe
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Obtiene todas las cookies como un objeto
 * @returns Objeto con todas las cookies
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
  }
  
  return cookies;
};

/**
 * Limpia todas las cookies del dominio actual
 */
export const clearAllCookies = (): void => {
  const cookies = getAllCookies();
  
  Object.keys(cookies).forEach(name => {
    removeCookie(name);
  });
};

// Configuración específica para tokens JWT
export const JWT_COOKIE_NAME = JWT_CONFIG.tokenName;
export const JWT_REFRESH_COOKIE_NAME = JWT_CONFIG.refreshTokenName;
export const JWT_EXPIRY_COOKIE_NAME = JWT_CONFIG.expiryName;

/**
 * Establece un token JWT en una cookie segura
 * @param token Token JWT
 * @param expiresIn Tiempo de expiración en segundos
 */
export const setJWTToken = (token: string, expiresIn: number = JWT_CONFIG.tokenExpiry): void => {
  const maxAge = expiresIn * 1000; // Convertir a milisegundos
  const expiry = new Date(Date.now() + maxAge);
  
  setCookie(JWT_COOKIE_NAME, token, {
    maxAge,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite
  });
  
  // También guardamos la fecha de expiración para verificación en el frontend
  setCookie(JWT_EXPIRY_COOKIE_NAME, expiry.getTime().toString(), {
    maxAge,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite
  });
};

/**
 * Obtiene el token JWT de las cookies
 * @returns Token JWT o null si no existe o ha expirado
 */
export const getJWTToken = (): string | null => {
  const token = getCookie(JWT_COOKIE_NAME);
  const expiry = getCookie(JWT_EXPIRY_COOKIE_NAME);
  
  if (!token || !expiry) {
    return null;
  }
  
  // Verificar si el token ha expirado
  const expiryTime = parseInt(expiry);
  if (Date.now() > expiryTime) {
    // Token expirado, limpiar cookies
    removeJWTToken();
    return null;
  }
  
  return token;
};

/**
 * Establece un refresh token en una cookie segura
 * @param refreshToken Refresh token
 * @param expiresIn Tiempo de expiración en segundos (por defecto 7 días)
 */
export const setJWTRefreshToken = (refreshToken: string, expiresIn: number = JWT_CONFIG.refreshTokenExpiry): void => {
  setCookie(JWT_REFRESH_COOKIE_NAME, refreshToken, {
    maxAge: expiresIn * 1000,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite
  });
};

/**
 * Obtiene el refresh token de las cookies
 * @returns Refresh token o null si no existe
 */
export const getJWTRefreshToken = (): string | null => {
  return getCookie(JWT_REFRESH_COOKIE_NAME);
};

/**
 * Elimina todas las cookies relacionadas con JWT
 */
export const removeJWTToken = (): void => {
  removeCookie(JWT_COOKIE_NAME);
  removeCookie(JWT_REFRESH_COOKIE_NAME);
  removeCookie(JWT_EXPIRY_COOKIE_NAME);
};

/**
 * Verifica si el usuario está autenticado (tiene un token válido)
 * @returns true si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return getJWTToken() !== null;
};

/**
 * Obtiene información del usuario desde el token JWT (sin verificar firma)
 * @returns Información del usuario o null si no hay token válido
 */
export const getUserInfoFromToken = (): any => {
  const token = getJWTToken();
  
  if (!token) {
    return null;
  }
  
  try {
    // Decodificar el payload del JWT (sin verificar firma)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Verifica si el token JWT está próximo a expirar (dentro de 5 minutos)
 * @returns true si el token está próximo a expirar
 */
export const isTokenExpiringSoon = (): boolean => {
  const expiry = getCookie(JWT_EXPIRY_COOKIE_NAME);
  
  if (!expiry) {
    return true;
  }
  
  const expiryTime = parseInt(expiry);
  const warningTime = Date.now() + JWT_CONFIG.expiryWarningTime;
  
  return expiryTime <= warningTime;
}; 