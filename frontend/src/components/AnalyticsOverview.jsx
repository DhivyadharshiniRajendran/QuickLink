import React, { useEffect } from 'react';
import { useUrlContext } from '../context/UrlContext';
import './styles/AnalyticsOverview.css';

export const AnalyticsOverview = () => {
  const { urls, fetchUrls, loading } = useUrlContext();

  // Fetch fresh data when component mounts
  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Calculate analytics from current URLs
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
  const totalUrls = urls.length;
  const avgClicksPerUrl = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : '0';
  
  // Find URL with most clicks
  const mostClickedUrl = urls.length > 0 
    ? urls.reduce((max, url) => (url.clicks > max.clicks ? url : max))
    : null;

  return (
    <div className="analytics-overview">
      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <span className="stat-label">Total URLs Created</span>
            <span className="stat-value">{loading ? '...' : totalUrls}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👆</div>
          <div className="stat-info">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value">{loading ? '...' : totalClicks}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-label">Avg Clicks/URL</span>
            <span className="stat-value">{loading ? '...' : avgClicksPerUrl}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-label">Most Clicked URL</span>
            <span className="stat-value">
              {loading ? '...' : mostClickedUrl ? `${mostClickedUrl.clicks} clicks` : 'No data'}
            </span>
          </div>
        </div>
      </div>

      {mostClickedUrl && (
        <div className="top-performer">
          <h3 className="performer-title">Your Top Performer</h3>
          <div className="performer-card">
            <div className="performer-icon">⭐</div>
            <div className="performer-details">
              <p className="performer-short-url">{mostClickedUrl.shortUrl}</p>
              <p className="performer-original-url">
                Clicks: <strong>{mostClickedUrl.clicks}</strong> | 
                Created: <strong>{new Date(mostClickedUrl.createdAt).toLocaleDateString()}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
