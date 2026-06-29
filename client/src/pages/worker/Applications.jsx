// File path: /client/src/pages/worker/Applications.jsx
// Purpose: Modern applications tracking page with visual timeline
// Architecture: Uses React Query and visual status pipeline

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getMyApplications } from '../../services/application.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';

const statusSteps = [
  { key: 'applied', label: 'Applied', icon: '📤' },
  { key: 'shortlisted', label: 'Shortlisted', icon: '⭐' },
  { key: 'interviewed', label: 'Interviewed', icon: '💬' },
  { key: 'trial', label: 'Trial', icon: '🔬' },
  { key: 'hired', label: 'Hired', icon: '✅' },
];

const Applications = () => {
  const [filter, setFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['worker-applications', filter],
    queryFn: () => getMyApplications({ status: filter || undefined }),
  });

  const applications = data?.data?.items || [];

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

  const getCurrentStep = (status) => {
    if (status === 'rejected') return -1;
    const index = statusSteps.findIndex(step => step.key === status);
    return index;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="applications-page"
    >
      {/* Page Header */}
      <div className="page-header">
        <h1>My Applications 📋</h1>
        <p>Track the status of your job applications.</p>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === '' ? 'active' : ''}`}
            onClick={() => setFilter('')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'applied' ? 'active' : ''}`}
            onClick={() => setFilter('applied')}
          >
            Applied
          </button>
          <button
            className={`filter-tab ${filter === 'shortlisted' ? 'active' : ''}`}
            onClick={() => setFilter('shortlisted')}
          >
            Shortlisted
          </button>
          <button
            className={`filter-tab ${filter === 'interviewed' ? 'active' : ''}`}
            onClick={() => setFilter('interviewed')}
          >
            Interviewed
          </button>
          <button
            className={`filter-tab ${filter === 'hired' ? 'active' : ''}`}
            onClick={() => setFilter('hired')}
          >
            Hired
          </button>
          <button
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </Card>

      {/* Applications List */}
      {isLoading ? (
        <div className="applications-list">
          {[1, 2, 3].map(i => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications found</h3>
            <p>Start browsing jobs and apply to positions that match your skills.</p>
          </div>
        </Card>
      ) : (
        <div className="applications-list">
          {applications.map((app, index) => {
            const currentStep = getCurrentStep(app.status);
            const isRejected = app.status === 'rejected';

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="application-card">
                  <div className="application-content">
                    {/* Header */}
                    <div className="application-header">
                      <div className="application-info">
                        <h3 className="application-title">{app.workerType}</h3>
                        <p className="application-employer">{app.employerName}</p>
                      </div>
                      <Badge variant={getStatusColor(app.status)} size="lg">
                        {app.status}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="application-details">
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{app.employerZone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Salary:</span>
                        <span className="detail-value">
                          {app.salaryMin?.toLocaleString()} - {app.salaryMax?.toLocaleString()} ETB
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Applied:</span>
                        <span className="detail-value">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    {!isRejected && currentStep >= 0 && (
                      <div className="status-timeline">
                        {statusSteps.map((step, stepIndex) => {
                          const isCompleted = stepIndex <= currentStep;
                          const isCurrent = stepIndex === currentStep;

                          return (
                            <div
                              key={step.key}
                              className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                            >
                              <div className="timeline-icon">{step.icon}</div>
                              <div className="timeline-label">{step.label}</div>
                              {stepIndex < statusSteps.length - 1 && (
                                <div className="timeline-line" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {isRejected && (
                      <div className="rejected-message">
                        <span className="rejected-icon">❌</span>
                        <span>This application was not successful. Keep applying to other jobs!</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Applications;