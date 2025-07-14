import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend } from 'recharts';
import './DashboardCharts.css';

const pieData = [
  { name: 'Available', value: 60, color: '#1ecfff' },
  { name: 'Consumed', value: 25, color: '#a18fff' },
  { name: 'Failed', value: 15, color: '#3b3be3' },
];

const barData = [
  { name: 'Mon', users: 120 },
  { name: 'Tue', users: 180 },
  { name: 'Wed', users: 140 },
  { name: 'Thu', users: 140 },
  { name: 'Fri', users: 140 },
  { name: 'Sat', users: 180 },
  { name: 'Sun', users: 80 },
];

const lineData = [
  { name: '1', calls: 10 },
  { name: '2', calls: 20 },
  { name: '3', calls: 15 },
  { name: '4', calls: 25 },
  { name: '5', calls: 18 },
  { name: '6', calls: 22 },
  { name: '7', calls: 17 },
];

const DashboardCharts: React.FC = () => (
  <div className="dashboard-charts-grid">
    <div className="dashboard-chart dashboard-pie">
      <div className="dashboard-chart-title">Calls</div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="dashboard-chart dashboard-bar">
      <div className="dashboard-chart-title">Total number of users</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="users" fill="#1ecfff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="dashboard-chart dashboard-line">
      <div className="dashboard-chart-title">Call summary</div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={lineData}>
          <XAxis dataKey="name" hide />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="calls" stroke="#3b3be3" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardCharts; 