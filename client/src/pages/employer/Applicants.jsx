// File path: /client/src/pages/employer/Applicants.jsx
// Purpose: Employer applicants management page - review and manage job applicants.
// Architecture: Real-time applicant tracking with status updates.

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getJobApplicants, updateApplicationStatus } from '../../services/application.service';

const EmployerApplicants = ({ jobId, onNavigate }) => {
  const { toast, confirm } = useToast();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await getJobApplicants(jobId);
      if (response.success) {
        setApplicants(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus, applicantName) => {
    const confirmed = await confirm({
      title: `Update Application Status`,
      message: `Are you sure you want to mark ${applicantName} as ${newStatus}?`,
      confirmText: 'Confirm',
      type: newStatus === 'rejected' ? 'danger' : 'info'
    });

    if (!confirmed) return;

    try {
      const response = await updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        toast.success(`Application ${newStatus} successfully`);
        fetchApplicants();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getTrustBadgeClass = (trustScore) => {
    if (!trustScore) return 'new';
    const tier = trustScore.tier || 'new';
    return tier === 'inProgress' ? 'progress' : tier;
  };

  return (
    <div className="app-main">
      <div className="page-header d-flex items-center justify-between">
        <div>
          <h1>Job Applicants</h1>
          <p>Review and manage candidates for this position.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => onNavigate && onNavigate('employer-my-jobs')}>
          ← Back to Jobs
        </button>
      </div>

      {loading ? (
        <div className="skeleton-card" style={{ height: '400px' }}></div>
      ) : applicants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No applicants yet</h3>
          <p>Share your job posting to attract more verified workers.</p>
        </div>
      ) : (
        <div className="d-flex flex-col gap-4">
          {applicants.map(app => (
            <div key={app.applicationId} className="card" style={{ padding: 'var(--space-6)' }}>
              <div className="d-flex items-center justify-between flex-wrap gap-4">
                <div className="d-flex items-center gap-4">
                  <div className="skeleton-circle md">
                    {app.photo ? (
                      <img 
                        src={app.photo} 
                        alt={app.fullName} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-dark mb-1">{app.fullName}</h3>
                    <div className="d-flex items-center gap-3 text-sm text-muted">
                      <span>{app.experience} yrs exp</span>
                      <span className={`trust-badge ${getTrustBadgeClass(app.trustScore)}`}>
                        {app.trustScore?.tier || 'new'}
                      </span>
                      <span className="text-capitalize">{app.workerType}</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex items-center gap-2">
                  <span className={`badge badge-${
                    app.status === 'hired' ? 'success' :
                    app.status === 'rejected' ? 'danger' :
                    app.status === 'applied' ? 'info' : 'warning'
                  }`}>
                    {app.status}
                  </span>
                  
                  {app.status === 'applied' && (
                    <>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusChange(app.applicationId, 'shortlisted', app.fullName)}
                      >
                        Shortlist
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusChange(app.applicationId, 'rejected', app.fullName)}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {app.status === 'shortlisted' && (
                    <>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusChange(app.applicationId, 'interviewed', app.fullName)}
                      >
                        Interview
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusChange(app.applicationId, 'rejected', app.fullName)}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {app.status === 'interviewed' && (
                    <>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusChange(app.applicationId, 'hired', app.fullName)}
                      >
                        ✓ Hire
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusChange(app.applicationId, 'rejected', app.fullName)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerApplicants;