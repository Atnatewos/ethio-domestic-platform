// File path: /client/src/pages/admin/Dashboard.jsx
// Purpose: Admin dashboard with stats overview

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

export default function AdminDashboard() {
  const { tokens } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` }
      });

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load dashboard stats</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to EthioDomestic admin panel</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👷</div>
          <div className="stat-content">
            <h3>Total Workers</h3>
            <p className="stat-value">{stats.workers.total}</p>
            <p className="stat-label">{stats.workers.verified} verified</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>Active Jobs</h3>
            <p className="stat-value">{stats.jobs.active}</p>
            <p className="stat-label">Currently open</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Monthly Revenue</h3>
            <p className="stat-value">{stats.payments.monthTotal.toLocaleString()} ETB</p>
            <p className="stat-label">This month</p>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Approvals</h3>
            <p className="stat-value">{stats.pendingApprovals.total}</p>
            <p className="stat-label">
              {stats.pendingApprovals.workers} workers, {stats.pendingApprovals.employers} employers
            </p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <a href="/admin/approvals" className="action-btn">
            <span className="icon">✓</span>
            <span>Review Approvals</span>
            {stats.pendingApprovals.total > 0 && (
              <span className="badge-count">{stats.pendingApprovals.total}</span>
            )}
          </a>
          <a href="/admin/workers" className="action-btn">
            <span className="icon">👷</span>
            <span>Manage Workers</span>
          </a>
          <a href="/admin/employers" className="action-btn">
            <span className="icon">👔</span>
            <span>Manage Employers</span>
          </a>
          <a href="/admin/settings" className="action-btn">
            <span className="icon">⚙️</span>
            <span>Platform Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}