// File path: /client/src/layouts/EmployerLayout.jsx
// Purpose: Layout for employer dashboard pages
// Architecture: Similar to worker layout with employer-specific navigation

import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import NotificationBell from '../components/ui/NotificationBell';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

/**
 * EmployerLayout Component
 * Dashboard layout with sidebar navigation for employers
 * Includes job management and worker browsing
 */
const EmployerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useConfig();

  const navigation = [
    { name: 'Dashboard', path: '/employer/dashboard', icon: '📊' },
    { name: 'Post Job', path: '/employer/post-job', icon: '➕' },
    { name: 'My Jobs', path: '/employer/my-jobs', icon: '💼' },
    { name: 'Browse Workers', path: '/employer/browse-workers', icon: '🔍' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <h1 className="logo">🏠 {config?.platform?.name}</h1>
          </Link>
        </div>

        <div className="header-right">
          <NotificationBell />
          <div className="user-menu">
            <span className="user-name">{user?.fullName}</span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
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
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default EmployerLayout;