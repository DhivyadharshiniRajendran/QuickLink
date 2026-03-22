import React from 'react';
import '../../styles/Notification.css';

export const Notification = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      <span className="notification-message">{message}</span>
    </div>
  );
};
