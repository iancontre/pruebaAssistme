import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { initializeAuth } from './services/api'

// Inicializar autenticación antes de renderizar la aplicación
const initApp = async () => {
  try {
    console.log('Inicializando aplicación...');
    await initializeAuth();
    console.log('Aplicación inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando aplicación:', error);
  }
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

initApp();
