// File path: /client/src/components/layout/ProtectedRoute.jsx
// Purpose: Route guard component that restricts access to authenticated users with specific roles.
// Security: Prevents unauthorized access to worker, employer, and admin dashboards.

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication status is being determined
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="skeleton-text medium"></div>
        <div className="skeleton-text short"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if user role is not in the allowed roles list
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;