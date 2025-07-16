import { useState, useCallback } from 'react';
import { PricingPlan } from '../services/apiService';
import { createCheckoutSession } from '../services/stripeService';
import { useErrorHandler } from './useErrorHandler';

interface CustomerData {
  name: string;
  email: string;
  state: string;
  phone_code?: string;
}

interface PaymentRequest {
  plan: PricingPlan;
  customerData: CustomerData;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const processPayment = useCallback(async ({ plan, customerData }: PaymentRequest) => {
    if (!customerData || !plan) {
      handleError(new Error('Datos incompletos'), {
        component: 'usePayment',
        action: 'processPayment',
        additionalInfo: { hasCustomerData: !!customerData, hasPlan: !!plan }
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Procesando pago:', {
        plan: plan.name,
        customer: customerData,
        amount: plan.price
      });

      await createCheckoutSession({
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        customerEmail: customerData.email,
        customerName: customerData.name,
        successUrl: `${window.location.origin}/compra?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/compra?canceled=true`,
      });

      handleSuccess('Redirigiendo al procesador de pagos...');
    } catch (error) {
      handleError(error, {
        component: 'usePayment',
        action: 'processPayment',
        additionalInfo: { planName: plan.name, customerEmail: customerData.email }
      });
    } finally {
      setIsProcessing(false);
    }
  }, [handleError, handleSuccess]);

  return {
    processPayment,
    isProcessing,
  };
}; 