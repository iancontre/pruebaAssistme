import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import WizardContainer from '../components/Wizard/WizardContainer';
import WizardConfigContainer from '../components/Wizard/WizardConfigContainer';
import '../components/Wizard/Wizard.css';
import { PricingPlan } from '../services/apiService';



const CompraPage: React.FC = () => {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan as PricingPlan;
  const [currentWizardStep, setCurrentWizardStep] = useState(0);
  const [showConfigWizard, setShowConfigWizard] = useState(false);

  // Debug: verificar que el paso se está actualizando
  console.log('CompraPage - currentWizardStep:', currentWizardStep);

  return (
    <>
      <Nav />
      {!showConfigWizard && (
        <Header
          key={`wizard-step-${currentWizardStep}`}
          isWizard={true}
          wizardStep={currentWizardStep}
        />
      )}
      {!showConfigWizard ? (
        <WizardContainer
          selectedPlan={selectedPlan}
          onStepChange={(step) => {
            setCurrentWizardStep(step);
          }}
          onConfigWizardRequest={() => {
            setShowConfigWizard(true);
          }}
        />
      ) : (
        <WizardConfigContainer />
      )}
    </>
  );
};

export default CompraPage; 