import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/shared/Toast';
import { Spinner } from '../components/shared/Spinner';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { login, error } = useAuth();

  // Validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => password.length >= 8;

  // Get field-specific errors
  const getEmailError = () => {
    if (!touched.email) return null;
    if (!email) return 'Email is required';
    if (!isValidEmail(email)) return 'Please enter a valid email (e.g., user@example.com)';
    return null;
  };

  const getPasswordError = () => {
    if (!touched.password) return null;
    if (!password) return 'Password is required';
    if (!isValidPassword(password)) return 'Password must be at least 8 characters';
    return null;
  };

  // Check if form is valid
  const isFormValid = email && password && isValidEmail(email) && isValidPassword(password);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    setTouched({ email: true, password: true });

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    const success = await login(email, password);

    if (success) {
      setSuccess(true);
      setSuccessMessage('Successfully signed in! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setLoading(false);
    }
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();

  return (
    <>
      {success && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccess(false)}
          autoClose={false}
        />
      )}
      <div className="auth-container">
        <div className="auth-box">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your QuickLink account</p>

          {error && (
            <div className="auth-error-banner">
              <span className="error-icon">✕</span>
              <div>
                <p className="error-title">Sign in failed</p>
                <p className="error-message">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={loading}
                className={`form-input ${emailError ? 'input-error' : ''}`}
              />
              {emailError && <span className="field-error">{emailError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                  className={`form-input ${passwordError ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordError && <span className="field-error">{passwordError}</span>}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <span className="button-with-spinner">
                  <Spinner size="small" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}
