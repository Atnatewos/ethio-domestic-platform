// File path: /client/src/pages/admin/Verification.jsx
// Purpose: Admin verification queue page - review documents and approve/reject workers.

import React, { useState, useEffect } from 'react';
import { getVerificationQueue, approveVerification, rejectVerification } from '../../services/verification.service';
import { useToast } from '../../context/ToastContext';

const Verification = () => {
  const { toast, confirm, prompt } = useToast();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await getVerificationQueue();
      if (response.success) {
        setQueue(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (workerId, workerName) => {
    const confirmed = await confirm({
      title: 'Approve Verification',
      message: `Are you sure you want to approve ${workerName}'s verification? This will make them visible in the public directory.`,
      confirmText: 'Approve',
      type: 'info'
    });

    if (!confirmed) return;

    try {
      const response = await approveVerification(workerId);
      if (response.success) {
        toast.success(`${workerName} verified successfully!`);
        fetchQueue();
      }
    } catch (error) {
      toast.error('Failed to approve verification');
    }
  };

  const handleReject = async (workerId, workerName) => {
    const reason = await prompt({
      title: 'Reject Verification',
      message: `Why are you rejecting ${workerName}'s verification?`,
      placeholder: 'Enter reason...'
    });

    if (reason === null) return;

    try {
      const response = await rejectVerification(workerId, reason);
      if (response.success) {
        toast.warning(`${workerName}'s verification rejected`);
        fetchQueue();
      }
    } catch (error) {
      toast.error('Failed to reject verification');
    }
  };

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Verification Queue</h1>
        <p>Review worker documents and approve verifications.</p>
      </div>

      {loading ? (
        <div className="skeleton-card" style={{ height: '400px' }}></div>
      ) : queue.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3>All caught up!</h3>
          <p>No workers pending verification.</p>
        </div>
      ) : (
        <div className="d-flex flex-col gap-4">
          {queue.map(worker => (
            <div key={worker.id} className="card" style={{ padding: 'var(--space-6)' }}>
              <div className="d-flex items-center justify-between flex-wrap gap-4">
                <div className="d-flex items-center gap-4">
                  <div className="skeleton-circle md">
                    {worker.photo ? (
                      <img src={worker.photo} alt={worker.fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-dark mb-1">{worker.fullName}</h3>
                    <div className="d-flex items-center gap-3 text-sm text-muted">
                      <span>{worker.phone}</span>
                      <span className="badge badge-primary">{worker.workerType}</span>
                      <span>{worker.referenceChecksDone} references checked</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex items-center gap-2">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedWorker(worker)}
                  >
                    Review Documents
                  </button>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleApprove(worker.id, worker.fullName)}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleReject(worker.id, worker.fullName)}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Review Modal */}
      {selectedWorker && (
        <div className="modal-overlay" onClick={() => setSelectedWorker(null)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Review Documents - {selectedWorker.fullName}</h3>
            </div>
            <div className="modal-body">
              <div className="verification-docs">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Police Clearance</h4>
                  {selectedWorker.policeClearance ? (
                    <div className="doc-preview">
                      <img src={selectedWorker.policeClearance} alt="Police Clearance" />
                    </div>
                  ) : (
                    <div className="doc-preview">Not uploaded</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Health Certificate</h4>
                  {selectedWorker.healthCertificate ? (
                    <div className="doc-preview">
                      <img src={selectedWorker.healthCertificate} alt="Health Certificate" />
                    </div>
                  ) : (
                    <div className="doc-preview">Not uploaded</div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">ID Document</h4>
                  {selectedWorker.idDocument ? (
                    <div className="doc-preview">
                      <img src={selectedWorker.idDocument} alt="ID Document" />
                    </div>
                  ) : (
                    <div className="doc-preview">Not uploaded</div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedWorker(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;