import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import WizardSidebar from './WizardSidebar';
import ProfileForm from './ProfileForm';
import BusinessForm from './BusinessForm';
import GetStartedForm from './GetStartedForm';
import prevIcon from '../../assets/images/icons/prevIcon.png';
import nexicon from '../../assets/images/icons/nexicon.png';
import { BsCreditCard } from 'react-icons/bs';
import { PricingPlan, formatCurrency } from '../../services/apiService';
import { calculateTaxWithAPI } from '../../services/apiService';
import { createCheckoutSession } from '../../services/stripeService';
import { toast } from 'react-toastify';

const steps = [
  { label: 'PROFILE', description: 'First tell us a little about yourself' },
  { label: 'BUSINESS', description: 'That you are requesting services for' },
  { label: 'SUMMARY', description: 'Review your plan and details' },
  { label: 'GET STARTED', description: `Let's get started setting up your account` },
];

interface CustomerData {
  name: string;
  email: string;
  state: string;
  phone_code?: string;
}

interface WizardContainerProps {
  selectedPlan?: PricingPlan;
  onStepChange?: (step: number) => void;
  onConfigWizardRequest?: () => void;
}

const WizardContainer: React.FC<WizardContainerProps> = ({ selectedPlan, onStepChange, onConfigWizardRequest }) => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taxCalculation, setTaxCalculation] = useState<any>(null);
  const [loadingTax, setLoadingTax] = useState(false);

  // Notificar cambios de paso al componente padre
  useEffect(() => {
    console.log('WizardContainer - currentStep changed to:', currentStep);
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
          console.error('Error calculating tax:', error);
          setTaxCalculation(null);
        })
        .finally(() => {
          setLoadingTax(false);
        });
    } else {
      setTaxCalculation(null);
    }
  }, [customerData?.state, selectedPlan]);

  // Detectar pago exitoso y ir al paso 4
  useEffect(() => {
    const isSuccess = searchParams.get('success') === 'true';
    const sessionId = searchParams.get('session_id');
    
    if (isSuccess && sessionId) {
      console.log('🔑 Stripe session_id después del pago:', sessionId); // <-- Mostrar en consola
      setCurrentStep(3); // Paso 4 (índice 3)
      
      // Limpiar los parámetros de URL para evitar que se ejecute múltiples veces
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('session_id');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleNextStep = async () => {
    // Si estamos en el último paso (paso 4), activar el wizard de configuración
    if (currentStep === steps.length - 1) {
      if (onConfigWizardRequest) {
        onConfigWizardRequest();
      }
      return;
    }
    
    // FORZAR: Si estamos en el paso 3 (Order Summary) y estamos en desarrollo, avanzar directo al paso 4 y salir
    if (currentStep === 2 && import.meta.env.DEV) {
      setCurrentStep(3);
      return;
    }
    // Si estamos en el paso 2 y vamos al resumen, solo avanza
    if (currentStep === 2) {
      // No hacer nada especial, solo avanzar
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      return;
    }
    const form = document.querySelector('.wizard-form') as HTMLFormElement;
    if (form) {
      const event = new Event('submit', { cancelable: true, bubbles: true });
      const isValid = form.dispatchEvent(event);
      if (isValid) {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleProfileData = (data: { name: string; email: string }) => {
    setCustomerData(prev => ({ 
      name: data.name, 
      email: data.email, 
      state: prev?.state || '' 
    }));
  };

  const handleBusinessData = (data: { state: string; phone_code?: string }) => {
    setCustomerData(prev => ({ 
      name: prev?.name || '', 
      email: prev?.email || '', 
      state: data.state,
      phone_code: data.phone_code || prev?.phone_code
    }));
  };

  const handleProceedToPayment = async () => {
    if (!customerData || !selectedPlan) {
      toast.error('Please complete all required information.');
      return;
    }

    console.log('Proceeding to payment with:', {
      plan: selectedPlan.name,
      customer: customerData,
      id: selectedPlan.id,
      name: selectedPlan.name,
      price: selectedPlan.price,
      customerEmail: customerData.email,
      customerName: customerData.name
    });
    
    setIsProcessing(true);
    try {
      // Crear Checkout Session con Stripe Tax automático
      await createCheckoutSession({
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price, // Stripe calculará automáticamente los impuestos
        customerEmail: customerData.email,
        customerName: customerData.name,
        successUrl: `${window.location.origin}/compra?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/compra?canceled=true`,
      });
    } catch (error) {
      console.error('Payment error:', error);
      
      // Mostrar mensajes de error más específicos
      let errorMessage = 'Failed to proceed to payment. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('unavailable') || error.message.includes('not active')) {
          errorMessage = 'This plan is currently unavailable. Please contact support or try a different plan.';
        } else if (error.message.includes('configuration error')) {
          errorMessage = 'There was an issue with the payment setup. Please contact support.';
        } else if (error.message.includes('Payment setup failed')) {
          errorMessage = error.message;
        } else if (error.message.includes('Card error')) {
          errorMessage = 'There was an issue with the payment method. Please try again.';
        } else if (error.message.includes('Invalid request')) {
          errorMessage = 'Invalid payment request. Please refresh the page and try again.';
        }
      }
      
      toast.error(errorMessage);
      
              // Si es un error de producto no activo, mostrar información adicional
        if (error instanceof Error && error.message.includes('not active')) {
          console.warn('Product not active error detected. Please check Stripe dashboard.');
          // Opcional: mostrar un modal con información adicional
          setTimeout(() => {
            toast.info('If this issue persists, please contact our support team.');
          }, 2000);
        }
    } finally {
      setIsProcessing(false);
    }
  };

  // Paso 3: Resumen del plan y botón para ir a pagar
  const renderSummaryStep = () => {
    console.log('renderSummaryStep - selectedPlan:', selectedPlan, 'customerData:', customerData);
    
    if (!selectedPlan) {
      console.log('No selectedPlan available');
      return <div>No plan selected</div>;
    }
    
    const subtotal = selectedPlan.price;
    const taxAmount = taxCalculation?.tax_amount || 0;
    const total = subtotal + taxAmount;
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div className="plan-summary-card" style={{ maxWidth: 900, width: '100%', marginLeft: '10rem' }}>
          <div className="plan-summary-header">
            <h4>Order Summary</h4>
            <div className="plan-badge">{selectedPlan.name}</div>
          </div>
          <div className="plan-details">
            <div className="plan-item">
              <span>{selectedPlan.minutes} minutes included</span>
              <span>{formatCurrency(selectedPlan.price)}</span>
            </div>
            <div className="plan-item">
              <span>Additional minutes</span>
              <span>${selectedPlan.addMinuteRate}/min</span>
            </div>
          </div>
          {customerData?.state ? (
            <div className="tax-breakdown">
              <div className="breakdown-item">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="breakdown-item">
                <span>Tax ({customerData.state})</span>
                <span>
                  {loadingTax ? (
                    <span style={{ color: '#8DA9C9' }}>Calculating...</span>
                  ) : (
                    formatCurrency(taxAmount)
                  )}
                </span>
              </div>
              <div className="breakdown-item total">
                <span>Total</span>
                <span>
                  {loadingTax ? (
                    <span style={{ color: '#8DA9C9' }}>Calculating...</span>
                  ) : (
                    formatCurrency(total)
                  )}
                </span>
              </div>
              {taxCalculation && (
                <div className="tax-note">
                  <p>
                    💡 <strong>Note:</strong> Tax rate: {(taxCalculation.tax_rate * 100).toFixed(2)}% 
                    based on your location. Final amount will be confirmed on the payment page.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="tax-breakdown">
              <div className="breakdown-item">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="breakdown-item">
                <span>Tax</span>
                <span>Will be calculated during checkout</span>
              </div>
              <div className="breakdown-item total">
                <span>Total</span>
                <span>{formatCurrency(subtotal)} + Tax</span>
              </div>
            </div>
          )}
          <div className="plan-features">
            <h5>What's included:</h5>
            <ul>
              <li>✓ No Setup Fees</li>
              <li>✓ 100% Bilingual</li>
              <li>✓ 24/7/365 Answering</li>
              <li>✓ Advanced Features</li>
            </ul>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button
              className="wizard-next-btn"
              onClick={handleProceedToPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : (
                <>
                  Pay Now <BsCreditCard style={{ color: '#0F384C', width: 20, height: 20 }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar el contenido del paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 0:   
        return <ProfileForm 
          onValidityChange={() => {}} 
          onDataChange={handleProfileData} 
          onValid={() => setCurrentStep(1)}
        />;
      case 1:
        return <BusinessForm onValidityChange={() => {}} onDataChange={handleBusinessData} selectedPlan={selectedPlan} onValid={() => setCurrentStep(2)} />;
      case 2:
        return renderSummaryStep();
      case 3:
        return <GetStartedForm />;
      default:
        return null;
    }
  };

  return (
    <div className="wizard-main-layout">
      <WizardSidebar 
        steps={steps} 
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
      />
      <div className="wizard-content">
        <div className="wizard-form-container">
          <div className="wizard-form-foreground">
            {renderStep()}
          </div>
          <div className="wizard-navigation mobile">
            {currentStep > 0 && currentStep < 3 && (
              <button className="wizard-prev-btn-circular" onClick={handlePrevStep} style={{ display: currentStep === 3 ? 'none' : undefined }}>
                <img src={prevIcon} alt="Previous" style={{ width: 24, height: 24 }} />
              </button>
            )}
            {currentStep < 2 && (
              <button className="wizard-next-btn" onClick={handleNextStep}>
                Next Step <img src={nexicon} alt="Next" style={{ width: 24, height: 24 }} />
              </button>
            )}
            {/* El botón de Go to Payment está en el paso 3, dentro del resumen */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardContainer; 