import React from 'react';
import '../styles/ConfirmDialog.css';

export const ConfirmDialog = ({ title, message, isOpen, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <h3>{title}</h3>
          <button 
            className="confirm-close" 
            onClick={onCancel}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        <div className="confirm-footer">
          <button 
            className="confirm-btn-cancel" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="confirm-btn-confirm" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
