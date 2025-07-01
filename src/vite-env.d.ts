/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRONTEND_SECRET_KEY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_STATIC_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declaraciones para archivos de imagen
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.PNG' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}
