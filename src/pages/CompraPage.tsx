import React from 'react';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import WizardContainer from '../components/Wizard/WizardContainer';
import wizzardImageUno from '../assets/images/wizzardimageuno.png';
import '../components/Wizard/Wizard.css';

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
  return (
    <>
      <Nav />
      <Header
        title={wizardHeaders[0].title}
        description={wizardHeaders[0].description}
        image={wizardHeaders[0].image}
        showButtons={wizardHeaders[0].showButtons}
        isWizard={true}
      />
      <WizardContainer />
    </>
  );
};

export default CompraPage; 