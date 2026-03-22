import React from 'react';
import { UrlShortenerForm } from '../components/UrlShortenerForm';
import { ShortUrlsTable } from '../components/ShortUrlsTable';
import { AnalyticsOverview } from '../components/AnalyticsOverview';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Shorten Your Long URL</h1>
            <p className="hero-subtitle">
              Create short, shareable links in seconds with QuickLink
            </p>
          </div>
          <div className="hero-icon">🚀</div>
        </div>

        <section className="dashboard-section">
          <UrlShortenerForm />
        </section>

        <section className="dashboard-section">
          <AnalyticsOverview />
        </section>

        <section className="dashboard-section">
          <ShortUrlsTable />
        </section>
      </div>
    </div>
  );
};
