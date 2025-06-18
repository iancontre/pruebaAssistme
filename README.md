# Proyecto Frontend

## Descripción
Este es un proyecto frontend desarrollado con React y TypeScript, utilizando Vite como herramienta de construcción. El proyecto incluye integración con Zendesk para el soporte al cliente y utiliza varias bibliotecas modernas para la interfaz de usuario.

## Tecnologías Principales
- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- PrimeReact
- React Router DOM
- Bootstrap
- Axios

## Requisitos Previos
- Node.js (versión recomendada: 18 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye el proyecto para producción
- `npm run lint` - Ejecuta el linter para verificar el código
- `npm run preview` - Previsualiza la versión de producción localmente

## Características Principales

### Integración con Zendesk
El proyecto incluye un widget de Zendesk para el soporte al cliente, implementado como un componente React reutilizable.

### Componentes de UI
- Utiliza Material-UI y PrimeReact para componentes de interfaz de usuario
- Implementa Bootstrap para el diseño responsivo
- Incluye iconos de Bootstrap y React Icons

### Manejo de Datos
- Implementa tablas de datos con @mui/x-data-grid y react-data-table-component
- Utiliza Axios para las llamadas HTTP
- Incluye notificaciones con react-toastify

## Estructura del Proyecto
```
src/
  ├── components/     # Componentes reutilizables
  ├── pages/         # Páginas de la aplicación
  ├── services/      # Servicios y llamadas API
  ├── types/         # Definiciones de tipos TypeScript
  └── utils/         # Utilidades y funciones auxiliares
```

## Desarrollo
Para comenzar a desarrollar:

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

## Construcción para Producción
Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos de construcción se generarán en el directorio `dist/`.

## Linting
El proyecto utiliza ESLint para mantener la calidad del código. Para ejecutar el linter:

```bash
npm run lint
```

## Contribución
1. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
2. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

## Licencia
Este proyecto es privado y su uso está restringido a los términos establecidos por la organización.
