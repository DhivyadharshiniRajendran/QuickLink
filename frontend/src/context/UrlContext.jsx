import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Fetch user's URLs from backend
  const fetchUrls = useCallback(
    async (showMessage = false) => {
      if (!token) {
        setUrls([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/urls/my-urls`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUrls(data.urls);
          if (showMessage) {
            showNotification('URLs loaded successfully!');
          }
        } else {
          showNotification('Failed to load URLs', 'error');
        }
      } catch (error) {
        console.error('Fetch URLs error:', error);
        showNotification('Error loading URLs', 'error');
      } finally {
        setLoading(false);
      }
    },
    [token, showNotification]
  );

  // Load URLs when user is authenticated
  useEffect(() => {
    if (token) {
      fetchUrls();
    }
  }, [token, fetchUrls]);

  const createShortUrl = useCallback(
    async (originalUrl) => {
      if (!token) {
        showNotification('Please log in to create short URLs', 'error');
        return null;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/urls/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ originalUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
          showNotification(data.error || 'Failed to create short URL', 'error');
          return null;
        }

        setUrls((prev) => [data.shortUrl, ...prev]);
        showNotification('Short URL created successfully!');
        return data.shortUrl;
      } catch (error) {
        console.error('Create short URL error:', error);
        showNotification('Error creating short URL', 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, showNotification]
  );

  const deleteUrl = useCallback(
    async (id) => {
      if (!token) {
        showNotification('Please log in to delete URLs', 'error');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/urls/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setUrls((prev) => prev.filter((url) => url.id !== id));
          showNotification('URL deleted successfully!', 'info');
        } else {
          showNotification('Failed to delete URL', 'error');
        }
      } catch (error) {
        console.error('Delete URL error:', error);
        showNotification('Error deleting URL', 'error');
      } finally {
        setLoading(false);
      }
    },
    [token, showNotification]
  );

  const recordClick = useCallback((id) => {
    // Clicks are recorded automatically on the backend when redirect happens
    // Update local state to reflect the click
    setUrls((prev) =>
      prev.map((url) =>
        url.id === id
          ? {
              ...url,
              clicks: (url.clicks || 0) + 1,
            }
          : url
      )
    );
  }, []);

  const getUrlById = useCallback(
    (id) => urls.find((url) => url.id === id),
    [urls]
  );

  const getUrlDetails = useCallback(
    async (id) => {
      if (!token) {
        showNotification('Please log in', 'error');
        return null;
      }

      try {
        const response = await fetch(`${API_URL}/urls/details/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          showNotification('Failed to load URL details', 'error');
          return null;
        }
      } catch (error) {
        console.error('Get URL details error:', error);
        showNotification('Error loading URL details', 'error');
        return null;
      }
    },
    [token, showNotification]
  );

  const value = {
    urls,
    notification,
    loading,
    showNotification,
    createShortUrl,
    deleteUrl,
    recordClick,
    getUrlById,
    getUrlDetails,
    fetchUrls,
  };

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
};

export const useUrlContext = () => {
  const context = React.useContext(UrlContext);
  if (!context) {
    throw new Error('useUrlContext must be used within UrlProvider');
  }
  return context;
};
