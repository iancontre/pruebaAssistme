import React from 'react';

import './Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact</h1>
      <p className="contact-subtitle">Any Question Or Remarks? Just Write Us A Message!</p>
      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p className="contact-info-desc">Say something to start a live chat!</p>
          <ul className="contact-info-list">
            <li>
              <span className="contact-icon phone"></span>
              <span className="contact-text">+1 678 427 1932</span>
            </li>
            <li>
              <span className="contact-icon email"></span>
              <span className="contact-text">
                <a href="mailto:info@myassist-me.com">info@myassist-me.com</a>
              </span>
            </li>
            <li>
              <span className="contact-icon location"></span>
              <span className="contact-text">9870 Coleman Rd, Roswell, GA, 30075</span>
            </li>
          </ul>
          <div className="contact-circles">
            <span className="circle white"></span>
            <span className="circle dark"></span>
            <span className="circle light"></span>
          </div>
          <div className="contact-decor">
            <span className="circle big"></span>
            <span className="circle small"></span>
          </div>
        </div>
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="Julie" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Doe" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="julie@assistme.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" placeholder="+1 012 3456 789" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Message</label>
              <textarea placeholder="Write your message.."></textarea>
            </div>
          </div>
          <button type="submit" className="send-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 