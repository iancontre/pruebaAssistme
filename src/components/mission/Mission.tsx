import React from 'react';

import './Mission.css'
import imageMission from '../../assets/images/imageMission.png';


const Mission: React.FC = () =>{
    return(
    <div className="mission-fullscreen">
        <div className="mission-content">
          <div className="mission-text">
            <h1 className='tittle-mission'>Our Mission</h1>
            <p>Elevate the productivity of our clients by optimizing received calls, using cutting-edge technology and a highly skilled team. At Assist-Me Virtual Services, we transform the way businesses operate.</p>
          </div>
          <img src={imageMission} alt="Encabezado" className="mission-image" />
        </div>
      </div>
    );
};

export default Mission;