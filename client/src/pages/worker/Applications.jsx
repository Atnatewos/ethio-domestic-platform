// File path: /client/src/pages/worker/Applications.jsx
// Purpose: Worker applications tracking page - view all job applications and their status.
// Architecture: Config-driven table with status tracking.

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getMyApplications } from '../../services/application.service';

const WorkerApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '' });

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getMyApplications(filters);
      if (response.success) {
        setApplications(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications.</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select 
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interviewed">Interviewed</option>
          <option value="trial">Trial</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="skeleton-card" style={{ height: '400px' }}></div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Start browsing jobs and apply to positions that match your skills.</p>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Type</th>
                <th>Employer</th>
                <th>Location</th>
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
                  <td>{app.employerZone}</td>
                  <td>{app.salaryMin?.toLocaleString()} - {app.salaryMax?.toLocaleString()} ETB</td>
                  <td>
                    <span className={`badge badge-${
                      app.status === 'hired' ? 'success' :
                      app.status === 'rejected' ? 'danger' :
                      app.status === 'applied' ? 'info' :
                      app.status === 'shortlisted' || app.status === 'interviewed' ? 'warning' : 'neutral'
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
      )}
    </div>
  );
};

export default WorkerApplications;