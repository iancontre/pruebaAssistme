import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

import './Mission.css'
import imageMission from '../../assets/images/imageMission.png';


const Mission: React.FC = () =>{
    const { t } = useTranslation();
    
    return(
    <div className="mission-fullscreen">
        <div className="mission-content">
          <div className="mission-text">
            <h1 className='tittle-mission'>{t('mission.title')}</h1>
            <p>{t('mission.description')}</p>
          </div>
          <img src={imageMission} alt="Encabezado" className="mission-image" />
        </div>
      </div>
    );
};

export default Mission;