import React from 'react';
import wizzar4abajo from '../../assets/images/wizzar4abajo.png';
import './GetStartedForm.css';
import { useTranslation } from '../../hooks/useTranslation';

const GetStartedForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="wizard-form-container">
      <div className="wizard-form-foreground">
        {/* Título centrado al nivel del formulario */}
        <div className="wizard-title-container">
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            color: '#18344C', 
            margin: '0 0 8px 0',
            lineHeight: '1.2',
            textAlign: 'center'
          }}>
            {t('getStarted.title')}
          </h2>
        </div>
        
        <div className="get-started-container custom-step4-layout">
          <div className="step4-main-layout">
            {/* Lado izquierdo: texto */}
            <div className="step4-left">
              <div className="step4-welcome-block">
                <h2 className="step4-welcome-title">{t('wizard.getStarted.welcome.title')}</h2>
                <p 
                  className="step4-welcome-text"
                  dangerouslySetInnerHTML={{ __html: t('wizard.getStarted.welcome.text') }}
                />
                <h3 className="step4-nextstep-title">{t('wizard.getStarted.nextStep.title')}</h3>
                <p 
                  className="step4-nextstep-text"
                  dangerouslySetInnerHTML={{ __html: t('wizard.getStarted.nextStep.text') }}
                />
              </div>
            </div>
            {/* Lado derecho: fondo azul, texto y foto */}
            <div className="step4-right">
              <div className="step4-right-bg">
                <div className="step4-thankyou-text">
                  <span>{t('wizard.getStarted.thankYou')}</span>
                </div>
                <img
                  src={wizzar4abajo}
                  alt="Thank you"
                  className="step4-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedForm; 