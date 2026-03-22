import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUrlContext } from '../context/UrlContext';
import { ConfirmDialog } from './shared/ConfirmDialog';
import { Toast } from './shared/Toast';
import { formatDate } from '../utils/urlValidator';
import './styles/ShortUrlCard.css';

export const ShortUrlCard = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const { deleteUrl, showNotification } = useUrlContext();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(url.shortUrl);
    setCopied(true);
    showNotification('Short URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteUrl(url.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    setDeleteSuccess(true);
    setTimeout(() => setDeleteSuccess(false), 3000);
  };

  return (
    <>
      {deleteSuccess && (
        <Toast
          message="URL deleted successfully!"
          type="success"
          onClose={() => setDeleteSuccess(false)}
        />
      )}
      <ConfirmDialog
        title="Delete Short URL"
        message={`Are you sure you want to delete this short URL? This action cannot be undone.`}
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
      />
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
                  onClick={handleDeleteClick}
                  className="delete-btn"
                  title="Delete URL"
                  disabled={isDeleting}
                >
                  {isDeleting ? '⏳ Deleting...' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
