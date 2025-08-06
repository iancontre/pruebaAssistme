import React from "react";
import "./BenefitCustomer.css";
import imageBenefit from "../../assets/images/imageBenefit.png";
import approvalIcon from "../../assets/images/icons/approval.png";
import { useTranslation } from '../../hooks/useTranslation';

const BenefitCustomer: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  
  console.log('BenefitCustomer render - Language:', currentLanguage);
  console.log('BenefitCustomer title:', t('benefitCustomer.title'));
  console.log('BenefitCustomer description:', t('benefitCustomer.description'));

  return (
    <section className="benefit-customer-section">
      <div className="benefit-customer-content">
        <div className="benefit-customer-text">
          <h2 
            className="benefit-customer-title"
            dangerouslySetInnerHTML={{ __html: t('benefitCustomer.title') }}
          />
          <p className="benefit-customer-description">
            {t('benefitCustomer.description')}
          </p>
          <div className="benefit-customer-list-wrapper">
            <ul className="benefit-customer-list">
              <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> {t('benefitCustomer.services.service1')}</li>
              <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> {t('benefitCustomer.services.service2')}</li>
              <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> {t('benefitCustomer.services.service3')}</li>
            </ul>
            <ul className="benefit-customer-list">
              <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> {t('benefitCustomer.services.service4')}</li>
              <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> {t('benefitCustomer.services.service5')}</li>
              <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> {t('benefitCustomer.services.service6')}</li>
            </ul>
          </div>
        </div>
        <div className="benefit-customer-image-wrapper">
          <img src={imageBenefit} alt="Benefit Customer" className="benefit-customer-image" />
          <div className="benefit-customer-bg-circle"></div>
        </div>
      </div>
    </section>
  );
};

export default BenefitCustomer; 