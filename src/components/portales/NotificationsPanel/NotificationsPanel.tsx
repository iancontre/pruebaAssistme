import React from 'react';
import './NotificationsPanel.css';

const notifications = [
  { type: 'success', text: 'Estimado cliente se le indica que el próximo mes su factura tendrá un aumento', icon: '✔️' },
  { type: 'info', text: 'Estimado cliente se le indica que el próximo mes su factura tendrá un aumento', icon: 'ℹ️' },
  { type: 'error', text: 'Has usado el 90% de tus minutos', icon: '❗' },
];

const NotificationsPanel: React.FC = () => (
  <aside className="notifications-panel">
    <div className="notifications-title">Notifications <span className="notifications-count">3</span></div>
    <div className="notifications-list">
      {notifications.map((n, i) => (
        <div key={i} className={`notification notification-${n.type}`}>
          <span className="notification-icon">{n.icon}</span>
          <span className="notification-text">{n.text}</span>
        </div>
      ))}
    </div>
  </aside>
);

export default NotificationsPanel; 