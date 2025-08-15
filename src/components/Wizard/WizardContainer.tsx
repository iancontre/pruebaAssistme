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
import { fetchActiveRole } from '../../services/apiService';
import { calculateTaxWithAPI } from '../../services/apiService';
import { createCheckoutSession } from '../../services/stripeService';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from '../../hooks/useTranslation';

interface WizardContainerProps {
  selectedPlan?: PricingPlan;
  onStepChange?: (step: number) => void;
  onConfigWizardRequest?: () => void;
  onWizardComplete?: (data: any) => void; // NUEVO
}

const WizardContainer: React.FC<WizardContainerProps> = ({ selectedPlan, onStepChange, onConfigWizardRequest, onWizardComplete }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const steps = [
    { label: t('wizard.steps.profile.label'), description: t('wizard.steps.profile.description') },
    { label: t('wizard.steps.business.label'), description: t('wizard.steps.business.description') },
    { label: t('wizard.steps.summary.label'), description: t('wizard.steps.summary.description') },
    { label: t('wizard.steps.getStarted.label'), description: t('wizard.steps.getStarted.description') },
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [customerData, setCustomerData] = useState<any>({});
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
      setCurrentStep(3); // Paso 4 (índice 3)
      
      // Limpiar los parámetros de URL para evitar que se ejecute múltiples veces
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('session_id');
      window.history.replaceState({}, '', newUrl.toString());

      // NUEVO: Llama al padre con todos los datos
      if (onWizardComplete && customerData && selectedPlan) {
        onWizardComplete({
          customerData,
          selectedPlan,
          session_id: sessionId,
        });
      }
    }
  }, [searchParams, customerData, selectedPlan, onWizardComplete]);

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

  // Combina los datos de perfil y negocio en customerData
  const handleProfileData = (data: any) => {
    setCustomerData((prev: any) => ({ 
      ...prev, 
      fullName: data.fullName,
      lastName: data.lastName,
      companyName: data.companyName,
      officeNumber: data.officeNumber,
      email: data.email,
      industry: data.industry,
      heardAbout: data.heardAbout
    }));
  };
  const handleBusinessData = (data: any) => {
    setCustomerData((prev: any) => ({ 
      ...prev, 
      company: data.company,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      mobileNumber: data.mobileNumber
    }));
  };

  // Guardar datos en localStorage antes de redirigir a Stripe
  const handleProceedToPayment = async () => {
    if (!customerData || !selectedPlan) {
      toast.error(t('wizard.errors.completeRequiredInfo'));
      return;
    }
    setIsProcessing(true);
    try {
      let role_id = '';
      try {
        role_id = await fetchActiveRole();
      } catch (e) {
        toast.error(t('wizard.errors.roleError'));
        setIsProcessing(false);
        return;
      }

      // GUARDA el role_id en customerData antes de guardar en localStorage
      const customerDataWithRole = { ...customerData, role_id };

      localStorage.setItem('wizard_customerData', JSON.stringify(customerDataWithRole));
      localStorage.setItem('wizard_selectedPlan', JSON.stringify(selectedPlan));

      await createCheckoutSession({
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        customerEmail: customerData.email,
        customerName: customerData.fullName || customerData.name || '',
        state: customerData.state || '',
        country: customerData.country || '',
        successUrl: `${window.location.origin}/compra?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/compra?canceled=true`,
      });
      
    } catch (error) {
      console.error('❌ ERROR EN createCheckoutSession:', error);
      
      // Mostrar mensajes de error más específicos
      let errorMessage = t('wizard.errors.paymentFailed');
      
      if (error instanceof Error) {
        if (error.message.includes('unavailable') || error.message.includes('not active')) {
          errorMessage = t('wizard.errors.planUnavailable');
        } else if (error.message.includes('configuration error')) {
          errorMessage = t('wizard.errors.paymentSetupError');
        } else if (error.message.includes('Payment setup failed')) {
          errorMessage = error.message;
        } else if (error.message.includes('Card error')) {
          errorMessage = t('wizard.errors.paymentMethodError');
        } else if (error.message.includes('Invalid request')) {
          errorMessage = t('wizard.errors.invalidRequest');
        }
      }
      
      toast.error(errorMessage);
      
      // Si es un error de producto no activo, mostrar información adicional
      if (error instanceof Error && error.message.includes('not active')) {
        console.warn('Product not active error detected. Please check Stripe dashboard.');
        // Opcional: mostrar un modal con información adicional
        setTimeout(() => {
          toast.info(t('wizard.errors.contactSupport'));
           }, 2000);
        }
    } finally {
      setIsProcessing(false);
    }
  };

  // Recuperar datos de localStorage tras el pago
  useEffect(() => {
    const isSuccess = searchParams.get('success') === 'true';
    const sessionId = searchParams.get('session_id');
    let customer = customerData;
    let plan = selectedPlan;
    if (!customer || Object.keys(customer).length === 0) {
      const stored = localStorage.getItem('wizard_customerData');
      if (stored) customer = JSON.parse(stored);
    }
    if (!plan) {
      const stored = localStorage.getItem('wizard_selectedPlan');
      if (stored) plan = JSON.parse(stored);
    }
    if (isSuccess && sessionId) {
      setCurrentStep(3);
      if (onWizardComplete && customer && plan) {
        onWizardComplete({
          customerData: customer,
          selectedPlan: plan,
          session_id: sessionId,
        });
        localStorage.removeItem('wizard_customerData');
        localStorage.removeItem('wizard_selectedPlan');
      } else {
        console.warn('No se pudo llamar a onWizardComplete porque falta customerData o selectedPlan');
      }
      // Limpiar la URL...
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      newUrl.searchParams.delete('session_id');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, customerData, selectedPlan, onWizardComplete]);

  // Paso 3: Resumen del plan y botón para ir a pagar
  const renderSummaryStep = () => {
    console.log('renderSummaryStep - selectedPlan:', selectedPlan, 'customerData:', customerData);
    
         if (!selectedPlan) {
       console.log('No selectedPlan available');
       return <div>{t('wizard.errors.noPlanSelected')}</div>;
     }
    
    const subtotal = selectedPlan.price;
    const taxAmount = taxCalculation?.tax_amount || 0;
    const total = subtotal + taxAmount;
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                 <div className="plan-summary-card" style={{ maxWidth: 900, width: '100%', marginLeft: '10rem' }}>
           <div className="plan-summary-header">
             <h4>{t('wizard.summary.orderSummary')}</h4>
             <div className="plan-badge">{selectedPlan.name}</div>
           </div>
           <div className="plan-details">
             <div className="plan-item">
               <span>{selectedPlan.minutes} {t('wizard.summary.minutesIncluded')}</span>
               <span>{formatCurrency(selectedPlan.price)}</span>
             </div>
             <div className="plan-item">
               <span>{t('wizard.summary.additionalMinutes')}</span>
               <span>${selectedPlan.addMinuteRate}/min</span>
             </div>
           </div>
                     {customerData?.state ? (
             <div className="tax-breakdown">
               <div className="breakdown-item">
                 <span>{t('wizard.summary.subtotal')}</span>
                 <span>{formatCurrency(subtotal)}</span>
               </div>
               <div className="breakdown-item">
                 <span>{t('wizard.summary.tax')} ({customerData.state})</span>
                 <span>
                   {loadingTax ? (
                     <span style={{ color: '#8DA9C9' }}>{t('wizard.summary.calculating')}</span>
                   ) : (
                     formatCurrency(taxAmount)
                   )}
                 </span>
               </div>
               <div className="breakdown-item total">
                 <span>{t('wizard.summary.total')}</span>
                 <span>
                   {loadingTax ? (
                     <span style={{ color: '#8DA9C9' }}>{t('wizard.summary.calculating')}</span>
                   ) : (
                     formatCurrency(total)
                   )}
                 </span>
               </div>
                                {taxCalculation && (
                   <div className="tax-note">
                     <p>
                       {t('wizard.summary.taxNote').replace('{rate}', (taxCalculation.tax_rate * 100).toFixed(2))}
                     </p>
                   </div>
                 )}
             </div>
           ) : (
             <div className="tax-breakdown">
               <div className="breakdown-item">
                 <span>{t('wizard.summary.subtotal')}</span>
                 <span>{formatCurrency(subtotal)}</span>
               </div>
               <div className="breakdown-item">
                 <span>{t('wizard.summary.tax')}</span>
                 <span>{t('wizard.summary.willBeCalculated')}</span>
               </div>
               <div className="breakdown-item total">
                 <span>{t('wizard.summary.total')}</span>
                 <span>{formatCurrency(subtotal)} + {t('wizard.summary.tax')}</span>
               </div>
             </div>
           )}
                     <div className="plan-features">
             <h5>{t('wizard.summary.whatsIncluded')}</h5>
             <ul>
               <li>{t('wizard.summary.features.noSetupFees')}</li>
               <li>{t('wizard.summary.features.bilingual')}</li>
               <li>{t('wizard.summary.features.answering')}</li>
               <li>{t('wizard.summary.features.advancedFeatures')}</li>
             </ul>
           </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                         <button
               className="wizard-next-btn"
                       onClick={handleProceedToPayment}
               disabled={isProcessing}
             >
               {isProcessing ? t('wizard.summary.processing') : (
                 <>
                   {t('wizard.summary.payNow')} <BsCreditCard style={{ color: '#0F384C', width: 20, height: 20 }} />
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
          initialData={{
            fullName: customerData.fullName,
            lastName: customerData.lastName,
            companyName: customerData.companyName,
            officeNumber: customerData.officeNumber,
            email: customerData.email,
            industry: customerData.industry,
            heardAbout: customerData.heardAbout
          }}
        />;
      case 1:
        return <BusinessForm 
          onValidityChange={() => {}} 
          onDataChange={handleBusinessData} 
          selectedPlan={selectedPlan} 
          onValid={() => setCurrentStep(2)}
          initialData={{
            company: customerData.company,
            address1: customerData.address1,
            address2: customerData.address2,
            city: customerData.city,
            state: customerData.state,
            zip: customerData.zip,
            country: customerData.country,
            mobileNumber: customerData.mobileNumber
          }}
        />;
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
            {currentStep === 3 && (
              <button className="wizard-next-btn" onClick={handleNextStep}>
                Next Step <img src={nexicon} alt="Next" style={{ width: 24, height: 24 }} />
              </button>
            )}
            {/* El botón de Go to Payment está en el paso 3, dentro del resumen */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WizardContainer; 