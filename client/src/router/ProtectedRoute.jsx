// File path: /client/src/router/ProtectedRoute.jsx
// Purpose: Route guard component for authenticated routes
// Architecture: Checks authentication and role, redirects appropriately

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Guards routes that require authentication and specific roles
 * Redirects unauthenticated users to login
 * Redirects users without proper role to their appropriate dashboard
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
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

  // If no specific roles required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasAccess = allowedRoles.includes(user?.role);

  if (!hasAccess) {
    // Redirect to appropriate dashboard based on user role
    const roleRedirects = {
      worker: '/worker/dashboard',
      employer: '/employer/dashboard',
      super_admin: '/admin/dashboard',
      verification_admin: '/admin/dashboard',
      finance_admin: '/admin/dashboard',
      office_staff: '/admin/dashboard',
    };

    const redirectPath = roleRedirects[user?.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;