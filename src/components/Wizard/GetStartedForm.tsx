import React from 'react';
import wizzar4abajo from '../../assets/images/wizzar4abajo.png';
import './GetStartedForm.css';

const GetStartedForm: React.FC = () => {
  return (
    <div className="wizard-form-container">
      <div className="wizard-form-foreground">
        <div className="get-started-container custom-step4-layout">
          <div className="step4-main-layout">
            {/* Lado izquierdo: texto */}
            <div className="step4-left">
              <div className="step4-welcome-block">
                <h2 className="step4-welcome-title">Welcome</h2>
                <p className="step4-welcome-text">
                  on behalf of the Assit-Me team, we'd like to welcome<br />
                  you as our newest member! We're looking forward<br />
                  to setting up your account and getting to know you.
                </p>
                <h3 className="step4-nextstep-title">Next Step</h3>
                <p className="step4-nextstep-text">
                  We have just a few more questions so we can<br />
                  continue setting up your account. Time needed for<br />
                  this is about 3 - 5 minutes.
                </p>
              </div>
            </div>
            {/* Lado derecho: fondo azul, texto y foto */}
            <div className="step4-right">
              <div className="step4-right-bg">
                <div className="step4-thankyou-text">
                  <span>¡Thank you for trusting us with your clients!</span>
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