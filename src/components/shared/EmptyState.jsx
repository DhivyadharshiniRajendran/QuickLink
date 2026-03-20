import React from 'react';
import '../../styles/EmptyState.css';

export const EmptyState = ({ 
  icon = '📋', 
  title = 'No data yet',
  message = 'Start by creating your first short URL',
  action = null
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};
