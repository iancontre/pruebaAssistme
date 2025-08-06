import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import './About.css'
import imagenAbout from '../../assets/images/about.png'
const About: React.FC = () => {
    const { t } = useTranslation();
    
    return (
      <div className="about-fullscreen">
        <div className="about-content">
          <img src={imagenAbout} alt="Encabezado" className="about-image" />
          <div className="about-text">
                      <h1 className='tittle-about'>{t('about.title')}</h1>
          <p>{t('about.description')}</p>
          </div>
        </div>
      </div>
    );
  };
  export default About;