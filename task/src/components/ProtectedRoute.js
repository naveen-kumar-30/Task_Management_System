import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if a token exists

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // If token exists, render the child components (e.g., Dashboard)
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;