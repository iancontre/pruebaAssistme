import React from 'react';
import logowhite from '../../../assets/images/logowhite.png';
import './SidebarPortal.css';

const SidebarPortal: React.FC = () => (
  <aside className="sidebar-portal">
    <div className="sidebar-logo">
      <img src={logowhite} alt="ASSIST-ME Logo" className="sidebar-logo-img" />
      <span className="logo-text">ASSIST-ME</span>
    </div>
    <nav className="sidebar-nav">
      <ul>
        <li className="active"><span className="icon-reports" /> Reports</li>
        <li><span className="icon-billing" /> Billing</li>
      </ul>
    </nav>
  </aside>
);

export default SidebarPortal; 