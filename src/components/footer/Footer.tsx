import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import assistMeLogoBackground from '../../assets/images/logowhite.png'; 

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-left">
          <button className="pricing-button">Pricing And Plans</button>
          <div className="social-icons">
            {/* Facebook Icon */}
            <a href="#facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon-link">
              <FaFacebook size={35} color="white" />
            </a>
            {/* Instagram Icon */}
            <a href="#instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-link">
              <FaInstagram size={35} color="white" />
            </a>
            {/* LinkedIn Icon */}
            <a href="#linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon-link">
              <FaLinkedin size={35} color="white" />
            </a>
          </div>
          <div className="contact-infodos">
            <h4>Contact Information</h4>
            <div className="phone-number">
              <FaPhone size={20} color="white" />
              <span>Per Month : 888-675-8098</span>
            </div>
            <div className="phone-number">
              <FaPhone size={20} color="white" />
              <span>Per Month : 888-675-8098</span>
            </div>
          </div>
        </div>
        
        <div className="footer-right">
          <nav className="footer-nav">
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Why Choose Us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Tutorials</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="footer-background-logo" style={{ backgroundImage: `url(${assistMeLogoBackground})` }}>
      </div>
    </footer>
  );
};

export default Footer; 