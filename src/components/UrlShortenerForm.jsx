import React, { useState } from 'react';
import { useUrlContext } from '../context/UrlContext';
import { isValidUrl } from '../utils/urlValidator';
import './styles/UrlShortenerForm.css';

export const UrlShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createShortUrl } = useUrlContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    
    // Simulate API call
    setTimeout(() => {
      try {
        createShortUrl(url);
        setUrl('');
        setError('');
      } catch (err) {
        setError('Failed to create short URL. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
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
            className={`form-input ${error ? 'input-error' : ''}`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="shorten-btn"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? 'Creating...' : 'Shorten URL'}
          </button>
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
    </form>
  );
};
