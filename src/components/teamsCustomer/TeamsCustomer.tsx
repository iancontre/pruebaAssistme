import React from "react";
import "./TeamsCustomer.css";
import teamsImage from "../../assets/images/teamssection.png";

const TeamsCustomer: React.FC = () => (
  <section className="teams-customer-section">
    <h2 className="teams-customer-title">Stop Worrying<br/>About Missing Calls</h2>
    <div className="teams-customer-content">
      <div className="teams-customer-image-wrapper">
        <img src={teamsImage} alt="Team Customer Service" className="teams-customer-image" />
      </div>
      <div className="teams-customer-text">
        <p className="teams-customer-description">
          The business landscape in the U.S. is ever-evolving, and to stay competitive in your industry, it's crucial to have bilingual agents who can seamlessly communicate in both English and Spanish.<br/><br/>
          That's where ASSIST-ME steps in. Our live operator answering service includes bilingual professionals who not only offer quick and accurate translation but also deliver expert insights into your products and services, ensuring top-notch customer support.
        </p>
      </div>
    </div>
  </section>
);

export default TeamsCustomer; 