import React, { useState } from 'react';
import WizardSidebar from './WizardSidebar';
import ProfileForm from './ProfileForm';
import BusinessForm from './BusinessForm';
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
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
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
      <WizardSidebar steps={steps} currentStep={currentStep} onNextStep={handleNextStep} onPrevStep={handlePrevStep} />
      <div className="wizard-content" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="wizard-form-shadow-card" />
        <div className="wizard-form-bg" />
        <div className="wizard-form-foreground">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default WizardContainer; 