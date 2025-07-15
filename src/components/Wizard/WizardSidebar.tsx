import React from 'react';
import prevIcon from '../../assets/images/icons/prevIcon.png';
import nexicon from '../../assets/images/icons/nexicon.png';

interface Step {
  label: string;
  description: string;
}

interface WizardSidebarProps {
  steps: Step[];
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  forceNoValidation?: boolean;
}

const WizardSidebar: React.FC<WizardSidebarProps> = ({ steps, currentStep, onNextStep, onPrevStep, forceNoValidation }) => {
  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (forceNoValidation) {
      onNextStep();
      return;
    }
    // Si estamos en el último paso (paso 4), no hacer validación
    if (currentStep === steps.length - 1) {
      onNextStep();
      return;
    }
    
    const form = document.querySelector('.wizard-form') as HTMLFormElement;
    if (form) {
      const event = new Event('submit', { cancelable: true, bubbles: true });
      const isValid = form.dispatchEvent(event);
      if (isValid) {
        onNextStep();
      }
    }
  };

  const renderNavigation = () => (
    <>
      {currentStep > 0 && (
        <button className="wizard-prev-btn-circular" onClick={onPrevStep}>
          <img src={prevIcon} alt="Previous" style={{ width: 24, height: 24 }} />
        </button>
      )}
      <button className="wizard-next-btn" onClick={handleNextClick}>
        Next Step <img src={nexicon} alt="Next" style={{ width: 24, height: 24 }} />
      </button>
    </>
  );

  return (
    <div className="wizard-sidebar">
      <div className="wizard-steps-layout">
        <div className="wizard-steps-info">
          {steps.map((step, idx) => (
            <div className={`wizard-step-info${idx === currentStep ? ' active' : ''}`} key={idx}>
              <div className="wizard-step-label">Step</div>
              <div className="wizard-step-title">{step.label}</div>
              <div className="wizard-step-desc">{step.description}</div>
            </div>
          ))}
        </div>
        <div className="wizard-step-circles">
          {steps.map((_, idx) => (
            <div className={`wizard-step-circle${idx === currentStep ? ' active' : ''}`} key={idx}>
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="wizard-navigation-wrapper">
        <div className="wizard-navigation desktop">
          {renderNavigation()}
        </div>
        <div className="wizard-navigation mobile">
          {renderNavigation()}
        </div>
      </div>
    </div>
  );
};

export default WizardSidebar; 