import React from "react";
import { useTranslation } from '../../hooks/useTranslation';

import './Vision.css';
import imageVision from '../../assets/images/imageVision.png';

const Vision: React.FC = () => {
    const { t } = useTranslation();
    
    return(
        <div className="vision-fullscreen">
        <div className="vision-content">
          <img src={imageVision} alt="Encabezado" className="vision-image" />
          <div className="vision-text">
            <h1 className='tittle-vision'>{t('vision.title')}</h1>
            <p>{t('vision.description')}</p>
          </div>
        </div>
      </div>
    );
};

export default Vision;