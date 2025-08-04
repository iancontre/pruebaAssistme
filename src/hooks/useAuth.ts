import { useState, useEffect, useCallback } from 'react';
import { 
  isAuthenticated, 
  getJWTToken, 
  logout as logoutService, 
  getUserInfo
} from '../services/apiService';
import { 
  isTokenExpiringSoon 
} from '../utils/cookieUtils';
import { loginWithJWT, LoginCredentials } from '../services/apiService';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated();
        const user = authenticated ? getUserInfo() : null;
        
        setAuthState({
          isAuthenticated: authenticated,
          user,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Error checking authentication'
        });
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await loginWithJWT(credentials);
      
      if (response.success && response.token) {
        const user = response.user || getUserInfo();
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });
        
        return { success: true, user };
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Login failed'
        }));
        
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return { success: false, error: errorMessage };
    }
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    logoutService();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  }, []);

  // Verificar si el token está próximo a expirar
  const checkTokenExpiry = useCallback(() => {
    return isTokenExpiringSoon();
  }, []);

  // Obtener token actual
  const getToken = useCallback(() => {
    return getJWTToken();
  }, []);

  return {
    ...authState,
    login,
    logout,
    checkTokenExpiry,
    getToken
  };
}; 