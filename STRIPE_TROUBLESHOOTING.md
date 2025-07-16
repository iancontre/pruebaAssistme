# Stripe Troubleshooting Guide

## Error: "Price is not available to be purchased because its product is not active"

### Problema
Cuando intentas procesar un pago, recibes el error:
```
IntegrationError: Price `price_1Rdc0kFZLk0rN7lFw6b3ULcw` is not available to be purchased because its product is not active.
```

### Causa
Este error ocurre cuando:
1. El producto en Stripe está marcado como inactivo
2. El price ID está asociado a un producto que no existe o está deshabilitado
3. Los price IDs en el código no coinciden con los configurados en Stripe

### Solución

#### 1. Verificar Productos en Stripe Dashboard

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navega a **Products** en el menú lateral
3. Verifica que todos los productos estén marcados como **Active**
4. Si un producto está inactivo, haz clic en el toggle para activarlo

#### 2. Verificar Price IDs

1. En el dashboard de Stripe, ve a **Products**
2. Selecciona cada producto y verifica los **Pricing** asociados
3. Copia los price IDs correctos (formato: `price_xxxxxxxxxxxxx`)
4. Actualiza el archivo `src/services/stripeService.ts`:

```typescript
const PLAN_PRICE_IDS: { [key: string]: string } = {
  'STARTER': 'price_xxxxxxxxxxxxx',  // Reemplaza con el ID correcto
  'PRO': 'price_xxxxxxxxxxxxx',      // Reemplaza con el ID correcto
  'BUSINESS': 'price_xxxxxxxxxxxxx', // Reemplaza con el ID correcto
};
```

#### 3. Verificar Configuración de Productos

Para cada producto en Stripe, asegúrate de que:

- ✅ **Status**: Active
- ✅ **Pricing**: Al menos un price configurado
- ✅ **Recurring**: Configurado correctamente para suscripciones
- ✅ **Tax behavior**: Configurado según tus necesidades

#### 4. Probar la Integración

1. Limpia el cache del navegador
2. Reinicia la aplicación
3. Intenta procesar un pago nuevamente

### Verificación Automática

El código ahora incluye validación automática que:

1. Verifica que los price IDs existan
2. Confirma que los productos estén activos
3. Muestra mensajes de error específicos
4. Intenta refrescar la configuración desde la API

### Logs de Debug

Revisa la consola del navegador para ver logs detallados:

```
🔍 Validating Stripe price ID: price_1Rdc0kFZLk0rN7lFw6b3ULcw
✅ Price validation successful: {...}
⚠️ Price or product is not active: {...}
```

### Contacto de Soporte

Si el problema persiste:

1. Verifica que tienes permisos de administrador en Stripe
2. Contacta al equipo de desarrollo con:
   - Screenshots del error
   - Logs de la consola
   - Nombre del plan que falla
   - Price ID que está causando el problema

### Prevención

Para evitar este problema en el futuro:

1. **Monitoreo**: Revisa regularmente el estado de los productos en Stripe
2. **Testing**: Prueba los pagos en modo test antes de activar en producción
3. **Documentación**: Mantén actualizada la documentación de price IDs
4. **Validación**: Usa la validación automática implementada en el código 