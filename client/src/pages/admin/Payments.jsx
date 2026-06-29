// File path: /client/src/pages/admin/Payments.jsx
// Purpose: Admin payments management page - view and record payments.

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getPayments, getPaymentStats, recordPayment } from '../../services/payment.service';

const Payments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [filters, setFilters] = useState({ paymentType: '', status: '' });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsResponse, statsResponse] = await Promise.all([
        getPayments(filters),
        getPaymentStats()
      ]);

      if (paymentsResponse.success) {
        setPayments(paymentsResponse.data.items);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-main">
      <div className="page-header d-flex items-center justify-between">
        <div>
          <h1>Payments Management</h1>
          <p>Track and record all platform payments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowRecordModal(true)}>
          ➕ Record Payment
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid mb-6">
          <div className="stat-card">
            <div className="stat-icon green">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">{parseInt(stats.total_revenue).toLocaleString()} ETB</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">📊</div>
            <div className="stat-content">
              <div className="stat-label">Monthly Revenue</div>
              <div className="stat-value">{parseInt(stats.monthly_revenue).toLocaleString()} ETB</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">📝</div>
            <div className="stat-content">
              <div className="stat-label">Total Payments</div>
              <div className="stat-value">{stats.total_payments}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <select 
          className="filter-select"
          value={filters.paymentType}
          onChange={(e) => setFilters({ ...filters, paymentType: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="registration">Registration</option>
          <option value="commission">Commission</option>
          <option value="urgent_hire">Urgent Hire</option>
          <option value="office_service">Office Service</option>
        </select>

        <select 
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="skeleton-card" style={{ height: '400px' }}></div>
      ) : payments.length === 0 ? (
        <div className="empty-state">
          <h3>No payments found</h3>
          <p>Payments will appear here once recorded.</p>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td className="font-medium">{payment.payerName}</td>
                  <td><span className="badge badge-neutral">{payment.paymentType}</span></td>
                  <td className="font-semibold">{payment.amount.toLocaleString()} ETB</td>
                  <td><span className="badge badge-info">{payment.method}</span></td>
                  <td>
                    <span className={`badge badge-${
                      payment.status === 'confirmed' ? 'success' :
                      payment.status === 'pending' ? 'warning' : 'danger'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordModal && (
        <RecordPaymentModal 
          onClose={() => setShowRecordModal(false)}
          onSuccess={() => {
            setShowRecordModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

function RecordPaymentModal({ onClose, onSuccess }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    payerType: 'worker',
    payerId: '',
    paymentType: 'registration',
    amount: '',
    method: 'cash',
    transactionRef: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await recordPayment({
        ...formData,
        amount: parseInt(formData.amount)
      });

      if (response.success) {
        toast.success('Payment recorded successfully!');
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Record Payment</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Payer Type</label>
              <select 
                className="form-select"
                value={formData.payerType}
                onChange={(e) => setFormData({ ...formData, payerType: e.target.value })}
                required
              >
                <option value="worker">Worker</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payer ID (UUID)</label>
              <input 
                type="text"
                className="form-input"
                value={formData.payerId}
                onChange={(e) => setFormData({ ...formData, payerId: e.target.value })}
                placeholder="Enter user UUID"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Type</label>
              <select 
                className="form-select"
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                required
              >
                <option value="registration">Registration</option>
                <option value="commission">Commission</option>
                <option value="urgent_hire">Urgent Hire</option>
                <option value="office_service">Office Service</option>
                <option value="collateral">Collateral</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (ETB)</label>
              <input 
                type="number"
                className="form-input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select 
                className="form-select"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                required
              >
                <option value="cash">Cash</option>
                <option value="telebirr">Telebirr</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="office_cash">Office Cash</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Reference (Optional)</label>
              <input 
                type="text"
                className="form-input"
                value={formData.transactionRef}
                onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                placeholder="Transaction ID or reference"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payments;