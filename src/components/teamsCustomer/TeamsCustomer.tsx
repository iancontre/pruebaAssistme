import React from "react";
import "./TeamsCustomer.css";
import teamsImage from "../../assets/images/teamssection.png";
import { useTranslation } from '../../hooks/useTranslation';

const TeamsCustomer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="teams-customer-section">
      <h2 
        className="teams-customer-title" 
        dangerouslySetInnerHTML={{ __html: t('teamsCustomer.title') }}
      />
      <div className="teams-customer-content">
        <div className="teams-customer-image-wrapper">
          <img src={teamsImage} alt="Team Customer Service" className="teams-customer-image" />
        </div>
        <div className="teams-customer-text">
          <p 
            className="teams-customer-description"
            dangerouslySetInnerHTML={{ __html: t('teamsCustomer.description') }}
          />
        </div>
      </div>
    </section>
  );
};

export default TeamsCustomer; 