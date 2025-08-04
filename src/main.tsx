import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/apiConfig' // Importar configuración de API
import 'bootstrap/dist/css/bootstrap.min.css'


// Renderizar la aplicación directamente
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
