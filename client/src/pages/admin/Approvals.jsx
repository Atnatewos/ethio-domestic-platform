// File path: /client/src/pages/admin/Approvals.jsx
// Purpose: Admin page to review and approve/reject registrations with custom toasts

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiService } from '../../services/api';

export default function Approvals() {
  const { tokens } = useAuth();
  const { toast, confirm, prompt } = useToast();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ userType: '', registrationSource: '' });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/api/admin/approvals', {
        params: filter,
        headers: { Authorization: `Bearer ${tokens.accessToken}` }
      });

      if (response.success) {
        setApprovals(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to load approvals');
      console.error('Failed to load approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, userType, userName) => {
    const confirmed = await confirm({
      title: 'Approve Registration',
      message: `Are you sure you want to approve ${userName}'s registration?`,
      confirmText: 'Approve',
      cancelText: 'Cancel',
      type: 'info'
    });

    if (!confirmed) return;

    setActionLoading(id);
    try {
      const response = await apiService.post(
        `/api/admin/approvals/${id}/approve`,
        { userType },
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      );

      if (response.success) {
        toast.success(`✅ ${userName}'s registration approved!`);
        loadApprovals();
      }
    } catch (error) {
      toast.error('Failed to approve: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, userType, userName) => {
    const reason = await prompt({
      title: 'Reject Registration',
      message: `Why are you rejecting ${userName}'s registration?`,
      placeholder: 'Enter reason (optional)',
      defaultValue: ''
    });

    if (reason === null) return; // User cancelled

    const confirmed = await confirm({
      title: 'Confirm Rejection',
      message: `Are you sure you want to reject ${userName}'s registration?`,
      confirmText: 'Reject',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    setActionLoading(id);
    try {
      const response = await apiService.post(
        `/api/admin/approvals/${id}/reject`,
        { userType, reason },
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      );

      if (response.success) {
        toast.warning(`⚠️ ${userName}'s registration rejected`);
        loadApprovals();
      }
    } catch (error) {
      toast.error('Failed to reject: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Registration Approvals</h1>
        <p>Review and approve pending registrations</p>
      </div>

      <div className="filters-bar">
        <select
          value={filter.userType}
          onChange={(e) => setFilter({ ...filter, userType: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="worker">Workers</option>
          <option value="employer">Employers</option>
        </select>

        <select
          value={filter.registrationSource}
          onChange={(e) => setFilter({ ...filter, registrationSource: e.target.value })}
          className="filter-select"
        >
          <option value="">All Sources</option>
          <option value="online">Online</option>
          <option value="office">Office</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading approvals...</div>
      ) : approvals.length === 0 ? (
        <div className="empty-state">
          <h3>No pending approvals</h3>
          <p>All registrations have been processed</p>
        </div>
      ) : (
        <div className="approvals-list">
          {approvals.map(approval => (
            <div key={approval.id} className="approval-card">
              <div className="approval-info">
                <div className="approval-avatar">
                  {approval.paymentProof ? (
                    <img src={approval.paymentProof} alt="Payment proof" />
                  ) : (
                    <div className="avatar-placeholder">📄</div>
                  )}
                </div>
                <div className="approval-details">
                  <h3>{approval.fullName}</h3>
                  <p className="phone">{approval.phone}</p>
                  <div className="approval-meta">
                    <span className={`badge badge-${approval.userType}`}>
                      {approval.userType}
                    </span>
                    {approval.workerType && (
                      <span className="badge badge-info">{approval.workerType}</span>
                    )}
                    <span className="badge badge-source">{approval.registrationSource}</span>
                    <span className="amount">{approval.amount} ETB</span>
                  </div>
                  <p className="date">
                    Submitted: {new Date(approval.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="approval-actions">
                <button
                  onClick={() => handleApprove(approval.id, approval.userType, approval.fullName)}
                  disabled={actionLoading === approval.id}
                  className="btn btn-success"
                >
                  {actionLoading === approval.id ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleReject(approval.id, approval.userType, approval.fullName)}
                  disabled={actionLoading === approval.id}
                  className="btn btn-danger"
                >
                  ✗ Reject
                </button>
                {approval.paymentProof && (
                  <a
                    href={approval.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View Receipt
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}