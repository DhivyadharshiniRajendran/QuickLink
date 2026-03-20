import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UrlProvider } from './context/UrlContext';
import { FullPageLoader } from './components/shared/FullPageLoader';
import { Header } from './components/shared/Header';
import { Notification } from './components/shared/Notification';
import { Dashboard } from './pages/Dashboard';
import { AnalyticsOverviewPage } from './pages/AnalyticsOverviewPage';
import { AnalyticsDetail } from './pages/AnalyticsDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useUrlContext } from './context/UrlContext';
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return token ? element : <Navigate to="/login" replace />;
};

function AppContent() {
  const { notification } = useUrlContext();
  const { token, loading } = useAuth();

  // Show full-page loader during initial auth check
  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <>
      {token && <Header />}
      <Notification message={notification?.message} type={notification?.type} />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/analytics-overview" element={<ProtectedRoute element={<AnalyticsOverviewPage />} />} />
          <Route path="/analytics/:id" element={<ProtectedRoute element={<AnalyticsDetail />} />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <UrlProvider>
          <AppContent />
        </UrlProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
