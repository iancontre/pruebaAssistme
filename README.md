# 🚀 Proyecto Frontend - MyAssist.me

## 📋 Descripción
Este es un proyecto frontend desarrollado con React y TypeScript, utilizando Vite como herramienta de construcción. El proyecto incluye integración con Zendesk para el soporte al cliente, Stripe para procesamiento de pagos, un dashboard completo con gráficas interactivas, **sistema completo de internacionalización (i18n)**, y utiliza varias bibliotecas modernas para la interfaz de usuario.

## 🛠️ Tecnologías Principales
- ⚛️ React 19
- 🔷 TypeScript
- ⚡ Vite
- 🎨 Material-UI (MUI)
- 🎯 PrimeReact
- 🛣️ React Router DOM
- 🎪 Bootstrap
- 🌐 Axios
- 💳 Stripe.js
- 📊 Recharts (Gráficas interactivas)
- 📋 React Data Table Component
- 📈 XLSX (Exportación a Excel)

## 📋 Requisitos Previos
- 🟢 Node.js (versión recomendada: 18 o superior)
- 📦 npm o yarn

## 🚀 Instalación

1. **Clona el repositorio:**
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. **Instala las dependencias:**
```bash
npm install
# o
yarn install
```

3. **Configura las variables de entorno:**
```bash
# Crea un archivo .env en la raíz del proyecto
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## 📜 Scripts Disponibles

- 🏃‍♂️ `npm run dev` - Inicia el servidor de desarrollo
- 🏗️ `npm run build` - Construye el proyecto para producción
- 🔍 `npm run lint` - Ejecuta el linter para verificar el código
- 👀 `npm run preview` - Previsualiza la versión de producción localmente

## ✨ Características Principales

### 🌍 Sistema de Internacionalización (i18n)
El proyecto incluye un sistema completo de internacionalización que permite cambiar entre idiomas dinámicamente:

#### 🔧 Implementación
- **Hook personalizado**: `useTranslation` para manejo de traducciones
- **Context Provider**: `LanguageContext` para gestión del estado del idioma
- **Archivos de traducción**: `src/locales/en.json` y `src/locales/es.json`
- **Cambio dinámico**: Selector de idioma en la navegación

#### 📝 Componentes Traducidos
- ✅ **Navegación**: Menú principal y dropdowns
- ✅ **Header**: Títulos y botones de acción
- ✅ **Footer**: Enlaces y información de contacto
- ✅ **Componentes de contenido**:
  - `ContentBlog`: Artículos del blog y funcionalidad de búsqueda
  - `TeamsCustomer`: Información del equipo
  - `BenefitCustomer`: Beneficios del servicio
  - `AdvantagesCustomer`: Ventajas competitivas
  - `Contact`: Formulario de contacto
  - `FrequentlyAskedQuestions`: Preguntas frecuentes
  - `Intersection`: Sección de llamada a la acción
  - `Testimonials`: Testimonios de clientes
- ✅ **Wizards completos**:
  - **Wizard de Pago**: Todos los formularios y pasos
  - **Wizard de Configuración**: Todos los formularios y pasos
- ✅ **Blog**: Contenido completo de artículos
- ✅ **Páginas**: HomePage, FAQs, CustomerService

#### 🎯 Funcionalidades del Sistema i18n
- **Cambio en tiempo real**: Sin recargar la página
- **Persistencia**: El idioma seleccionado se mantiene en localStorage
- **Fallback**: Si falta una traducción, muestra la clave
- **HTML seguro**: Soporte para `dangerouslySetInnerHTML` en traducciones
- **Interpolación**: Reemplazo dinámico de variables en traducciones

#### 📁 Estructura de Traducciones
```json
{
  "nav": {
    "aboutUs": "Sobre Nosotros",
    "services": "Servicios",
    "pricingPlans": "Precios y Planes"
  },
  "header": {
    "homepage": {
      "title": "Título principal",
      "description": "Descripción",
      "contactUs": "Contáctanos",
      "pricingPlans": "Precios y Planes"
    }
  },
  "wizard": {
    "profile": {
      "title": "Registrarse es Fácil",
      "subtitle": "Primero cuéntanos un poco sobre ti"
    },
    "business": {
      "title": "Cuéntanos Sobre Tu Negocio",
      "subtitle": "Primero cuéntanos un poco sobre ti"
    }
  }
}
```

### 📊 Dashboard Completo con Gráficas Interactivas
El proyecto incluye un dashboard empresarial completo con múltiples visualizaciones de datos:

#### 🏠 1. Dashboard Principal (`DashboardPage`)
- 📅 **Filtro de Fechas**: Componente `DateFilter` para seleccionar rangos de fechas
- 📈 **Gráfica de Resumen de Llamadas**: `CallSummaryChart` con gráfica de área usando Recharts
- 📊 **Gráfica de Llamadas por Cliente**: `ClientCallsChart` con gráfica de barras
- 📱 **Diseño Responsivo**: Layout adaptativo con sidebar y header
- 🔐 **Autenticación**: Verificación de JWT token para acceso seguro

#### 📋 2. Reporte Detallado de Llamadas (`ReporteLlamadasPage`)
- 📊 **Tabla de Datos**: Implementada con `react-data-table-component`
- 🔍 **Filtros Avanzados**: Búsqueda por cliente, agente, tipo de llamada
- 📄 **Paginación**: Navegación por páginas con configurable page size
- 📤 **Exportación**: Funcionalidad para exportar a Excel (XLSX)
- 🔍 **Modal de Detalles**: Vista detallada de cada llamada
- 📊 **Estadísticas**: Resumen de métricas por período

#### 📈 3. Componentes de Gráficas

##### 📈 CallSummaryChart
- 🎯 **Tipo**: Gráfica de área (AreaChart) con Recharts
- 📊 **Datos**: Resumen de llamadas por día con minutos totales
- 🖱️ **Interactividad**: Tooltips, zoom, hover effects
- 📱 **Responsive**: Se adapta al tamaño del contenedor
- 🔢 **Formato**: Valores formateados (K, Mill para grandes números)

##### 📊 ClientCallsChart
- 📊 **Tipo**: Gráfica de barras (BarChart) con Recharts
- 👥 **Datos**: Llamadas agrupadas por cliente y día
- 🎨 **Leyenda**: Múltiples clientes con colores diferenciados
- ⚠️ **Limitación**: Muestra máximo 6 clientes para evitar saturación
- 🔄 **Transformación**: Datos del API transformados para visualización

#### 🎨 4. Componentes de UI del Portal

##### 📅 DateFilter
- ⚙️ **Funcionalidad**: Selección de rangos de fechas
- 🕐 **Default**: Últimos 30 días
- 📝 **Formato**: Inputs de fecha con validación
- 🔔 **Callback**: Notifica cambios a componentes padre

##### 🧭 SidebarPortal
- 🧭 **Navegación**: Menú lateral con enlaces a diferentes secciones
- 🎨 **Estilo**: Diseño moderno con iconos
- 📱 **Responsive**: Se adapta a diferentes tamaños de pantalla

##### 🎯 HeaderPortal
- 👤 **Información**: Muestra datos del usuario logueado
- ⚡ **Acciones**: Logout, notificaciones, perfil
- 🎨 **Estilo**: Header fijo con diseño profesional

##### 🔔 NotificationsPanel
- 🔔 **Notificaciones**: Panel de notificaciones del sistema
- 📊 **Estados**: Diferentes tipos de notificaciones
- 🖱️ **Interactividad**: Cierre y gestión de notificaciones

### 🎧 Integración con Zendesk
El proyecto incluye un widget de Zendesk para el soporte al cliente, implementado como un componente React reutilizable.

### 💳 Integración con Stripe
El proyecto incluye una integración completa con Stripe para el procesamiento de pagos:

#### ⚙️ Configuración de Stripe
- 🔑 **Clave Pública**: Configurada a través de variables de entorno (`VITE_STRIPE_PUBLISHABLE_KEY`)
- 🧪 **Modo**: Desarrollo con tarjetas de prueba de Stripe
- ⚡ **Funcionalidades**: Checkout sessions, generación de facturas, cálculo de impuestos

#### 🔌 Endpoints de Stripe Consumidos

##### 1️⃣ Crear Checkout Session
**Endpoint:** `POST /api/create-checkout-session`

**Request Body:**
```json
{
  "planId": "starter",
  "planName": "STARTER",
  "amount": 82.16,
  "taxAmount": 3.16,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "state": "California",
  "successUrl": "https://yourdomain.com/compra?success=true&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://yourdomain.com/compra?canceled=true"
}
```

**Response:**
```json
{
  "id": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

##### 2️⃣ Generar Factura
**Endpoint:** `POST /api/generate-invoice`

**Request Body:**
```json
{
  "sessionId": "cs_test_..."
}
```

**Response:**
```json
{
  "invoiceNumber": "INV-2024-001",
  "downloadUrl": "https://yourdomain.com/invoices/INV-2024-001.pdf",
  "amount": 82.16,
  "taxAmount": 3.16,
  "total": 85.32
}
```

#### 🔄 Flujo de Pago con Stripe

1. 👤 **Usuario selecciona plan** en el tercer paso del wizard
2. 🧮 **Se calcula el impuesto** basado en el estado seleccionado
3. 🛒 **Se crea una Checkout Session** en Stripe con los detalles del plan e impuestos
4. 🔀 **Usuario es redirigido** a la página de pago de Stripe
5. ✅ **Después del pago exitoso**, Stripe redirige de vuelta a la aplicación
6. 📄 **Se genera la factura** automáticamente
7. 🎉 **Usuario ve la confirmación** en el paso final del wizard

### 🎨 Componentes de UI
- 🎨 Utiliza Material-UI y PrimeReact para componentes de interfaz de usuario
- 📱 Implementa Bootstrap para el diseño responsivo
- 🎯 Incluye iconos de Bootstrap y React Icons

### 📱 Diseño Responsivo Avanzado
El proyecto incluye un sistema de diseño responsivo completo, especialmente optimizado para los wizards:

#### 🧙‍♂️ Wizards Responsivos
- **Wizard de Pago**: Completamente adaptativo para móviles, tablets y desktop
- **Wizard de Configuración**: Optimizado para todos los tamaños de pantalla
- **Navegación móvil**: Botones de anterior/siguiente adaptativos
- **Formularios**: Campos y validaciones responsivas

#### 📐 Breakpoints Implementados
- **≤ 900px**: Tablets grandes y pantallas medianas
- **≤ 768px**: Tablets y pantallas pequeñas
- **≤ 480px**: Móviles y pantallas muy pequeñas
- **≤ 400px**: Móviles pequeños (ajustes específicos)

#### 🎯 Características Responsivas
- **Títulos y subtítulos**: Tamaños de fuente adaptativos
- **Formularios**: Layouts que cambian de horizontal a vertical
- **Tablas**: Scroll horizontal en móviles
- **Botones**: Tamaños y espaciado adaptativos
- **Imágenes**: Ocultación inteligente en pantallas pequeñas
- **Navegación**: Botones de navegación siempre visibles

### 📊 Manejo de Datos
- 📋 Implementa tablas de datos con @mui/x-data-grid y react-data-table-component
- 🌐 Utiliza Axios para las llamadas HTTP
- 🔔 Incluye notificaciones con react-toastify

### 🧭 Sistema de Navegación Inteligente
El proyecto implementa un sistema de navegación híbrido que combina rutas tradicionales con scroll interno:

#### 🎯 Navegación por Secciones
- **Scroll interno**: Para secciones dentro de la página principal (About, Mission, Vision, Pricing, etc.)
- **Rutas tradicionales**: Para páginas completas (Blog, FAQs, CustomerService, Login, etc.)
- **Persistencia**: Si navegas desde otra página, te lleva a la home y luego hace scroll a la sección

#### 🔧 Implementación
```typescript
const handleSectionNavigation = (sectionId: string) => {
  if (window.location.pathname === '/') {
    // Scroll interno si estamos en la home
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // Navegar a home y guardar sección para scroll posterior
    localStorage.setItem('scrollToSection', sectionId);
    window.location.href = '/';
  }
};
```

#### 📍 Secciones Disponibles
- `about`: Sección Sobre Nosotros
- `mission`: Sección Nuestra Misión
- `vision`: Sección Nuestra Visión
- `choose`: Sección Por Qué Elegirnos
- `pricing`: Sección de Precios y Planes
- `contact`: Sección de Contacto

## 📁 Estructura del Proyecto
```
src/
  ├── components/     # Componentes reutilizables
  │   ├── portales/   # Componentes específicos del portal
  │   │   ├── CallSummaryChart/     # 📈 Gráfica de resumen de llamadas
  │   │   ├── ClientCallsChart/     # 📊 Gráfica de llamadas por cliente
  │   │   ├── DateFilter/           # 📅 Filtro de fechas
  │   │   ├── HeaderPortal/         # 🎯 Header del portal
  │   │   ├── NotificationsPanel/   # 🔔 Panel de notificaciones
  │   │   └── SidebarPortal/        # 🧭 Sidebar de navegación
  │   ├── Wizard/     # 🧙‍♂️ Componentes de wizards
  │   │   ├── WizardContainer.tsx   # 💳 Wizard de pago
  │   │   ├── WizardConfigContainer.tsx # ⚙️ Wizard de configuración
  │   │   ├── ProfileForm.tsx       # 👤 Formulario de perfil
  │   │   ├── BusinessForm.tsx      # 🏢 Formulario de negocio
  │   │   ├── GetStartedForm.tsx    # 🚀 Formulario de inicio
  │   │   └── WizardSidebar.tsx     # 🧭 Sidebar de wizard
  │   ├── nav/        # 🧭 Navegación
  │   ├── header/     # 🎯 Headers
  │   ├── footer/     # 📄 Footer
  │   └── ...         # 📦 Otros componentes
  ├── pages/         # Páginas de la aplicación
  │   ├── DashboardPage.tsx         # 🏠 Dashboard principal
  │   ├── ReporteLlamadasPage.tsx   # 📋 Reporte detallado de llamadas
  │   ├── CompraPage.tsx            # 💳 Página de compra con Stripe
  │   ├── LoginPage.tsx             # 🔐 Página de login
  │   ├── HomePage.tsx              # 🏠 Página principal
  │   ├── BlogPage.tsx              # 📝 Página del blog
  │   ├── FaqsPage.tsx              # ❓ Página de FAQs
  │   ├── CustomerService.tsx       # 🎧 Página de servicio al cliente
  │   └── ...                       # 📄 Otras páginas
  ├── services/      # Servicios y llamadas API
  │   ├── apiService.ts    # 🌐 Servicios principales de API
  │   └── stripeService.ts # 💳 Servicios de Stripe
  ├── locales/       # 🌍 Archivos de traducción
  │   ├── en.json    # 🇺🇸 Traducciones en inglés
  │   └── es.json    # 🇪🇸 Traducciones en español
  ├── context/       # 🔄 Context providers
  │   └── LanguageContext.tsx # 🌍 Contexto de idioma
  ├── hooks/         # 🎣 Custom hooks
  │   ├── useTranslation.ts # 🌍 Hook de traducción
  │   ├── useAuth.ts        # 🔐 Hook de autenticación
  │   ├── useFormValidation.ts # ✅ Hook de validación
  │   └── ...               # 🎣 Otros hooks
  ├── types/         # 📝 Definiciones de tipos TypeScript
  ├── utils/         # 🛠️ Utilidades y funciones auxiliares
  ├── config/        # ⚙️ Configuraciones
  ├── router/        # 🛣️ Configuración de rutas
  └── styles/        # 🎨 Estilos globales
```

### ✅ Sistema de Validación de Formularios
El proyecto incluye un sistema robusto de validación de formularios implementado con un hook personalizado:

#### 🎣 Hook useFormValidation
- **Validación en tiempo real**: Los campos se validan mientras el usuario escribe
- **Múltiples tipos de validación**: Required, email, phone, select, text
- **Manejo de errores**: Mensajes de error personalizados y traducidos
- **Estados visuales**: Campos válidos/inválidos con estilos diferenciados
- **Persistencia**: Los datos se mantienen al navegar entre pasos del wizard

#### 🔧 Tipos de Validación Soportados
```typescript
type FieldType = 'required' | 'email' | 'phone' | 'select' | 'text';

interface ValidationConfig {
  initialFields: Record<string, string>;
  fieldTypes: Record<string, FieldType>;
}
```

#### 📝 Uso en Componentes
```typescript
const validation = useFormValidation({
  initialFields: {
    name: '',
    email: '',
    phone: ''
  },
  fieldTypes: {
    name: 'required',
    email: 'email',
    phone: 'phone'
  }
});
```

## 🔌 Consumo de Endpoints

### 🔐 Autenticación OAuth2
El proyecto utiliza autenticación OAuth2 con `client_credentials`:

```typescript
// Endpoint: POST /oauth/auth/token
// Grant Type: client_credentials
// Client ID: frontend-app
// Client Secret: frontend-secret-key-2024-super-secure
```

### 🌐 Endpoints Principales Consumidos

#### 🌍 1. Gestión de Ubicaciones
- 🏳️ **Países**: `GET /api/countries` - Obtiene lista de países disponibles
- 🏛️ **Estados**: `GET /api/states` - Obtiene estados por país
- 🏙️ **Ciudades**: `GET /api/cities` - Obtiene ciudades por estado

#### 📋 2. Gestión de Planes
- 📦 **Planes**: `GET /api/plans` - Obtiene todos los planes disponibles
- 💳 **Planes con Stripe**: `GET /api/plans-with-stripe` - Obtiene planes con IDs de Stripe

#### 🧮 3. Cálculo de Impuestos
- 💰 **Cálculo**: `POST /api/calculate-tax` - Calcula impuestos basado en ubicación

#### 📞 4. Gestión de Llamadas (Dashboard)
- 📊 **Resumen de Llamadas**: `GET /api/calls/summary` - Obtiene resumen de llamadas por período
  - 📊 **Datos**: Fecha, número de llamadas, minutos totales, duración promedio
  - 📈 **Uso**: Gráfica de área en CallSummaryChart
- 👥 **Llamadas por Cliente**: `GET /api/calls/client-calls` - Obtiene llamadas agrupadas por cliente
  - 👥 **Datos**: Cliente, llamadas del día, minutos totales, duración promedio
  - 📊 **Uso**: Gráfica de barras en ClientCallsChart
- 📋 **Registros de Llamadas**: `GET /api/calls/records` - Obtiene registros detallados de llamadas
  - 📋 **Datos**: Información completa de cada llamada
  - 📊 **Uso**: Tabla de datos en ReporteLlamadasPage
  - 📄 **Paginación**: Soporte para paginación y filtros

#### 🔐 5. Autenticación de Usuarios
- 🔑 **Login**: `POST /api/auth/login` - Autenticación con JWT
- ✅ **Verificación**: `GET /api/auth/verify` - Verifica token JWT

### ⚙️ Configuración de API
- 🌐 **Base URL**: En desarrollo usa proxy local, en producción usa `https://myassist-me.com`
- ⏱️ **Timeout**: 10 segundos por defecto
- 🔄 **Retry**: Máximo 3 intentos con delay exponencial
- 📋 **Headers**: Content-Type: application/json

### 🛡️ Manejo de Errores
- 🔄 **Retry automático** para errores 5xx y timeouts
- 📝 **Logging estructurado** para debugging
- ✅ **Validación de respuestas** con TypeScript interfaces
- 🚫 **Cancelación de requests** con CancelToken

## 📊 Funcionalidades del Dashboard

### 📈 Visualizaciones de Datos
1. **📈 Gráfica de Resumen de Llamadas**
   - 🎯 Tipo: Área chart con Recharts
   - 📊 Métricas: Llamadas por día, minutos totales, duración promedio
   - 🖱️ Interactividad: Tooltips, zoom, hover effects
   - 🔢 Formato: Valores formateados (K, Mill)

2. **📊 Gráfica de Llamadas por Cliente**
   - 📊 Tipo: Bar chart con Recharts
   - 👥 Métricas: Llamadas agrupadas por cliente y día
   - ⚠️ Limitación: Máximo 6 clientes para evitar saturación
   - 🎨 Colores: Diferenciados por cliente

3. **📋 Tabla de Registros de Llamadas**
   - 📊 Componente: react-data-table-component
   - ⚡ Funcionalidades: Paginación, filtros, búsqueda, exportación
   - 📋 Datos: Información completa de cada llamada
   - 📤 Exportación: Excel (XLSX)

### 🔍 Filtros y Navegación
- 📅 **Filtro de Fechas**: Selección de rangos personalizados
- 🔍 **Búsqueda**: Filtrado por cliente, agente, tipo de llamada
- 📄 **Paginación**: Navegación por páginas con tamaño configurable
- 📤 **Exportación**: Funcionalidad para exportar datos a Excel

### 🔐 Autenticación y Seguridad
- 🔑 **JWT Token**: Verificación automática de autenticación
- 🛡️ **Protección de Rutas**: Acceso restringido a usuarios autenticados
- ⏰ **Manejo de Sesiones**: Gestión de tokens y logout
- ✅ **Validación**: Verificación de permisos y datos

## 💳 Configuración de Stripe

### 🔧 Variables de Entorno Requeridas
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### ⚙️ Configuración en el Backend
El backend debe tener configurado:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 🌐 URLs de Desarrollo
Para desarrollo local, las URLs de éxito y cancelación apuntan a la aplicación:
```typescript
successUrl: `${window.location.origin}/compra?success=true&session_id={CHECKOUT_SESSION_ID}`,
cancelUrl: `${window.location.origin}/compra?canceled=true`,
```

## 🛡️ Consideraciones de Seguridad

### 💳 Stripe
- 🔒 **Nunca expongas la clave secreta** en el frontend
- ✅ **Valida todos los datos** en el backend antes de crear la sesión
- 🔐 **Usa HTTPS** en producción
- 🔔 **Implementa webhooks** para manejar eventos de pago de forma asíncrona
- 💾 **Guarda los datos de pago** en tu base de datos para auditoría

### 🌐 API
- 🔐 **Autenticación OAuth2** con client_credentials
- 🔑 **Tokens JWT** para autenticación de usuarios
- ✅ **Validación de respuestas** en el frontend
- 🛡️ **Manejo seguro de errores** sin exponer información sensible

## 🔧 Solución de Problemas

### ❌ Error: "Price is not available to be purchased because its product is not active"

#### 🔍 Causa
Este error ocurre cuando:
1. 🚫 El producto en Stripe está marcado como inactivo
2. 🔗 El price ID está asociado a un producto que no existe o está deshabilitado
3. 🔄 Los price IDs en el código no coinciden con los configurados en Stripe

#### ✅ Solución
1. **🔍 Verificar Productos en Stripe Dashboard**
   - Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navega a **Products** en el menú lateral
   - Verifica que todos los productos estén marcados como **Active**

2. **🔑 Verificar Price IDs**
   - En el dashboard de Stripe, ve a **Products**
   - Selecciona cada producto y verifica los **Pricing** asociados
   - Copia los price IDs correctos (formato: `price_xxxxxxxxxxxxx`)
   - Actualiza el archivo `src/services/stripeService.ts`

3. **⚙️ Verificar Configuración de Productos**
   - ✅ **Status**: Active
   - ✅ **Pricing**: Al menos un price configurado
   - ✅ **Recurring**: Configurado correctamente para suscripciones
   - ✅ **Tax behavior**: Configurado según tus necesidades

### 🐛 Problemas Comunes del Dashboard

#### 📊 Gráficas no cargan datos
1. 🔐 **Verificar autenticación**: Asegúrate de estar logueado
2. 👤 **Verificar userId**: El ID del usuario debe estar en localStorage
3. 📅 **Verificar fechas**: Las fechas deben ser válidas y en formato correcto
4. 🌐 **Verificar API**: Revisar logs de la consola para errores de API

#### 📋 Tabla de datos no se actualiza
1. 🔍 **Verificar filtros**: Los filtros pueden estar limitando los resultados
2. 📄 **Verificar paginación**: Cambiar de página o tamaño de página
3. 🔍 **Verificar búsqueda**: Limpiar términos de búsqueda
4. 🔐 **Verificar permisos**: Asegúrate de tener permisos para ver los datos

## 🚀 Desarrollo
Para comenzar a desarrollar:

1. **🏃‍♂️ Inicia el servidor de desarrollo:**
```bash
npm run dev
```

2. **🌐 Abre [http://localhost:5173](http://localhost:5173) en tu navegador**

## 🏗️ Construcción para Producción
Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos de construcción se generarán en el directorio `dist/`.

## 🔍 Linting
El proyecto utiliza ESLint para mantener la calidad del código. Para ejecutar el linter:

```bash
npm run lint
```

## 🤝 Contribución
1. 🌿 Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
2. 💾 Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. 📤 Push a la rama (`git push origin feature/AmazingFeature`)
4. 🔄 Abre un Pull Request

## 📄 Licencia
Este proyecto es privado y su uso está restringido a los términos establecidos por la organización.
