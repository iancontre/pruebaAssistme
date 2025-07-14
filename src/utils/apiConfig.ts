// import { setAuthToken, clearAuthToken } from '../services/countryService';
// import { getAuthToken } from '../services/api';

// Las funciones de token ya no son necesarias porque la API de países no requiere autenticación

// Función para verificar el estado del token (opcional, puedes eliminarla si no usas tokens)
export function checkTokenStatus(): void {
  const token = localStorage.getItem('assistme_token');
  if (token) {
    console.log('✅ API token is configured');
    console.log('🔑 Token preview:', token.substring(0, 20) + '...');
  } else {
    console.log('⚠️ No API token found');
    console.log('💡 Use configureAPIToken("YOUR_JWT_TOKEN") to set one');
  }
}

// Hacer las funciones disponibles globalmente para uso desde la consola
declare global {
  interface Window {
    // configureAPIToken: (token: string) => void;
    // removeAPIToken: () => void;
    checkTokenStatus: () => void;
    // getTokenFromAPI: () => Promise<void>;
  }
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  // window.configureAPIToken = configureAPIToken;
  // window.removeAPIToken = removeAPIToken;
  window.checkTokenStatus = checkTokenStatus;
  // window.getTokenFromAPI = getTokenFromAPI;
} 