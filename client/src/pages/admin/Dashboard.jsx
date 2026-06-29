// File path: /client/src/pages/admin/Dashboard.jsx
// Purpose: Modern admin dashboard with animated stats and quick actions
// Architecture: Uses React Query for data fetching and react-hot-toast

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const AdminDashboard = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    },
  });

  const quickActions = [
    { label: 'Approve Workers', path: '/admin/approvals', icon: '✅', count: 5 },
    { label: 'Verify Documents', path: '/admin/verification', icon: '🔍', count: 12 },
    { label: 'Manage Payments', path: '/admin/payments', icon: '💰', count: 0 },
    { label: 'Platform Settings', path: '/admin/settings', icon: '⚙️', count: 0 },
  ];

  const handleQuickAction = (action) => {
    toast.success(`Navigating to ${action.label}...`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="admin-dashboard"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening on your platform.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="stats-grid">
        {isLoading ? (
          <>
            <Skeleton.Card />
            <Skeleton.Card />
            <Skeleton.Card />
            <Skeleton.Card />
          </>
        ) : (
          <>
            <StatCard
              icon="👷"
              label="Total Workers"
              value={stats?.data?.totalWorkers || 0}
              color="blue"
            />
            <StatCard
              icon="✅"
              label="Verified Workers"
              value={stats?.data?.verifiedWorkers || 0}
              color="green"
            />
            <StatCard
              icon="🏢"
              label="Total Employers"
              value={stats?.data?.totalEmployers || 0}
              color="purple"
            />
            <StatCard
              icon="💼"
              label="Active Jobs"
              value={stats?.data?.activeJobs || 0}
              color="yellow"
            />
          </>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <Card.Header>
            <h2>Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to={action.path} 
                    className="quick-action-card"
                    onClick={() => handleQuickAction(action)}
                  >
                    <div className="quick-action-icon">{action.icon}</div>
                    <div className="quick-action-content">
                      <div className="quick-action-label">{action.label}</div>
                      {action.count > 0 && (
                        <Badge variant="warning" size="sm">
                          {action.count} pending
                        </Badge>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <Card.Header>
            <h2>Recent Activity</h2>
          </Card.Header>
          <Card.Body>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">👷</div>
                <div className="activity-content">
                  <div className="activity-title">New worker registration</div>
                  <div className="activity-description">Abebe Kebede registered as a maid</div>
                </div>
                <div className="activity-time">2 hours ago</div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-content">
                  <div className="activity-title">Worker verified</div>
                  <div className="activity-description">Sara Mohammed's documents approved</div>
                </div>
                <div className="activity-time">5 hours ago</div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">💼</div>
                <div className="activity-content">
                  <div className="activity-title">New job posted</div>
                  <div className="activity-description">Looking for full-time nanny</div>
                </div>
                <div className="activity-time">1 day ago</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;