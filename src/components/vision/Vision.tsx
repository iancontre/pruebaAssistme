import React from "react";

import './Vision.css';
import imageVision from '../../assets/images/imageVision.png';

const Vision: React.FC = () => {
    return(
        <div className="vision-fullscreen">
        <div className="vision-content">
          <img src={imageVision} alt="Encabezado" className="vision-image" />
          <div className="vision-text">
            <h1 className='tittle-vision'>Our Vision</h1>
            <p>We aspire to become the largest virtual assistant company in the United States by 2030.</p>
          </div>
        </div>
      </div>
    );
};

export default Vision;