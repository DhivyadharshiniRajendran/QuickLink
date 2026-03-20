import React from 'react';
import '../../styles/LoadingSpinner.css';

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};
