import React from "react";
import "./BenefitCustomer.css";
import imageBenefit from "../../assets/images/imageBenefit.png";
import approvalIcon from "../../assets/images/icons/approval.png";

const BenefitCustomer: React.FC = () => (
  <section className="benefit-customer-section">
    <div className="benefit-customer-content">
      <div className="benefit-customer-text">
        <h2 className="benefit-customer-title">Benefit From<br/>Bilingual Call Agents</h2>
        <p className="benefit-customer-description">
          You'll never have to worry about losing a customer again when you partner with ASSIST-ME. Meet the needs of your clientele by offering friendly and professional bilingual answering services. Our bilingual agents can provide the following services:
        </p>
        <div className="benefit-customer-list-wrapper">
          <ul className="benefit-customer-list">
            <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> Taking down messages</li>
            <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> Patching calls</li>
            <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> Live receptionist answering service</li>
          </ul>
          <ul className="benefit-customer-list">
            <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> Capturing lead information</li>
            <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> Handling after-hour and overflow calls</li>
            <li><img src={approvalIcon} alt="approval" className="benefit-customer-icon" /> Customer service support</li>
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

export default BenefitCustomer; 