import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUrlContext } from '../context/UrlContext';
import { formatDate, formatDateTime, getTimeAgo } from '../utils/urlValidator';
import '../styles/AnalyticsDetail.css';

export const AnalyticsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUrlById, deleteUrl, showNotification } = useUrlContext();
  const url = getUrlById(id);

  if (!url) {
    return (
      <div className="analytics-detail-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>URL Not Found</h2>
          <p>The URL you're looking for doesn't exist or has been deleted.</p>
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this URL? This action cannot be undone.'
      )
    ) {
      deleteUrl(url.id);
      showNotification('URL deleted successfully!', 'info');
      navigate('/');
    }
  };

  const handleCopyShortUrl = () => {
    navigator.clipboard.writeText(
      window.location.origin + '/' + url.shortCode
    );
    showNotification('Short URL copied to clipboard!', 'success');
  };

  const lastClickTime =
    url.clickHistory.length > 0
      ? url.clickHistory[url.clickHistory.length - 1].timestamp
      : null;

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

        <div className="url-info-card">
          <div className="info-section">
            <label className="info-label">Original URL</label>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="original-url-link"
              title={url.originalUrl}
            >
              {url.originalUrl}
            </a>
          </div>

          <div className="info-section">
            <label className="info-label">Short URL</label>
            <div className="short-url-display">
              <code className="url-code">{url.shortUrl}</code>
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
            <span className="info-value">{formatDateTime(url.created)}</span>
          </div>

          <div className="danger-zone">
            <button onClick={handleDelete} className="delete-btn-large">
              🗑️ Delete This URL
            </button>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card large">
            <div className="metric-icon">👆</div>
            <div className="metric-content">
              <span className="metric-label">Total Clicks</span>
              <span className="metric-value">{url.clicks}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <span className="metric-label">Last Visited</span>
              <span className="metric-value">
                {lastClickTime
                  ? getTimeAgo(lastClickTime)
                  : 'No visits yet'}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📅</div>
            <div className="metric-content">
              <span className="metric-label">Created On</span>
              <span className="metric-value">{formatDate(url.created)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <span className="metric-label">CTR</span>
              <span className="metric-value">
                {url.clicks > 0 ? '100%' : '0%'}
              </span>
            </div>
          </div>
        </div>

        <div className="click-history-section">
          <h2 className="section-title">Recent Visit History</h2>
          {url.clickHistory.length === 0 ? (
            <div className="no-history">
              <p>No visits recorded yet</p>
            </div>
          ) : (
            <div className="history-list">
              <div className="history-header">
                <span className="col-number">#</span>
                <span className="col-timestamp">Timestamp</span>
                <span className="col-timeago">Time Ago</span>
              </div>
              <div className="history-items">
                {url.clickHistory
                  .slice()
                  .reverse()
                  .map((click, idx) => (
                    <div key={idx} className="history-item">
                      <span className="col-number">
                        {url.clickHistory.length - idx}
                      </span>
                      <span className="col-timestamp">
                        {formatDateTime(click.timestamp)}
                      </span>
                      <span className="col-timeago">
                        {getTimeAgo(click.timestamp)}
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
