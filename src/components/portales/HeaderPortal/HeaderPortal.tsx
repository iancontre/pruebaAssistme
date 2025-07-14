import React from 'react';
import watermark from '../../../assets/images/logowhite.png'; // Usa tu marca de agua real si la tienes
import './HeaderPortal.css';

const HeaderPortal: React.FC = () => (
  <header className="header-portal">
    <div className="header-watermark">
      <img src={watermark} alt="Watermark" className="header-watermark-img" />
    </div>
    <div className="header-user-block">
      <div className="header-user">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="header-avatar" />
        <div className="header-user-divider" />
        <button className="header-logout">Logout</button>
      </div>
    </div>
  </header>
);

export default HeaderPortal; 