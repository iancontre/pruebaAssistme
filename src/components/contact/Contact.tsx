import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

import './Contact.css';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-container">
      <h1 className="contact-title">{t('contact.title')}</h1>
      <p className="contact-subtitle">{t('contact.subtitle')}</p>
      <div className="contact-content">
        <div className="contact-info">
          <h2>{t('contact.info.title')}</h2>
          <p className="contact-info-desc">{t('contact.info.description')}</p>
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
              <label>{t('contact.form.firstName')}</label>
              <input type="text" placeholder={t('contact.form.firstNamePlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('contact.form.lastName')}</label>
              <input type="text" placeholder={t('contact.form.lastNamePlaceholder')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('contact.form.email')}</label>
              <input type="email" placeholder={t('contact.form.emailPlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('contact.form.phoneNumber')}</label>
              <input type="text" placeholder={t('contact.form.phoneNumberPlaceholder')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>{t('contact.form.message')}</label>
              <textarea placeholder={t('contact.form.messagePlaceholder')}></textarea>
            </div>
          </div>
          <button type="submit" className="send-btn">{t('contact.form.sendMessage')}</button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 