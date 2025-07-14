import React from 'react';
import {
  NotificationsPanel,
  DashboardCharts,
  DashboardCards
} from '../components/portales';
import SidebarPortal from '../components/portales/SidebarPortal/SidebarPortal';
import HeaderPortal from '../components/portales/HeaderPortal/HeaderPortal';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <SidebarPortal />
      <div className="dashboard-main">
        <HeaderPortal />
        <div className="dashboard-content">
          <div className="dashboard-center">
            <div className="dashboard-row">
              <DashboardCharts />
              <DashboardCards />
            </div>
          </div>
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 