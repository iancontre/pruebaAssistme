import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../services/stripeService';
import WizardSidebar from './WizardSidebar';
import ProfileForm from './ProfileForm';
import BusinessForm from './BusinessForm';
import GetStartedForm from './GetStartedForm';
import prevIcon from '../../assets/images/icons/prevIcon.png';
import nexicon from '../../assets/images/icons/nexicon.png';
import { BsCreditCard } from 'react-icons/bs';
import { PricingPlan } from '../../services/taxService';
import { createCheckoutSession } from '../../services/stripeService';
import { calculateTax, formatCurrency } from '../../services/taxService';
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
}

interface WizardContainerProps {
  selectedPlan?: PricingPlan;
  onStepChange?: (step: number) => void;
}

const WizardContainer: React.FC<WizardContainerProps> = ({ selectedPlan, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Notificar cambios de paso al componente padre
  useEffect(() => {
    console.log('WizardContainer - currentStep changed to:', currentStep);
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const handleNextStep = async () => {
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

  const handleBusinessData = (data: { state: string }) => {
    setCustomerData(prev => ({ 
      name: prev?.name || '', 
      email: prev?.email || '', 
      state: data.state 
    }));
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan) {
      toast.error('No plan selected. Please try again.');
      return;
    }
    
    // Si no hay customerData, usar datos por defecto o mostrar error
    if (!customerData?.email || !customerData?.name) {
      toast.error('Please complete your profile information first.');
      return;
    }
    
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
      toast.error('Failed to proceed to payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (data: any) => {
    setPaymentData(data);
    setCurrentStep(3); // Ir al paso final
  };

  // Paso 3: Resumen del plan y botón para ir a pagar
  const renderSummaryStep = () => {
    console.log('renderSummaryStep - selectedPlan:', selectedPlan, 'customerData:', customerData);
    
    if (!selectedPlan) {
      console.log('No selectedPlan available');
      return <div>No plan selected</div>;
    }
    
    const subtotal = selectedPlan.price;
    const taxAmount = customerData?.state ? calculateTax(subtotal, customerData.state) : 0;
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
          {customerData?.state && (
            <div className="tax-breakdown">
              <div className="breakdown-item">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="breakdown-item">
                <span>Tax ({customerData.state})</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="breakdown-item total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}
          {!customerData?.state && (
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
        return <ProfileForm onValidityChange={() => {}} onDataChange={handleProfileData} />;
      case 1:
        return <BusinessForm onValidityChange={() => {}} onDataChange={handleBusinessData} selectedPlan={selectedPlan} />;
      case 2:
        return renderSummaryStep();
      case 3:
        return <GetStartedForm onValidityChange={() => {}} paymentData={paymentData} onPaymentSuccess={handlePaymentSuccess} />;
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
              <button className="wizard-prev-btn-circular" onClick={handlePrevStep}>
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