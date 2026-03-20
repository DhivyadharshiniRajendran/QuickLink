import React from 'react';
import '../../styles/FullPageLoader.css';

export const FullPageLoader = () => {
  return (
    <div className="full-page-loader">
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
};
