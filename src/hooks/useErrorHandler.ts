import { useCallback } from 'react';
import { toast } from 'react-toastify';

export interface ErrorContext {
  component: string;
  action: string;
  additionalInfo?: Record<string, any>;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context: ErrorContext) => {
    console.error(`Error in ${context.component} during ${context.action}:`, error, context.additionalInfo);
    
    let userMessage = 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
    
    if (error instanceof Error) {
      // Manejar errores específicos
      if (error.message.includes('network') || error.message.includes('fetch')) {
        userMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
        userMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.message.includes('payment') || error.message.includes('stripe')) {
        userMessage = 'Error en el procesamiento del pago. Verifica tus datos.';
      } else if (error.message.includes('validation')) {
        userMessage = 'Datos inválidos. Verifica la información ingresada.';
      } else {
        userMessage = error.message;
      }
    }
    
    // Mostrar notificación al usuario
    toast.error(userMessage, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Aquí podrías enviar el error a un servicio de logging
    // logErrorToService(error, context);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const handleWarning = useCallback((message: string) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  return {
    handleError,
    handleSuccess,
    handleWarning,
  };
}; 