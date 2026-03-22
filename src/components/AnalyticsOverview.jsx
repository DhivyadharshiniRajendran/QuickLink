import React from 'react';
import { useUrlContext } from '../context/UrlContext';
import { formatDateTime, getTimeAgo } from '../utils/urlValidator';
import './styles/AnalyticsOverview.css';

export const AnalyticsOverview = () => {
  const { urls } = useUrlContext();

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const totalUrls = urls.length;
  
  const lastVisited = urls
    .filter((url) => url.clicks > 0)
    .sort((a, b) => {
      const aLastClick =
        a.clickHistory.length > 0
          ? new Date(a.clickHistory[a.clickHistory.length - 1].timestamp)
          : new Date(0);
      const bLastClick =
        b.clickHistory.length > 0
          ? new Date(b.clickHistory[b.clickHistory.length - 1].timestamp)
          : new Date(0);
      return bLastClick - aLastClick;
    })[0];

  const recentVisits = urls
    .flatMap((url) =>
      url.clickHistory.map((click) => ({
        ...click,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        urlId: url.id,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    )
    .slice(0, 5);

  return (
    <div className="analytics-overview">
      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <span className="stat-label">Total URLs Created</span>
            <span className="stat-value">{totalUrls}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👆</div>
          <div className="stat-info">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value">{totalClicks}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <span className="stat-label">Last Visit</span>
            <span className="stat-value">
              {lastVisited
                ? getTimeAgo(
                    lastVisited.clickHistory[lastVisited.clickHistory.length - 1]?.timestamp
                  )
                : 'No visits yet'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-label">Avg Clicks/URL</span>
            <span className="stat-value">
              {totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : '0'}
            </span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3 className="activity-title">Recent Activity</h3>
        {recentVisits.length === 0 ? (
          <div className="no-activity">
            <p>No recent visits yet</p>
          </div>
        ) : (
          <div className="activity-list">
            {recentVisits.map((visit, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-icon">👆</div>
                <div className="activity-details">
                  <div className="activity-url">
                    <code className="short-url-code">{visit.shortUrl}</code>
                    <a
                      href={visit.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="activity-original-url"
                      title={visit.originalUrl}
                    >
                      {visit.originalUrl.length > 40
                        ? visit.originalUrl.substring(0, 40) + '...'
                        : visit.originalUrl}
                    </a>
                  </div>
                  <span className="activity-time">
                    {getTimeAgo(visit.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
