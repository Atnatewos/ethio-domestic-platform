// File path: /client/src/layouts/AdminLayout.jsx
// Purpose: Layout for admin dashboard pages
// Architecture: Dark theme with comprehensive admin navigation

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
 * AdminLayout Component
 * Dashboard layout with comprehensive admin navigation
 * Dark theme for admin panel
 */
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useConfig();

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Approvals', path: '/admin/approvals', icon: '✅' },
    { name: 'Verification', path: '/admin/verification', icon: '🔍' },
    { name: 'Payments', path: '/admin/payments', icon: '💰' },
    { name: 'Workers', path: '/admin/workers', icon: '👷' },
    { name: 'Employers', path: '/admin/employers', icon: '🏢' },
    { name: 'Jobs', path: '/admin/jobs', icon: '💼' },
    { name: 'Reports', path: '/admin/reports', icon: '📝' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout admin-layout">
      {/* Header */}
      <header className="dashboard-header admin-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <h1 className="logo">🏠 {config?.platform?.name} Admin</h1>
          </Link>
        </div>

        <div className="header-right">
          <NotificationBell />
          <div className="user-menu">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role">({user?.role})</span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar admin-sidebar">
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
    </div>
  );
};

export default AdminLayout;