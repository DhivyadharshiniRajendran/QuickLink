import React, { useState } from 'react';
import { useUrlContext } from '../context/UrlContext';
import { isValidUrl } from '../utils/urlValidator';
import { Toast } from './shared/Toast';
import { Spinner } from './shared/Spinner';
import './styles/UrlShortenerForm.css';

export const UrlShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState('');
  const { createShortUrl } = useUrlContext();

  const getUrlError = () => {
    if (!url) return null;
    if (!isValidUrl(url)) {
      return 'Please enter a valid URL starting with http:// or https://';
    }
    return null;
  };

  const urlError = getUrlError();
  const isValid = url && !urlError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorToast('');

    // Validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await createShortUrl(url);
      if (result) {
        setUrl('');
        setError('');
        setCreatedUrl(result);
        setSuccessToast(true);
        setTimeout(() => setCreatedUrl(null), 5000);
      } else {
        setErrorToast('Failed to create short URL. Please try again.');
      }
    } catch (err) {
      setErrorToast('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {successToast && (
        <Toast
          message="Short URL created successfully!"
          type="success"
          onClose={() => setSuccessToast(false)}
        />
      )}
      {errorToast && (
        <Toast
          message={errorToast}
          type="error"
          onClose={() => setErrorToast('')}
        />
      )}
      {createdUrl && (
        <div className="success-message-section">
          <div className="success-box">
            <div className="success-icon">✅</div>
            <div className="success-content">
              <h3>Short URL Created!</h3>
              <p>Your short URL is ready to share:</p>
              <div className="created-url-display">
                <code>{createdUrl.shortUrl}</code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(createdUrl.shortUrl);
                  }}
                  className="copy-success-btn"
                >
                  📋 Copy
                </button>
              </div>
              <p className="original-url-info">
                Original: {createdUrl.originalUrl.length > 60 ? createdUrl.originalUrl.substring(0, 60) + '...' : createdUrl.originalUrl}
              </p>
            </div>
          </div>
        </div>
      )}
      <form className="url-shortener-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url-input" className="form-label">
            Paste your long URL here
          </label>
          <div className="input-wrapper">
            <input
              id="url-input"
              type="text"
              placeholder="https://www.example.com/long/url/path"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              className={`form-input ${error || urlError ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="shorten-btn"
              disabled={isLoading || !isValid}
            >
              {isLoading ? (
                <span className="button-spinner-wrapper">
                  <Spinner size="small" />
                  Creating...
                </span>
              ) : (
                'Shorten URL'
              )}
            </button>
          </div>
          {(error || urlError) && (
            <span className="field-error">{error || urlError}</span>
          )}
        </div>
      </form>
    </>
  );
};
