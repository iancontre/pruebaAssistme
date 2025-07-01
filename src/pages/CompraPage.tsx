import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import WizardContainer from '../components/Wizard/WizardContainer';
import wizzardImageUno from '../assets/images/wizzardimageuno.png';
import '../components/Wizard/Wizard.css';
import { PricingPlan } from '../services/taxService';

const wizardHeaders = [
  {
    title: '¡Fill out our form!',
    description: '',
    image: wizzardImageUno,
    showButtons: false,
  },
  // Agrega aquí los headers de los siguientes pasos
];

const CompraPage: React.FC = () => {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan as PricingPlan;
  const [currentWizardStep, setCurrentWizardStep] = useState(0);

  // Debug: verificar que el paso se está actualizando
  console.log('CompraPage - currentWizardStep:', currentWizardStep);

  return (
    <>
      <Nav />
      <Header
        key={`wizard-step-${currentWizardStep}`}
        isWizard={true}
        wizardStep={currentWizardStep}
      />
      <WizardContainer 
        selectedPlan={selectedPlan} 
        onStepChange={setCurrentWizardStep}
      />
    </>
  );
};

export default CompraPage; 