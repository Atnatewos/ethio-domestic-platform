// File path: /client/src/layouts/WorkerLayout.jsx
// Purpose: Layout for worker dashboard pages
// Architecture: Sidebar navigation with mobile-responsive bottom nav

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
 * WorkerLayout Component
 * Dashboard layout with sidebar navigation for workers
 * Includes trust score display and quick actions
 */
const WorkerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useConfig();

  const navigation = [
    { name: 'Dashboard', path: '/worker/dashboard', icon: '📊' },
    { name: 'Find Jobs', path: '/worker/jobs', icon: '🔍' },
    { name: 'Applications', path: '/worker/applications', icon: '📋' },
    { name: 'Verification', path: '/worker/verification', icon: '✅' },
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

export default WorkerLayout;