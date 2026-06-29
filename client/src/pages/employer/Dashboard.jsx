// File path: /client/src/pages/employer/Dashboard.jsx
// Purpose: Employer dashboard - displays job stats and quick actions.
// Architecture: Config-driven with job metrics.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getMyJobs } from '../../services/job.service';

const EmployerDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const jobsResponse = await getMyJobs({ status: 'active', limit: 5 });
      
      if (jobsResponse.success) {
        setRecentJobs(jobsResponse.data.items);
        setStats(prev => ({ ...prev, activeJobs: jobsResponse.data.total }));
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-main">
        <div className="stats-grid">
          {[1, 2, 3].map(i => <div key={i} className="skeleton-card" style={{ height: '120px' }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Welcome, {user.fullName}</h1>
        <p>Manage your household staffing needs efficiently.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">💼</div>
          <div className="stat-content">
            <div className="stat-label">Active Jobs</div>
            <div className="stat-value">{stats.activeJobs}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">👥</div>
          <div className="stat-content">
            <div className="stat-label">Total Applicants</div>
            <div className="stat-value">{stats.totalApplicants}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Hired Workers</div>
            <div className="stat-value">0</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="action-buttons">
            <button className="action-btn" onClick={() => onNavigate && onNavigate('employer-post-job')}>
              <span className="icon">➕</span>
              <span>Post New Job</span>
            </button>
            <button className="action-btn" onClick={() => onNavigate && onNavigate('employer-my-jobs')}>
              <span className="icon">📋</span>
              <span>View My Jobs</span>
            </button>
            <button className="action-btn" onClick={() => onNavigate && onNavigate('directory')}>
              <span className="icon">🔍</span>
              <span>Browse Workers</span>
            </button>
          </div>
        </div>
      </div>

      {recentJobs.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="card-header">
            <h3>Recent Job Postings</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate && onNavigate('employer-my-jobs')}>
              View All
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Worker Type</th>
                  <th>Schedule</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map(job => (
                  <tr key={job.id}>
                    <td className="font-medium text-capitalize">{job.workerType}</td>
                    <td>{job.schedule === 'full_time' ? 'Full-time' : 'Part-time'}</td>
                    <td><span className="badge badge-info">{job.applicantCount}</span></td>
                    <td><span className="badge badge-success">Active</span></td>
                    <td>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onNavigate && onNavigate('employer-applicants', job.id)}
                      >
                        View Applicants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;