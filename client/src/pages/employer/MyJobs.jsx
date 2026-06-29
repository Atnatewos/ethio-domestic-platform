// File path: /client/src/pages/employer/MyJobs.jsx
// Purpose: Modern jobs management page with filters and actions
// Architecture: Uses React Query, Framer Motion, and modern table design

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyJobs } from '../../services/job.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

const MyJobs = () => {
  const [filter, setFilter] = useState('active');

  const { data, isLoading } = useQuery({
    queryKey: ['employer-jobs', filter],
    queryFn: () => getMyJobs({ status: filter }),
  });

  const jobs = data?.data?.items || [];

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-jobs-page"
    >
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>My Jobs 💼</h1>
            <p>Manage your job postings and view applicants.</p>
          </div>
          <Button as="link" to="/employer/post-job" variant="primary">
            ➕ Post New Job
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filter === 'filled' ? 'active' : ''}`}
            onClick={() => setFilter('filled')}
          >
            Filled
          </button>
          <button
            className={`filter-tab ${filter === 'closed' ? 'active' : ''}`}
            onClick={() => setFilter('closed')}
          >
            Closed
          </button>
        </div>
      </Card>

      {/* Jobs List */}
      {isLoading ? (
        <div className="jobs-list">
          {[1, 2, 3].map(i => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h3>No {filter} jobs found</h3>
            <p>Post a new job to start receiving applications.</p>
            <Button as="link" to="/employer/post-job" variant="primary">
              Post Your First Job
            </Button>
          </div>
        </Card>
      ) : (
        <div className="jobs-list">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hoverable className="job-card-modern">
                <div className="job-card-content">
                  {/* Header */}
                  <div className="job-card-header">
                    <div className="job-info">
                      <h3 className="job-title">{job.workerType}</h3>
                      <div className="job-meta">
                        <span>{job.schedule === 'full_time' ? 'Full-time' : 'Part-time'}</span>
                        <span>•</span>
                        <span>{job.housing === 'live_in' ? 'Live-in' : 'Live-out'}</span>
                        {job.isUrgent && (
                          <>
                            <span>•</span>
                            <Badge variant="warning" size="sm">⚡ Urgent</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(job.status)} size="lg">
                      {job.status}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="job-details-grid">
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <div className="detail-content">
                        <div className="detail-label">Salary Range</div>
                        <div className="detail-value">
                          {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()} ETB
                        </div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <div className="detail-content">
                        <div className="detail-label">Applicants</div>
                        <div className="detail-value">{job.applicantCount || 0}</div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div className="detail-content">
                        <div className="detail-label">Posted</div>
                        <div className="detail-value">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="job-actions">
                    <Button
                      as="link"
                      to={`/employer/my-jobs/${job.id}/applicants`}
                      variant="primary"
                      size="sm"
                    >
                      View Applicants
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyJobs;