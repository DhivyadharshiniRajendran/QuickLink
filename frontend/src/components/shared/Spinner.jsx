import React from 'react';
import '../styles/Spinner.css';

export const Spinner = ({ size = 'medium', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="spinner-container-full-page">
        <div className={`spinner spinner-${size}`}>
          <div className="spinner-circle"></div>
        </div>
        <p className="spinner-text">Loading...</p>
      </div>
    );
  }

  return <div className={`spinner spinner-${size}`}><div className="spinner-circle"></div></div>;
};
