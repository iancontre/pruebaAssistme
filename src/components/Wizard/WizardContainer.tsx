import React, { useState } from 'react';
import WizardSidebar from './WizardSidebar';
import ProfileForm from './ProfileForm';
import BusinessForm from './BusinessForm';
import prevIcon from '../../assets/images/icons/prevIcon.png';
import nexicon from '../../assets/images/icons/nexicon.png';
// Aquí se pueden importar los otros pasos cuando se creen

const steps = [
  { label: 'PROFILE', description: 'First tell us a little about yourself' },
  { label: 'BUSINESS', description: 'That you are requesting services for' },
  { label: 'OPTIONS', description: 'Choose your payment method' },
  { label: 'GET STARTED', description: `Let's get started setting up your account` },
];

const WizardContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
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

  // Renderizar el contenido del paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 0:   
        return <ProfileForm onValidityChange={() => {}} />;
      case 1:
        return <BusinessForm onValidityChange={() => {}} />;
      // case 2: return <OptionsForm />;
      // case 3: return <GetStarted />;
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
            {currentStep > 0 && (
              <button className="wizard-prev-btn-circular" onClick={handlePrevStep}>
                <img src={prevIcon} alt="Previous" style={{ width: 24, height: 24 }} />
              </button>
            )}
            <button className="wizard-next-btn" onClick={handleNextStep}>
              Next Step <img src={nexicon} alt="Next" style={{ width: 24, height: 24 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardContainer; 