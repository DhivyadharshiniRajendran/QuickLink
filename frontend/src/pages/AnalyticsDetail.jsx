import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUrlContext } from '../context/UrlContext';
import { formatDate, formatDateTime, getTimeAgo } from '../utils/urlValidator';
import '../styles/AnalyticsDetail.css';

export const AnalyticsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showNotification } = useUrlContext();
  const [analytics, setAnalytics] = useState(null);
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/urls/analytics/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError(err.message);
        showNotification('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };

    const fetchUrlDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/urls/details/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch URL details');
        }

        const data = await response.json();
        setUrlData(data);
      } catch (err) {
        console.error('URL details fetch error:', err);
      }
    };

    if (token && id) {
      fetchAnalytics();
      fetchUrlDetails();
    }
  }, [id, token, API_URL, showNotification]);

  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this URL? This action cannot be undone.'
      )
    ) {
      try {
        const response = await fetch(`${API_URL}/urls/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          showNotification('URL deleted successfully!', 'success');
          navigate('/');
        } else {
          showNotification('Failed to delete URL', 'error');
        }
      } catch (err) {
        console.error('Delete error:', err);
        showNotification('Error deleting URL', 'error');
      }
    }
  };

  const handleCopyShortUrl = () => {
    if (urlData) {
      navigator.clipboard.writeText(urlData.shortUrl);
      showNotification('Short URL copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="analytics-detail-page">
        <div className="loading-container">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics || !urlData) {
    return (
      <div className="analytics-detail-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Failed to Load Analytics</h2>
          <p>{error || 'The URL you are looking for does not exist.'}</p>
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-detail-page">
      <div className="analytics-container">
        <Link to="/" className="back-btn">
          ← Back to Dashboard
        </Link>

        <div className="detail-hero">
          <h1 className="detail-title">URL Analytics</h1>
          <p className="detail-subtitle">Detailed performance metrics</p>
        </div>

        {/* URL Info Card */}
        <div className="url-info-card">
          <div className="info-section">
            <label className="info-label">Original URL</label>
            <a
              href={urlData.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="original-url-link"
              title={urlData.originalUrl}
            >
              {urlData.originalUrl}
            </a>
          </div>

          <div className="info-section">
            <label className="info-label">Short URL</label>
            <div className="short-url-display">
              <code className="url-code">{urlData.shortUrl}</code>
              <button
                onClick={handleCopyShortUrl}
                className="copy-btn-large"
                title="Copy short URL"
              >
                📋 Copy
              </button>
            </div>
          </div>

          <div className="info-section">
            <label className="info-label">Created Date</label>
            <span className="info-value">{formatDateTime(urlData.createdAt)}</span>
          </div>

          <div className="danger-zone">
            <button onClick={handleDelete} className="delete-btn-large">
              🗑️ Delete This URL
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card large">
            <div className="metric-icon">👆</div>
            <div className="metric-content">
              <span className="metric-label">Total Clicks</span>
              <span className="metric-value">{analytics.totalClicks}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <span className="metric-label">Last Visited</span>
              <span className="metric-value">
                {analytics.lastVisitedAt
                  ? getTimeAgo(analytics.lastVisitedAt)
                  : 'No visits yet'}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📅</div>
            <div className="metric-content">
              <span className="metric-label">Created On</span>
              <span className="metric-value">{formatDate(urlData.createdAt)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🕐</div>
            <div className="metric-content">
              <span className="metric-label">Most Active Hour</span>
              <span className="metric-value">
                {analytics.mostActiveHour !== null
                  ? `${analytics.mostActiveHour}:00`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Clicks Per Day Chart */}
        <div className="chart-section">
          <h2 className="section-title">Clicks Per Day (Last 7 Days)</h2>
          <div className="simple-chart">
            <div className="chart-container">
              {analytics.clicksPerDay.map((day, idx) => {
                const maxClicks = Math.max(
                  ...analytics.clicksPerDay.map((d) => d.clicks),
                  1
                );
                const height = (day.clicks / maxClicks) * 100;

                return (
                  <div key={idx} className="chart-bar-wrapper">
                    <div className="chart-bar">
                      <div
                        className="bar"
                        style={{ height: `${height}%` }}
                        title={`${day.clicks} clicks`}
                      ></div>
                    </div>
                    <span className="chart-label">{day.date}</span>
                    <span className="chart-value">{day.clicks}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Device Type Breakdown */}
        <div className="breakdown-section">
          <h2 className="section-title">Device Type Breakdown</h2>
          <div className="breakdown-grid">
            <div className="breakdown-card">
              <span className="breakdown-label">📱 Mobile</span>
              <span className="breakdown-value">{analytics.deviceBreakdown.mobile}</span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-label">💻 Desktop</span>
              <span className="breakdown-value">{analytics.deviceBreakdown.desktop}</span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-label">📱 Tablet</span>
              <span className="breakdown-value">{analytics.deviceBreakdown.tablet}</span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-label">❓ Other</span>
              <span className="breakdown-value">{analytics.deviceBreakdown.other}</span>
            </div>
          </div>
        </div>

        {/* Browser Breakdown */}
        {analytics.browserBreakdown.length > 0 && (
          <div className="breakdown-section">
            <h2 className="section-title">Browser Usage</h2>
            <div className="browser-list">
              {analytics.browserBreakdown.map((browser, idx) => (
                <div key={idx} className="browser-item">
                  <span className="browser-name">{browser.name}</span>
                  <span className="browser-count">{browser.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Visit History */}
        <div className="click-history-section">
          <h2 className="section-title">Recent Visit History</h2>
          {analytics.recentVisits.length === 0 ? (
            <div className="no-history">
              <p>No visits recorded yet</p>
            </div>
          ) : (
            <div className="history-list">
              <div className="history-header">
                <span className="col-timestamp">Timestamp</span>
                <span className="col-browser">Browser</span>
                <span className="col-device">Device</span>
                <span className="col-os">OS</span>
                <span className="col-ip">IP Address</span>
              </div>
              <div className="history-items">
                {analytics.recentVisits.map((visit, idx) => (
                  <div key={visit.id} className="history-item">
                    <span className="col-timestamp">
                      {formatDateTime(visit.timestamp)}
                    </span>
                    <span className="col-browser">{visit.browser}</span>
                    <span className="col-device">{visit.deviceType}</span>
                    <span className="col-os">{visit.os}</span>
                    <span className="col-ip" title={visit.ipAddress}>
                      {visit.ipAddress}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
