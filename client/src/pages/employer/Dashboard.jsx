// File path: /client/src/pages/employer/Dashboard.jsx
// Purpose: Modern employer dashboard with job stats and quick actions
// Architecture: Uses React Query, Framer Motion, and modern UI components

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

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

const EmployerDashboard = () => {
  const { user } = useAuth();

  // Fetch employer jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      const response = await fetch('/api/jobs/my-jobs?limit=5', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    },
  });

  // Fetch employer profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['employer-profile'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  });

  const jobs = jobsData?.data?.items || [];
  const totalApplicants = jobs.reduce((sum, job) => sum + parseInt(job.applicantCount || 0), 0);

  const quickActions = [
    { label: 'Post New Job', path: '/employer/post-job', icon: '➕', description: 'Create a job listing' },
    { label: 'My Jobs', path: '/employer/my-jobs', icon: '💼', description: 'Manage your postings' },
    { label: 'Browse Workers', path: '/employer/browse-workers', icon: '🔍', description: 'Find verified workers' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      filled: 'info',
      closed: 'neutral',
      draft: 'warning',
    };
    return colors[status] || 'neutral';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="employer-dashboard"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Welcome back, {profile?.data?.full_name || user?.fullName}! 👋</h1>
          <p>Here's an overview of your job postings and recent activity.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="stats-grid">
        {jobsLoading || profileLoading ? (
          <>
            <Skeleton.Card />
            <Skeleton.Card />
            <Skeleton.Card />
          </>
        ) : (
          <>
            <StatCard
              icon="💼"
              label="Active Jobs"
              value={jobsData?.data?.total || 0}
              color="blue"
            />
            <StatCard
              icon="👥"
              label="Total Applicants"
              value={totalApplicants}
              color="green"
            />
            <StatCard
              icon="✅"
              label="Hired Workers"
              value={jobs.filter(j => j.status === 'filled').length}
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

      {/* Recent Jobs */}
      <motion.div variants={itemVariants}>
        <Card>
          <Card.Header>
            <h2>Recent Job Postings</h2>
            <Link to="/employer/my-jobs" className="view-all-link">
              View All →
            </Link>
          </Card.Header>
          <Card.Body>
            {jobsLoading ? (
              <Skeleton.Table rows={3} />
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💼</div>
                <h3>No jobs posted yet</h3>
                <p>Post your first job to start receiving applications from verified workers.</p>
                <Button as="link" to="/employer/post-job" variant="primary">
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="jobs-list">
                {jobs.slice(0, 5).map((job, index) => (
                  <motion.div
                    key={job.id}
                    className="job-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="job-info">
                      <div className="job-title">{job.workerType}</div>
                      <div className="job-details">
                        {job.schedule === 'full_time' ? 'Full-time' : 'Part-time'} •{' '}
                        {job.housing === 'live_in' ? 'Live-in' : 'Live-out'}
                      </div>
                      <div className="job-salary">
                        {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()} ETB
                      </div>
                    </div>
                    <div className="job-stats">
                      <Badge variant={getStatusColor(job.status)} size="sm">
                        {job.status}
                      </Badge>
                      <div className="applicant-count">
                        <span className="count-icon">👥</span>
                        <span>{job.applicantCount || 0}</span>
                      </div>
                    </div>
                    <Link to={`/employer/my-jobs/${job.id}/applicants`} className="btn btn-outline btn-sm">
                      View Applicants
                    </Link>
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

export default EmployerDashboard;