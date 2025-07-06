// src/components/authPages/SignUp.js
import React, { useState } from 'react'; // ADDED: useState
import { FaUser, FaLock, FaEnvelope, FaFingerprint } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // ADDED: useNavigate
import '../../styles/main.css'
import AuthContainer from '../AuthContainer'; // Path confirmed: src/components/AuthContainer.js
// import SocialLoginIcons from '../SocialLoginIcons'; // Uncomment if you want social icons here
// Path confirmed: src/styles/Auth.css


const SignUp = () => {
  // ADDED: State variables for form inputs, loading, and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // ADDED: Function to handle form submission and backend API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation: check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return; // Stop function execution if passwords don't match
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send email and password to backend. Note: other fields (first/last name, username) are not sent unless your backend expects them.
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Registration successful: store token and redirect
        localStorage.setItem('token', data.token);
        navigate('/DashboardPage'); // Redirect to dashboard page
      } else {
        // Registration failed: display error message from backend
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Network or other unexpected errors
      console.error('Sign Up error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <AuthContainer type="signup">
      <h2>Sign Up</h2>
      {/* MODIFIED: Added onSubmit handler to form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="Enter First Name" /> {/* No backend binding */}
        </div>
        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="Enter Last Name" /> {/* No backend binding */}
        </div>
        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="Enter Username" /> {/* No backend binding */}
        </div>
        <div className="input-group">
          <FaEnvelope className="icon" />
          {/* MODIFIED: Added value and onChange handlers */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          {/* MODIFIED: Added value and onChange handlers */}
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaFingerprint className="icon" />
          {/* MODIFIED: Added value and onChange handlers */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="agreeTerms" />
          <label htmlFor="agreeTerms">I agree to all terms</label>
        </div>
        {/* ADDED: Display error message if present */}
        {error && <p className="error-message">{error}</p>}
        {/* MODIFIED: Added type="submit" and disabled attribute based on loading state */}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Signing Up...' : 'Register'}
        </button>
      </form>

      {/* If you want SocialLoginIcons on signup page too */}
      {/* <div className="or-divider">
        <span>Or, Sign Up with</span>
      </div>
      <SocialLoginIcons /> */}

      <p className="auth-link">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </AuthContainer>
  );
};

export default SignUp;