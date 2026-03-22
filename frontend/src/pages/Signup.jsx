import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/shared/Toast';
import { Spinner } from '../components/shared/Spinner';
import '../styles/auth.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { signup } = useAuth();

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

  const getConfirmPasswordError = () => {
    if (!touched.confirmPassword) return null;
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  // Check if form is valid
  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    password === confirmPassword;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched for validation display
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    const success = await signup(email, password, confirmPassword);

    if (success) {
      setSuccess(true);
      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setLoading(false);
    }
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const confirmPasswordError = getConfirmPasswordError();

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
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join QuickLink and start shortening URLs</p>

          {error && (
            <div className="auth-error-banner">
              <span className="error-icon">✕</span>
              <div>
                <p className="error-title">Sign up failed</p>
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
                  placeholder="At least 8 characters"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                disabled={loading}
                className={`form-input ${confirmPasswordError ? 'input-error' : ''}`}
              />
              {confirmPasswordError && <span className="field-error">{confirmPasswordError}</span>}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <span className="button-with-spinner">
                  <Spinner size="small" />
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
