import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './DashboardCards.css';

const donutData = [
  { name: 'Available', value: 18, color: '#1ecfff' },
  { name: 'Consumed', value: 10, color: '#3b3be3' },
];

const DashboardCards: React.FC = () => (
  <div className="dashboard-cards-grid">
    <div className="dashboard-card dashboard-minutes">
      <div className="dashboard-card-title">MINUTES CONSUMED VS PLAN</div>
      <div className="dashboard-minutes-summary">
        <div className="dashboard-minutes-box consumed">10<br /><span>Consumed</span></div>
        <div className="dashboard-minutes-box available">18<br /><span>Available</span></div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <PieChart>
          <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} label>
            {donutData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardCards; 