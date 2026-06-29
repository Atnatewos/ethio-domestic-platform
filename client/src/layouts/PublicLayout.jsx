// File path: /client/src/layouts/PublicLayout.jsx
// Purpose: Layout for public pages (Landing, Login, Register, Directory)
// Architecture: Clean, minimal design with header and footer

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import NotificationBell from '../components/ui/NotificationBell';

/**
 * Page transition animation variants
 */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * PublicLayout Component
 * Provides consistent header and footer for public pages
 * Includes navigation and user authentication state
 */
const PublicLayout = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { config } = useConfig();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Browse Workers', path: '/directory' },
  ];

  const authNavigation = !isAuthenticated
    ? [
        { name: 'Login', path: '/login' },
        { name: 'Register Worker', path: '/register/worker' },
        { name: 'Register Employer', path: '/register/employer' },
      ]
    : [];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <h1 className="logo">
              🏠 {config?.platform?.name || 'EthioDomestic'}
            </h1>
          </Link>

          {/* User Info & Notifications */}
          {isAuthenticated && (
            <div className="user-info">
              <NotificationBell />
              <span className="user-name">Welcome, {user?.fullName}</span>
              <Link 
                to={user?.role === 'worker' ? '/worker/dashboard' : 
                    user?.role === 'employer' ? '/employer/dashboard' : 
                    '/admin/dashboard'}
                className="btn btn-primary btn-sm"
              >
                Dashboard
              </Link>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="main-nav">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          {authNavigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Tagline */}
        {!isAuthenticated && (
          <p className="tagline">{config?.platform?.tagline}</p>
        )}
      </header>

      {/* Main Content with Animation */}
      <main className="app-main">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 {config?.platform?.name || 'EthioDomestic'}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;