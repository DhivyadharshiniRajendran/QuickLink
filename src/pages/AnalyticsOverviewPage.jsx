import React from 'react';
import { AnalyticsOverview } from '../components/AnalyticsOverview';
import '../styles/AnalyticsOverviewPage.css';

export const AnalyticsOverviewPage = () => {
  return (
    <div className="analytics-overview-page">
      <div className="overview-container">
        <div className="overview-header">
          <h1 className="overview-title">Analytics Overview</h1>
          <p className="overview-subtitle">
            Monitor your shortened URLs and track their performance
          </p>
        </div>

        <div className="overview-content">
          <AnalyticsOverview />
        </div>
      </div>
    </div>
  );
};
