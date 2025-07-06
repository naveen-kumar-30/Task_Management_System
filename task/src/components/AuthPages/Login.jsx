// src/components/authPages/Login.js
import React, { useState } from 'react'; // ADDED: useState for managing form input and state
import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // ADDED: useNavigate for redirection

import AuthContainer from '../AuthContainer'; // Path confirmed: src/components/AuthContainer.js
import SocialLoginIcons from '../SocialLoginIcons'; // Path confirmed: src/components/SocialLoginIcons.js
import '../../styles/main.css'; // Path confirmed: src/styles/Auth.css


const Login = () => {
  // ADDED: State variables for form inputs, loading, and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // ADDED: Function to handle form submission and backend API call
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setLoading(true); // Start loading state
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password to backend
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful: store token and redirect
        localStorage.setItem('token', data.token); // Store JWT in local storage
        navigate('/DashboardPage'); // Redirect to dashboard page
      } else {
        // Login failed: display error message from backend
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Network or other unexpected errors
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <AuthContainer type="login">
      <h2>Sign In</h2>
      {/* MODIFIED: Added onSubmit handler to form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <FaUser className="icon" />
          {/* MODIFIED: Changed type to 'email', added value and onChange handlers */}
          <input
            type="email"
            placeholder="Enter Email" // Changed placeholder to match 'email' input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // HTML5 validation: makes the field mandatory
          />
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          {/* MODIFIED: Added value and onChange handlers */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        {/* ADDED: Display error message if present */}
        {error && <p className="error-message">{error}</p>}
        {/* MODIFIED: Added type="submit" and disabled attribute based on loading state */}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'} {/* Change button text during loading */}
        </button>
      </form>

      <div className="or-divider">
        <span>Or, Login with</span>
      </div>
      <SocialLoginIcons />
      <p className="auth-link">
        Don't have an account? <Link to="/signup">Create One</Link>
      </p>
    </AuthContainer>
  );
};

export default Login;