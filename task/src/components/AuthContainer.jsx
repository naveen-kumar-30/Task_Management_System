import React from 'react';
import PropTypes from 'prop-types';
import LoginIllustration from '../assets/login-illustration.png';
import SignUpIllustration from '../assets/signup-illustration.png';

const AuthContainer = ({ children, type }) => {
  const illustrationSrc = type === 'login' ? LoginIllustration : SignUpIllustration;
  const illustrationAlt = type === 'login' ? 'Login Illustration' : 'Sign Up Illustration';

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        {children}
      </div>
      <div className="auth-illustration-wrapper">
        <img src={illustrationSrc} alt={illustrationAlt} />
      </div>
    </div>
  );
};

AuthContainer.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['login', 'signup']).isRequired,
};

export default AuthContainer;