import React from 'react';
import { useUrlContext } from '../context/UrlContext';
import { ShortUrlCard } from './ShortUrlCard';
import { EmptyState } from './shared/EmptyState';
import { formatDate } from '../utils/urlValidator';
import './styles/ShortUrlsTable.css';

export const ShortUrlsTable = () => {
  const { urls } = useUrlContext();

  if (urls.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No shortened URLs yet"
        message="Create your first short URL to get started"
      />
    );
  }

  return (
    <div className="short-urls-section">
      <h2 className="section-title">My Shortened Links</h2>
      <div className="table-header">
        <div className="header-row">
          <div className="col-original">Original URL</div>
          <div className="col-short">Short URL</div>
          <div className="col-created">Created</div>
          <div className="col-clicks">Clicks</div>
          <div className="col-actions">Actions</div>
        </div>
      </div>
      <div className="table-body">
        {urls.map((url) => (
          <ShortUrlCard key={url.id} url={url} />
        ))}
      </div>
    </div>
  );
};
