// File path: /client/src/pages/worker/Dashboard.jsx
// Purpose: Worker dashboard - displays trust score, applications, and quick actions.
// Architecture: Config-driven with trust score visualization.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { getMyApplications } from '../../services/application.service';

const WorkerDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { config } = useConfig();
  const { toast } = useToast();
  
  const [workerData, setWorkerData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileResponse, appsResponse] = await Promise.all([
        api.get('/api/auth/me'),
        getMyApplications({ limit: 5 })
      ]);

      if (profileResponse.success) {
        setWorkerData(profileResponse.data);
      }

      if (appsResponse.success) {
        setApplications(appsResponse.data.items);
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

  if (!workerData) {
    return (
      <div className="app-main">
        <div className="empty-state">
          <h3>Profile not found</h3>
          <p>Please complete your registration.</p>
        </div>
      </div>
    );
  }

  const trustScore = workerData.trust_score || { total: 0, tier: 'new', breakdown: {} };
  const trustTierConfig = config?.trustScore?.tiers?.find(t => t.name === trustScore.tier) || {};

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Welcome, {workerData.full_name}</h1>
        <p>Here's an overview of your profile and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">️</div>
          <div className="stat-content">
            <div className="stat-label">Trust Score</div>
            <div className="stat-value">{trustScore.total}<span className="text-muted text-sm">/100</span></div>
            <span className={`trust-badge ${trustScore.tier}`}>
              {trustTierConfig.icon} {trustTierConfig.label || trustScore.tier}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className={`stat-icon ${workerData.verification_status === 'verified' ? 'green' : 'yellow'}`}>
            {workerData.verification_status === 'verified' ? '✅' : '⏳'}
          </div>
          <div className="stat-content">
            <div className="stat-label">Verification Status</div>
            <div className="stat-value text-base font-semibold" style={{ textTransform: 'capitalize' }}>
              {workerData.verification_status.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">💼</div>
          <div className="stat-content">
            <div className="stat-label">Worker Type</div>
            <div className="stat-value text-base font-semibold" style={{ textTransform: 'capitalize' }}>
              {workerData.worker_type}
            </div>
            <div className="text-xs text-muted">
              {workerData.years_experience} years experience
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => onNavigate && onNavigate('worker-jobs')}>
            <span className="icon">🔍</span>
            <span>Browse Available Jobs</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate && onNavigate('worker-applications')}>
            <span className="icon">📋</span>
            <span>View My Applications</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate && onNavigate('worker-verification')}>
            <span className="icon">📄</span>
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* Recent Applications */}
      {applications.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="card-header">
            <h3>Recent Applications</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate && onNavigate('worker-applications')}>
              View All
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Type</th>
                  <th>Employer</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td className="font-medium text-capitalize">{app.workerType}</td>
                    <td>{app.employerName}</td>
                    <td>{app.salaryMin?.toLocaleString()} - {app.salaryMax?.toLocaleString()} ETB</td>
                    <td>
                      <span className={`badge badge-${
                        app.status === 'hired' ? 'success' :
                        app.status === 'rejected' ? 'danger' :
                        app.status === 'applied' ? 'info' : 'warning'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
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

export default WorkerDashboard;