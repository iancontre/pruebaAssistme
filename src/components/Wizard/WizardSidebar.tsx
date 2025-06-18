import React from 'react';
import nexicon from '../../assets/images/icons/nexicon.png';
import prevIcon from '../../assets/images/icons/prevIcon.png';

interface Step {
  label: string;
  description: string;
}

interface WizardSidebarProps {
  steps: Step[];
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const WizardSidebar: React.FC<WizardSidebarProps> = ({ steps, currentStep, onNextStep, onPrevStep }) => {
  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const form = document.querySelector('.wizard-form') as HTMLFormElement;
    if (form) {
      const event = new Event('submit', { cancelable: true, bubbles: true });
      const isValid = form.dispatchEvent(event);
      if (isValid) {
        onNextStep();
      }
    }
  };

  return (
    <div className="wizard-sidebar">
      <div className="wizard-steps-layout">
        <div className="wizard-steps-info">
          {steps.map((step, idx) => (
            <div className={`wizard-step-info${idx === currentStep ? ' active' : ''}`} key={idx}>
              <div className="wizard-step-label">Step<br /><span className="wizard-step-title">{step.label}</span></div>
              <div className="wizard-step-desc">{step.description}</div>
            </div>
          ))}
        </div>
        <div className="wizard-step-circles">
          {steps.map((_, idx) => (
            <div className={`wizard-step-circle${idx === currentStep ? ' active' : ''}`} key={idx}>{idx + 1}</div>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', marginTop: '1.5rem', marginLeft: '20rem', gap: '2rem' }}>
        {currentStep > 0 && (
          <button className="wizard-prev-btn-circular" onClick={onPrevStep} style={{ marginTop: '1rem' }}>
            <img src={prevIcon} alt="Previous" style={{ width: 28, height: 28 }} />
          </button>
        )}
        <button className="wizard-next-btn" onClick={handleNextClick}>
          Next Step <img src={nexicon} alt="Next" style={{ width: 28, height: 28, marginLeft: 8 }} />
        </button>
      </div>
    </div>
  );
};

export default WizardSidebar; 