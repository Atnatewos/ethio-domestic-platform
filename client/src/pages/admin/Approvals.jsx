// File path: /client/src/pages/admin/Approvals.jsx
// Purpose: Modern admin page to approve/reject worker and employer registrations
// Architecture: Uses React Query, Framer Motion, and modern UI components

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getPendingApprovals, approveUser, rejectUser } from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const Approvals = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [rejectModal, setRejectModal] = useState({ open: false, userId: null, userType: null });
  const [rejectReason, setRejectReason] = useState('');

  // Fetch pending approvals
  const { data, isLoading } = useQuery({
    queryKey: ['admin-approvals'],
    queryFn: getPendingApprovals,
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ userId, userType }) => approveUser(userId, userType),
    onSuccess: () => {
      toast.success('User approved successfully!');
      queryClient.invalidateQueries(['admin-approvals']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve user');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ userId, userType, reason }) => rejectUser(userId, userType, reason),
    onSuccess: () => {
      toast.success('User rejected');
      queryClient.invalidateQueries(['admin-approvals']);
      setRejectModal({ open: false, userId: null, userType: null });
      setRejectReason('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject user');
    },
  });

  const handleApprove = (userId, userType) => {
    approveMutation.mutate({ userId, userType });
  };

  const handleRejectClick = (userId, userType) => {
    setRejectModal({ open: true, userId, userType });
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate({
      userId: rejectModal.userId,
      userType: rejectModal.userType,
      reason: rejectReason,
    });
  };

  const approvals = data?.data || { workers: [], employers: [] };
  const workers = filter === 'all' || filter === 'workers' ? approvals.workers || [] : [];
  const employers = filter === 'all' || filter === 'employers' ? approvals.employers || [] : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="approvals-page"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="page-header">
        <h1>Pending Approvals ✅</h1>
        <p>Review and approve new worker and employer registrations.</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="filters-card">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({workers.length + employers.length})
            </button>
            <button
              className={`filter-tab ${filter === 'workers' ? 'active' : ''}`}
              onClick={() => setFilter('workers')}
            >
              Workers ({workers.length})
            </button>
            <button
              className={`filter-tab ${filter === 'employers' ? 'active' : ''}`}
              onClick={() => setFilter('employers')}
            >
              Employers ({employers.length})
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Workers List */}
      {(filter === 'all' || filter === 'workers') && workers.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <Card.Header>
              <h2>Worker Registrations</h2>
            </Card.Header>
            <Card.Body>
              <div className="approvals-list">
                {workers.map((worker, index) => (
                  <motion.div
                    key={worker.id}
                    className="approval-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="approval-avatar">
                      {worker.photo_url ? (
                        <img src={worker.photo_url} alt={worker.full_name} />
                      ) : (
                        <div className="avatar-placeholder">👷</div>
                      )}
                    </div>
                    <div className="approval-info">
                      <h3 className="approval-name">{worker.full_name}</h3>
                      <div className="approval-meta">
                        <span>{worker.phone}</span>
                        <span>•</span>
                        <span className="capitalize">{worker.worker_type}</span>
                        <span>•</span>
                        <span>{worker.zone}</span>
                      </div>
                      <div className="approval-date">
                        Registered: {new Date(worker.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="approval-actions">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(worker.id, 'worker')}
                        loading={approveMutation.isLoading}
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRejectClick(worker.id, 'worker')}
                        loading={rejectMutation.isLoading}
                      >
                        ✗ Reject
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}

      {/* Employers List */}
      {(filter === 'all' || filter === 'employers') && employers.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <Card.Header>
              <h2>Employer Registrations</h2>
            </Card.Header>
            <Card.Body>
              <div className="approvals-list">
                {employers.map((employer, index) => (
                  <motion.div
                    key={employer.id}
                    className="approval-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="approval-avatar">
                      <div className="avatar-placeholder">🏢</div>
                    </div>
                    <div className="approval-info">
                      <h3 className="approval-name">{employer.full_name}</h3>
                      <div className="approval-meta">
                        <span>{employer.phone}</span>
                        <span>•</span>
                        <span>{employer.email}</span>
                        <span>•</span>
                        <span>{employer.zone}</span>
                      </div>
                      <div className="approval-date">
                        Registered: {new Date(employer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="approval-actions">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(employer.id, 'employer')}
                        loading={approveMutation.isLoading}
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRejectClick(employer.id, 'employer')}
                        loading={rejectMutation.isLoading}
                      >
                        ✗ Reject
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {workers.length === 0 && employers.length === 0 && !isLoading && (
        <motion.div variants={itemVariants}>
          <Card>
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>All caught up!</h3>
              <p>No pending registrations to review.</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="approvals-list">
          {[1, 2, 3].map(i => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, userId: null, userType: null })}
        title="Reject Registration"
      >
        <div className="modal-content">
          <p className="modal-description">
            Please provide a reason for rejecting this registration. This will be sent to the user.
          </p>
          <Input
            label="Rejection Reason"
            type="text"
            placeholder="e.g., Incomplete information, invalid documents..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setRejectModal({ open: false, userId: null, userType: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRejectSubmit}
              loading={rejectMutation.isLoading}
            >
              Reject User
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Approvals;