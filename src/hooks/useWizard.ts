import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomerData, TaxCalculation, WizardStep } from '../types';
import { PricingPlan, calculateTaxWithAPI } from '../services/apiService';
import { useErrorHandler } from './useErrorHandler';

const DEFAULT_STEPS: WizardStep[] = [
  { label: 'PROFILE', description: 'First tell us a little about yourself' },
  { label: 'BUSINESS', description: 'That you are requesting services for' },
  { label: 'SUMMARY', description: 'Review your plan and details' },
  { label: 'GET STARTED', description: 'Let\'s get started setting up your account' },
];

interface UseWizardProps {
  selectedPlan?: PricingPlan;
  onStepChange?: (step: number) => void;
  onConfigWizardRequest?: () => void;
}

export const useWizard = ({ 
  selectedPlan, 
  onStepChange, 
  onConfigWizardRequest 
}: UseWizardProps) => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);
  const [loadingTax, setLoadingTax] = useState(false);
  
  const { handleError } = useErrorHandler();

  // Notificar cambios de paso al componente padre
  useEffect(() => {
    console.log('Wizard - currentStep changed to:', currentStep);
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Calcular tax usando el API cuando cambie el estado o el plan
  useEffect(() => {
    if (customerData?.state && selectedPlan) {
      setLoadingTax(true);
      calculateTaxWithAPI(selectedPlan.price, 'US', customerData.state, '33101')
        .then((calculation) => {
          setTaxCalculation(calculation);
        })
        .catch((error) => {
          handleError(error, {
            component: 'useWizard',
            action: 'calculateTax',
            additionalInfo: { state: customerData.state, planPrice: selectedPlan.price }
          });
          setTaxCalculation(null);
        })
        .finally(() => {
          setLoadingTax(false);
        });
    } else {
      setTaxCalculation(null);
    }
  }, [customerData?.state, selectedPlan, handleError]);

  // Detectar pago exitoso y ir al paso 4
  useEffect(() => {
    const isSuccess = searchParams.get('success') === 'true';
    const sessionId = searchParams.get('session_id');
    
    if (isSuccess && sessionId) {
      console.log('🔑 Stripe session_id después del pago:', sessionId);
      setCurrentStep(3); // Paso 4 (índice 3)
      
      // Limpiar los parámetros de URL para evitar que se ejecute múltiples veces
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('session_id');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const nextStep = useCallback(() => {
    // Si estamos en el último paso (paso 4), activar el wizard de configuración
    if (currentStep === DEFAULT_STEPS.length - 1) {
      if (onConfigWizardRequest) {
        onConfigWizardRequest();
      }
      return;
    }
    
    // FORZAR: Si estamos en el paso 3 (Order Summary) y estamos en desarrollo, avanzar directo al paso 4
    if (currentStep === 2 && import.meta.env.DEV) {
      setCurrentStep(3);
      return;
    }
    
    // Si estamos en el paso 2 y vamos al resumen, solo avanza
    if (currentStep === 2) {
      setCurrentStep((prev) => (prev < DEFAULT_STEPS.length - 1 ? prev + 1 : prev));
      return;
    }
    
    const form = document.querySelector('.wizard-form') as HTMLFormElement;
    if (form) {
      const event = new Event('submit', { cancelable: true, bubbles: true });
      const isValid = form.dispatchEvent(event);
      if (isValid) {
        setCurrentStep((prev) => (prev < DEFAULT_STEPS.length - 1 ? prev + 1 : prev));
      }
    }
  }, [currentStep, onConfigWizardRequest]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const updateProfileData = useCallback((data: { name: string; email: string }) => {
    setCustomerData(prev => ({ 
      name: data.name, 
      email: data.email, 
      state: prev?.state || '' 
    }));
  }, []);

  const updateBusinessData = useCallback((data: { state: string; phone_code?: string }) => {
    setCustomerData(prev => ({ 
      name: prev?.name || '', 
      email: prev?.email || '', 
      state: data.state,
      phone_code: data.phone_code || prev?.phone_code
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < DEFAULT_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  return {
    // Estado
    currentStep,
    customerData,
    taxCalculation,
    loadingTax,
    steps: DEFAULT_STEPS,
    
    // Acciones
    nextStep,
    prevStep,
    goToStep,
    updateProfileData,
    updateBusinessData,
    
    // Utilidades
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === DEFAULT_STEPS.length - 1,
    canGoNext: currentStep < DEFAULT_STEPS.length - 1,
    canGoPrev: currentStep > 0,
  };
}; 