# Sistema de Validación en Tiempo Real

Este sistema proporciona validaciones robustas en tiempo real para formularios React, especialmente diseñado para el wizard de la aplicación.

## 🚀 Características

- ✅ **Validación en tiempo real** - Los campos se validan mientras el usuario escribe
- ✅ **Validación por tipo de campo** - Diferentes reglas para email, teléfono, nombres, etc.
- ✅ **Validación por país** - Reglas específicas para códigos postales y teléfonos según el país
- ✅ **Mensajes de error personalizados** - Mensajes claros y específicos
- ✅ **Estados visuales** - Indicadores visuales de error, éxito y validación
- ✅ **Hook personalizado** - Fácil de usar con `useFormValidation`
- ✅ **TypeScript** - Completamente tipado

## 📁 Estructura de Archivos

```
src/
├── utils/
│   ├── validation.ts          # Funciones de validación
│   └── README_VALIDATION.md   # Esta documentación
├── hooks/
│   └── useFormValidation.ts   # Hook personalizado
└── components/
    └── Wizard/
        ├── ProfileForm.tsx    # Formulario actualizado
        ├── BusinessForm.tsx   # Formulario actualizado
        └── ValidationExample.tsx # Ejemplo de uso
```

## 🛠️ Tipos de Validación Disponibles

### 1. **Email** (`email`)
- Formato válido de email
- Dominio válido
- No puede estar vacío

### 2. **Teléfono** (`phone`)
- Solo números y caracteres especiales válidos
- Longitud según país (7-15 dígitos)
- Validación específica por país

### 3. **Nombre** (`name`)
- Solo letras, espacios, guiones y apóstrofes
- Longitud: 2-50 caracteres
- Soporte para caracteres especiales (ñ, á, é, etc.)

### 4. **Empresa** (`company`)
- Longitud: 2-100 caracteres
- No puede estar vacío

### 5. **Dirección** (`address`)
- Longitud: 5-200 caracteres
- No puede estar vacío

### 6. **Código Postal** (`zipCode`)
- Validación específica por país
- Formatos: US (12345), CA (A1A 1A1), MX (12345), etc.

### 7. **Campo Requerido** (`required`)
- No puede estar vacío
- Mensaje personalizable

### 8. **Selección** (`select`)
- Debe seleccionar una opción válida
- No puede ser la opción por defecto

## 🎯 Uso Básico

### 1. Configurar el Hook

```typescript
import { useFormValidation } from '../../hooks/useFormValidation';

const MyForm = () => {
  const fieldTypes = {
    email: 'email',
    phone: 'phone',
    name: 'name',
    company: 'company'
  };

  const additionalData = {
    email: { fieldName: 'Email' },
    phone: { fieldName: 'Phone', countryCode: 'US' },
    name: { fieldName: 'Full name' },
    company: { fieldName: 'Company name' }
  };

  const {
    fields,
    errors,
    isValid,
    touched,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation({
    initialFields: {
      email: '',
      phone: '',
      name: '',
      company: ''
    },
    fieldTypes,
    additionalData,
    validateOnChange: true,
    validateOnBlur: true
  });

  // ... resto del componente
};
```

### 2. Usar en el JSX

```typescript
const getFieldClassName = (fieldName: string) => {
  const hasError = touched[fieldName] && errors[fieldName];
  const isValid = touched[fieldName] && !errors[fieldName] && fields[fieldName];
  
  if (hasError) return 'error';
  if (isValid) return 'valid';
  return '';
};

return (
  <form className="wizard-form">
    <div className="wizard-form-group">
      <label>Email</label>
      <input
        name="email"
        type="email"
        value={fields.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={getFieldClassName('email')}
        placeholder="Enter your email"
      />
      {touched.email && errors.email && (
        <span className="error-message">{errors.email}</span>
      )}
      {touched.email && !errors.email && fields.email && (
        <span className="success-message">✓ Valid email</span>
      )}
    </div>
  </form>
);
```

## 🎨 Estilos CSS

El sistema incluye estilos CSS para los estados de validación:

```css
/* Campos con error */
.wizard-form input.error,
.wizard-form select.error {
  border-color: #d32f2f;
  box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.2);
  background-color: #fff5f5;
}

/* Campos válidos */
.wizard-form input.valid,
.wizard-form select.valid {
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  background-color: #f8fff8;
}

/* Mensajes de error */
.error-message {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
  animation: fadeIn 0.3s ease-in-out;
}

/* Mensajes de éxito */
.success-message {
  color: #2e7d32;
  font-size: 12px;
  margin-top: 4px;
  animation: fadeIn 0.3s ease-in-out;
}
```

## 🌍 Validaciones por País

### Teléfonos
- **US/CA**: 10 dígitos
- **MX**: 10 dígitos
- **ES**: 9 dígitos
- **FR**: 10 dígitos
- **DE**: 10-12 dígitos
- **UK**: 10-11 dígitos
- **AR**: 10 dígitos
- **CL**: 9 dígitos
- **CO**: 10 dígitos
- **PE**: 9 dígitos
- **VE**: 10 dígitos
- **EC**: 9 dígitos
- **UY**: 8 dígitos
- **PY**: 9 dígitos
- **BO**: 8 dígitos

### Códigos Postales
- **US**: 12345 o 12345-6789
- **CA**: A1A 1A1
- **UK**: A1A 1AA
- **DE/FR/ES/IT/MX**: 5 dígitos
- **BR**: 12345-678
- **AR**: 4 dígitos
- **CL**: 7 dígitos
- **CO**: 6 dígitos
- **PE**: 5 dígitos
- **VE**: 4 dígitos
- **EC**: 6 dígitos
- **UY**: 5 dígitos
- **PY**: 4 dígitos
- **BO**: 4 dígitos

## 🔧 API del Hook

### Parámetros de Entrada

```typescript
interface UseFormValidationProps {
  initialFields: { [key: string]: string };
  fieldTypes: { [key: string]: string };
  additionalData?: { [key: string]: any };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}
```

### Valores de Retorno

```typescript
interface UseFormValidationReturn {
  fields: { [key: string]: string };
  errors: { [key: string]: string };
  isValid: boolean;
  touched: { [key: string]: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFieldValue: (fieldName: string, value: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  getFieldError: (fieldName: string) => string;
  isFieldValid: (fieldName: string) => boolean;
}
```

## 📝 Ejemplos de Uso

### Validación de Email
```typescript
const fieldTypes = { email: 'email' };
const additionalData = { email: { fieldName: 'Email' } };
```

### Validación de Teléfono por País
```typescript
const fieldTypes = { phone: 'phone' };
const additionalData = { phone: { fieldName: 'Phone', countryCode: 'US' } };
```

### Validación de Código Postal
```typescript
const fieldTypes = { zipCode: 'zipCode' };
const additionalData = { zipCode: { fieldName: 'Zip code', countryCode: 'US' } };
```

## 🚨 Manejo de Errores

El sistema maneja automáticamente:
- Campos vacíos
- Formatos inválidos
- Longitudes incorrectas
- Caracteres no permitidos
- Validaciones específicas por país

## 🎯 Mejores Prácticas

1. **Siempre usar `touched`** para mostrar errores solo después de que el usuario interactúe con el campo
2. **Proporcionar placeholders** informativos
3. **Usar mensajes de éxito** para confirmar validación exitosa
4. **Configurar `additionalData`** para mensajes personalizados
5. **Validar en tiempo real** para mejor UX

## 🔄 Migración desde el Sistema Anterior

Si tienes formularios existentes, simplemente:

1. Reemplaza el estado manual con `useFormValidation`
2. Configura `fieldTypes` y `additionalData`
3. Usa `handleChange` y `handleBlur` del hook
4. Aplica las clases CSS `error` y `valid`
5. Muestra mensajes usando `errors` y `touched`

## 📚 Recursos Adicionales

- Ver `ValidationExample.tsx` para un ejemplo completo
- Revisar `ProfileForm.tsx` y `BusinessForm.tsx` para implementaciones reales
- Consultar los estilos en `GetStartedForm.css` 