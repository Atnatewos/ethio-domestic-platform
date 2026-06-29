// File path: /client/src/pages/employer/Applicants.jsx
// Purpose: Modern applicants management page with status updates
// Architecture: Uses React Query, mutations, and visual status pipeline

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getJobApplicants, updateApplicationStatus } from '../../services/application.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['job-applicants', jobId],
    queryFn: () => getJobApplicants(jobId),
  });

  const mutation = useMutation({
    mutationFn: ({ applicationId, status }) => updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      toast.success('Application status updated');
      queryClient.invalidateQueries(['job-applicants', jobId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });

  const applicants = data?.data?.items || [];

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

  const handleStatusUpdate = (applicationId, newStatus, applicantName) => {
    if (window.confirm(`Are you sure you want to ${newStatus} ${applicantName}?`)) {
      mutation.mutate({ applicationId, status: newStatus });
    }
  };

  const getTrustBadgeClass = (trustScore) => {
    if (!trustScore) return 'new';
    const tier = trustScore.tier || 'new';
    return tier === 'inProgress' ? 'progress' : tier;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="applicants-page"
    >
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Job Applicants 👥</h1>
            <p>Review and manage candidates for this position.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/employer/my-jobs')}>
            ← Back to Jobs
          </Button>
        </div>
      </div>

      {/* Applicants List */}
      {isLoading ? (
        <div className="applicants-list">
          {[1, 2, 3].map(i => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No applicants yet</h3>
            <p>Share your job posting to attract more verified workers.</p>
          </div>
        </Card>
      ) : (
        <div className="applicants-list">
          {applicants.map((app, index) => (
            <motion.div
              key={app.applicationId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="applicant-card">
                <div className="applicant-content">
                  {/* Header */}
                  <div className="applicant-header">
                    <div className="applicant-avatar">
                      {app.photo ? (
                        <img src={app.photo} alt={app.fullName} />
                      ) : (
                        <div className="avatar-placeholder">👤</div>
                      )}
                    </div>
                    <div className="applicant-info">
                      <h3 className="applicant-name">{app.fullName}</h3>
                      <div className="applicant-meta">
                        <span>{app.experience} years exp</span>
                        <span>•</span>
                        <Badge variant={getTrustBadgeClass(app.trustScore)} size="sm">
                          {app.trustScore?.tier || 'new'}
                        </Badge>
                        <span>•</span>
                        <span className="worker-type">{app.workerType}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(app.status)} size="lg">
                      {app.status}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="applicant-actions">
                    {app.status === 'applied' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusUpdate(app.applicationId, 'shortlisted', app.fullName)}
                          loading={mutation.isLoading}
                        >
                          ⭐ Shortlist
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusUpdate(app.applicationId, 'rejected', app.fullName)}
                          loading={mutation.isLoading}
                        >
                          ✗ Reject
                        </Button>
                      </>
                    )}

                    {app.status === 'shortlisted' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusUpdate(app.applicationId, 'interviewed', app.fullName)}
                          loading={mutation.isLoading}
                        >
                          💬 Interview
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusUpdate(app.applicationId, 'rejected', app.fullName)}
                          loading={mutation.isLoading}
                        >
                          ✗ Reject
                        </Button>
                      </>
                    )}

                    {app.status === 'interviewed' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusUpdate(app.applicationId, 'hired', app.fullName)}
                          loading={mutation.isLoading}
                        >
                          ✓ Hire
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusUpdate(app.applicationId, 'rejected', app.fullName)}
                          loading={mutation.isLoading}
                        >
                          ✗ Reject
                        </Button>
                      </>
                    )}

                    {app.status === 'trial' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.applicationId, 'hired', app.fullName)}
                        loading={mutation.isLoading}
                      >
                        ✓ Confirm Hire
                      </Button>
                    )}

                    {(app.status === 'hired' || app.status === 'rejected') && (
                      <div className="status-message">
                        {app.status === 'hired' ? '✅ This worker has been hired' : '❌ This application was rejected'}
                      </div>
                    )}
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

export default Applicants;