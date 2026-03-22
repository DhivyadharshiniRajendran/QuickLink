import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/api';

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (email, password, confirmPassword) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return false;
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup');
      return false;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return false;
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
