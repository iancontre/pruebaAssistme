# Sistema de Autenticación con Cookies Seguras

## 🛡️ Seguridad Mejorada

Hemos migrado del almacenamiento de tokens JWT en `localStorage` a un sistema de cookies seguras para mejorar la seguridad de la aplicación.

## 🔄 Cambios Implementados

### ❌ Problemas con localStorage
- **Vulnerable a XSS**: Los tokens en localStorage son accesibles por JavaScript malicioso
- **No automático**: Los tokens no se envían automáticamente en las peticiones
- **Sin expiración automática**: Los tokens no expiran automáticamente en el navegador

### ✅ Solución con Cookies Seguras
- **Protección XSS**: Cookies con `httpOnly` (configurado en el servidor)
- **SameSite**: Protección contra ataques CSRF
- **Secure**: Solo se envían por HTTPS en producción
- **Expiración automática**: Las cookies expiran automáticamente

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
- `src/utils/cookieUtils.ts` - Utilidades para manejo de cookies
- `src/utils/cookieConfig.ts` - Configuración de cookies por entorno
- `src/hooks/useAuth.ts` - Hook personalizado para autenticación
- `src/components/ProtectedRoute.tsx` - Componente de protección de rutas
- `docs/AUTHENTICATION.md` - Esta documentación

### Archivos Modificados
- `src/services/apiService.ts` - Migrado de localStorage a cookies

## 🔧 Configuración

### Desarrollo vs Producción
```typescript
// Desarrollo (HTTP)
secure: false
sameSite: 'Lax'

// Producción (HTTPS)
secure: true
sameSite: 'Strict'
```

### Configuración de Cookies
```typescript
const COOKIE_CONFIG = {
  secure: import.meta.env.PROD,        // Solo HTTPS en producción
  sameSite: import.meta.env.PROD ? 'Strict' : 'Lax',
  domain: '',                          // Dominio actual
  path: '/',                           // Toda la aplicación
  maxAge: 24 * 60 * 60 * 1000,        // 24 horas
  refreshMaxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
};
```

## 🚀 Uso del Nuevo Sistema

### Hook useAuth
```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { 
    isAuthenticated, 
    user, 
    loading, 
    error,
    login, 
    logout 
  } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      // Login exitoso
    }
  };

  return (
    <div>
      {loading ? 'Cargando...' : (
        isAuthenticated ? `Bienvenido ${user?.full_name}` : 'No autenticado'
      )}
    </div>
  );
};
```

### Protección de Rutas
```typescript
import ProtectedRoute from '../components/ProtectedRoute';

// Ruta protegida básica
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Ruta con roles específicos
<ProtectedRoute roles={['admin', 'manager']}>
  <AdminPanel />
</ProtectedRoute>

// Ruta pública
<ProtectedRoute requireAuth={false}>
  <PublicPage />
</ProtectedRoute>
```

## 🔐 Funciones de Autenticación

### Establecer Token
```typescript
import { setJWTToken } from '../utils/cookieUtils';

setJWTToken(token, expiresIn); // expiresIn en segundos
```

### Obtener Token
```typescript
import { getJWTToken } from '../utils/cookieUtils';

const token = getJWTToken();
```

### Verificar Autenticación
```typescript
import { isAuthenticated } from '../utils/cookieUtils';

const authenticated = isAuthenticated();
```

### Cerrar Sesión
```typescript
import { removeJWTToken } from '../utils/cookieUtils';

removeJWTToken();
```

## 🔄 Migración desde localStorage

### Antes (localStorage)
```typescript
// Guardar
localStorage.setItem('jwt_token', token);

// Obtener
const token = localStorage.getItem('jwt_token');

// Eliminar
localStorage.removeItem('jwt_token');
```

### Después (Cookies)
```typescript
// Guardar
setJWTToken(token);

// Obtener
const token = getJWTToken();

// Eliminar
removeJWTToken();
```

## 🛡️ Medidas de Seguridad

### 1. Configuración de Cookies
- **httpOnly**: Solo accesible desde el servidor (configurar en backend)
- **secure**: Solo se envía por HTTPS
- **sameSite**: Protección contra CSRF
- **path**: Limitado a la aplicación
- **expires**: Expiración automática

### 2. Validación de Tokens
- Verificación de expiración automática
- Decodificación segura del payload
- Limpieza automática de tokens expirados

### 3. Manejo de Errores
- Fallback a localStorage para información no sensible
- Logging de errores de autenticación
- Manejo graceful de tokens inválidos

## 🔧 Configuración del Backend

Para completar la implementación, el backend debe configurar las cookies como `httpOnly`:

```javascript
// Ejemplo en Node.js/Express
res.cookie('jwt_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 horas
});
```

## 📊 Beneficios

### Seguridad
- ✅ Protección contra XSS
- ✅ Protección contra CSRF
- ✅ Expiración automática
- ✅ No accesible desde JavaScript malicioso

### Usabilidad
- ✅ Envío automático en peticiones
- ✅ Persistencia entre sesiones
- ✅ Manejo automático de expiración
- ✅ Configuración por entorno

### Mantenibilidad
- ✅ Código centralizado
- ✅ Configuración unificada
- ✅ Hooks reutilizables
- ✅ Documentación completa

## 🚨 Consideraciones Importantes

1. **HTTPS en Producción**: Las cookies seguras requieren HTTPS
2. **Configuración del Backend**: El backend debe configurar `httpOnly`
3. **Compatibilidad**: Funciona en todos los navegadores modernos
4. **Tamaño**: Las cookies tienen límites de tamaño (4KB por cookie)
5. **Dominio**: Las cookies están limitadas al dominio actual

## 🔍 Debugging

### Verificar Cookies
```javascript
// En la consola del navegador
document.cookie
```

### Verificar Autenticación
```javascript
// En la consola del navegador
import { isAuthenticated, getJWTToken } from './utils/cookieUtils';
console.log('Autenticado:', isAuthenticated());
console.log('Token:', getJWTToken());
```

### Limpiar Cookies
```javascript
// En la consola del navegador
import { removeJWTToken } from './utils/cookieUtils';
removeJWTToken();
``` 