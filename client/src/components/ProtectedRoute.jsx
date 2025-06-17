import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requireAuth = true }) {
  const user = localStorage.getItem('user');

  // If requireAuth is true, redirect to login if not authenticated
  // If requireAuth is false, redirect to home if authenticated
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute; 