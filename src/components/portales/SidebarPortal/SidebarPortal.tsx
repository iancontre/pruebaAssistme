import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PiChartPie, PiShoppingCart, PiHouse } from 'react-icons/pi';
import logowhite from '../../../assets/images/logowhite.png';
import './SidebarPortal.css';

const SidebarPortal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar-portal">
      <div className="sidebar-logo">
        <img src={logowhite} alt="ASSIST-ME Logo" className="sidebar-logo-img" />
        <span className="logo-text">ASSIST-ME</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li 
            className={isActive('/dashboard') ? 'active' : ''}
            onClick={() => handleNavigation('/dashboard')}
          >
            <PiHouse className="sidebar-icon" /> Dashboard
          </li>
          <li 
            className={isActive('/reporte-llamadas') ? 'active' : ''}
            onClick={() => handleNavigation('/reporte-llamadas')}
          >
            <PiChartPie className="sidebar-icon" /> Reports
          </li>
          <li 
            className={isActive('/billing') ? 'active' : ''}
            onClick={() => handleNavigation('/billing')}
          >
            <PiShoppingCart className="sidebar-icon" /> Billing
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarPortal; 