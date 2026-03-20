import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUrlContext } from '../context/UrlContext';
import { formatDate } from '../utils/urlValidator';
import './styles/ShortUrlCard.css';

export const ShortUrlCard = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const { deleteUrl, showNotification } = useUrlContext();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(
      window.location.origin + '/' + url.shortCode
    );
    setCopied(true);
    showNotification('Short URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteUrl(url.id);
    }
  };

  return (
    <div className="short-url-card">
      <div className="card-content">
        <div className="url-row">
          <div className="url-section">
            <label className="url-label">Original URL</label>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="original-url"
              title={url.originalUrl}
            >
              {url.originalUrl.length > 50
                ? url.originalUrl.substring(0, 50) + '...'
                : url.originalUrl}
            </a>
          </div>
        </div>

        <div className="card-grid">
          <div className="url-section">
            <label className="url-label">Short URL</label>
            <div className="short-url-wrapper">
              <code className="short-url">{url.shortUrl}</code>
              <button
                onClick={handleCopyClick}
                className={`copy-btn ${copied ? 'copied' : ''}`}
                title="Copy short URL"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>

          <div className="stat-section">
            <label className="url-label">Created</label>
            <span className="stat-value">{formatDate(url.createdAt)}</span>
          </div>

          <div className="stat-section">
            <label className="url-label">Clicks</label>
            <span className="click-count">{url.clicks}</span>
          </div>

          <div className="stat-section">
            <label className="url-label">Actions</label>
            <div className="action-buttons">
              <Link
                to={`/analytics/${url.id}`}
                className="view-analytics-btn"
                title="View analytics"
              >
                📊 Analytics
              </Link>
              <button
                onClick={handleDelete}
                className="delete-btn"
                title="Delete URL"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
