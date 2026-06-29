// File path: /client/src/pages/worker/Dashboard.jsx
// Purpose: Modern worker dashboard with trust score visualization and quick actions
// Architecture: Uses React Query, Framer Motion, and modern UI components

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { config } = useConfig();

  // Fetch worker profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  });

  // Fetch worker applications
  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['worker-applications'],
    queryFn: async () => {
      const response = await fetch('/api/applications/my-applications?limit=5', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch applications');
      return response.json();
    },
  });

  const workerData = profile?.data;
  const trustScore = workerData?.trust_score || { total: 0, tier: 'new', breakdown: {} };
  const trustTierConfig = config?.trustScore?.tiers?.find(t => t.name === trustScore.tier) || {};

  const quickActions = [
    { label: 'Browse Jobs', path: '/worker/jobs', icon: '🔍', description: 'Find new opportunities' },
    { label: 'My Applications', path: '/worker/applications', icon: '📋', description: 'Track your status' },
    { label: 'Verification', path: '/worker/verification', icon: '✅', description: 'Upload documents' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      applied: 'info',
      shortlisted: 'warning',
      interviewed: 'warning',
      trial: 'warning',
      hired: 'success',
      rejected: 'danger',
    };
    return colors[status] || 'neutral';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="worker-dashboard"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Welcome back, {workerData?.full_name || user?.fullName}! 👋</h1>
          <p>Here's your profile overview and recent activity.</p>
        </div>
      </motion.div>

      {/* Trust Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="trust-score-card">
          <div className="trust-score-content">
            <div className="trust-score-header">
              <div className="trust-score-info">
                <h2>Your Trust Score</h2>
                <Badge variant={trustScore.tier === 'premium' ? 'success' : trustScore.tier === 'verified' ? 'info' : 'warning'} size="lg">
                  {trustTierConfig.icon} {trustTierConfig.label || trustScore.tier}
                </Badge>
              </div>
              <div className="trust-score-value">
                <motion.span
                  className="score-number"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  {trustScore.total}
                </motion.span>
                <span className="score-max">/100</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="trust-score-progress">
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${trustScore.total}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            {/* Breakdown */}
            <div className="trust-score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Verification</span>
                <span className="breakdown-value">{trustScore.breakdown.verification || 0}/50</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">References</span>
                <span className="breakdown-value">{trustScore.breakdown.references || 0}/20</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Reviews</span>
                <span className="breakdown-value">{trustScore.breakdown.reviews || 0}/20</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Response</span>
                <span className="breakdown-value">{trustScore.breakdown.responseRate || 0}/10</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="stats-grid">
        {profileLoading ? (
          <>
            <Skeleton.Card />
            <Skeleton.Card />
            <Skeleton.Card />
          </>
        ) : (
          <>
            <StatCard
              icon="💼"
              label="Worker Type"
              value={workerData?.worker_type || 'N/A'}
              color="blue"
            />
            <StatCard
              icon="⭐"
              label="Experience"
              value={`${workerData?.years_experience || 0} years`}
              color="green"
            />
            <StatCard
              icon="📋"
              label="Applications"
              value={applications?.data?.total || 0}
              color="purple"
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
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Link to={action.path} className="quick-action-card">
                    <div className="quick-action-icon">{action.icon}</div>
                    <div className="quick-action-content">
                      <div className="quick-action-label">{action.label}</div>
                      <div className="quick-action-description">{action.description}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Recent Applications */}
      <motion.div variants={itemVariants}>
        <Card>
          <Card.Header>
            <h2>Recent Applications</h2>
            <Link to="/worker/applications" className="view-all-link">
              View All →
            </Link>
          </Card.Header>
          <Card.Body>
            {appsLoading ? (
              <Skeleton.Table rows={3} />
            ) : applications?.data?.items?.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No applications yet</h3>
                <p>Start browsing jobs and apply to positions that match your skills.</p>
                <Button as="link" to="/worker/jobs" variant="primary">
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="applications-list">
                {applications?.data?.items?.slice(0, 5).map((app, index) => (
                  <motion.div
                    key={app.id}
                    className="application-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="application-info">
                      <div className="application-title">{app.workerType}</div>
                      <div className="application-employer">{app.employerName}</div>
                      <div className="application-salary">
                        {app.salaryMin?.toLocaleString()} - {app.salaryMax?.toLocaleString()} ETB
                      </div>
                    </div>
                    <div className="application-status">
                      <Badge variant={getStatusColor(app.status)} size="sm">
                        {app.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default WorkerDashboard;