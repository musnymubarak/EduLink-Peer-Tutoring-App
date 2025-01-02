import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // Redirect to Login if token doesn't exist
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
