// src/components/SocialLoginIcons.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const SocialLoginIcons = () => {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log('Google Login Success (Credential Response):', credentialResponse);

    const idToken = credentialResponse.credential; // This is the ID Token

    if (!idToken) {
      console.error('No ID Token received from Google login.');
      return;
    }

    try {
      const backendResponse = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }), // Send the ID Token to backend
      });

      const data = await backendResponse.json();

      if (backendResponse.ok && data.success) {
        localStorage.setItem('token', data.token); // Store your backend's JWT

        // ⭐ ADD THESE LINES HERE FOR GOOGLE LOGIN ⭐
        if (data.data && data.data.displayName) {
          localStorage.setItem('userName', data.data.displayName);
        }
        if (data.data && data.data.email) {
          localStorage.setItem('userEmail', data.data.email);
        }
        // ⭐ END ADDITION ⭐

        navigate('/DashboardPage'); // Redirect to dashboard
      } else {
        console.error('Backend Google Login Error:', data.error || 'Something went wrong on the backend.');
        // Display an error message to the user here
      }
    } catch (error) {
      console.error('Error sending Google token to backend:', error);
      // Handle network errors or other issues
    }
  };

  const handleGoogleLoginError = (errorResponse) => {
    console.log('Google Login Failed:', errorResponse);
    // You might want to display an error message to the user here
  };

  const handleFacebookLogin = () => {
    console.log('Initiating Facebook Login...');
    alert('Facebook login not implemented yet.'); // Placeholder
  };

  const handleTwitterLogin = () => {
    console.log('Initiating X (Twitter) Login...');
    alert('X (Twitter) login not implemented yet.'); // Placeholder
  };

  return (
    <div className="social-login-icons">
      {/* Use the GoogleLogin component */}
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        // Custom render prop to use your existing image
        render={renderProps => (
          <img
            src="https://img.icons8.com/color/48/000000/google-logo.png"
            alt="Google"
            onClick={renderProps.onClick} // This connects your image click to Google login
            disabled={renderProps.disabled} // Disable if Google button is disabled
            style={{ cursor: 'pointer' }} // Visual hint for clickability
          />
        )}
      />

      
    </div>
  );
};

export default SocialLoginIcons;