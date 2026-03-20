import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🔗</span>
          <span className="logo-text">QuickLink</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
          <Link to="/analytics-overview" className="nav-link">
            Analytics
          </Link>
        </nav>

        <div className="user-menu">
          {user && <span className="user-name">{user.email}</span>}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
