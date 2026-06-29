// File path: /client/src/pages/employer/MyJobs.jsx
// Purpose: Employer jobs management page - view and manage posted jobs.
// Architecture: Config-driven table with job status tracking.

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getMyJobs } from '../../services/job.service';

const EmployerMyJobs = ({ onNavigate }) => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'active' });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getMyJobs(filters);
      if (response.success) {
        setJobs(response.data.items);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-main">
      <div className="page-header d-flex items-center justify-between">
        <div>
          <h1>My Jobs</h1>
          <p>Track and manage your job postings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('employer-post-job')}>
          ➕ Post New Job
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select 
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="filled">Filled</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="skeleton-card" style={{ height: '400px' }}></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Post your first job to start receiving applications.</p>
          <button className="btn btn-primary mt-4" onClick={() => onNavigate && onNavigate('employer-post-job')}>
            Post a Job
          </button>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker Type</th>
                <th>Schedule</th>
                <th>Housing</th>
                <th>Salary</th>
                <th>Applicants</th>
                <th>Urgent</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td className="font-medium text-capitalize">{job.workerType}</td>
                  <td>{job.schedule === 'full_time' ? 'Full-time' : 'Part-time'}</td>
                  <td>{job.housing === 'live_in' ? 'Live-in' : 'Live-out'}</td>
                  <td>{job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()} ETB</td>
                  <td>
                    <span className="badge badge-info">{job.applicantCount}</span>
                  </td>
                  <td>
                    {job.isUrgent && (
                      <span className="badge badge-warning">⚡ Urgent</span>
                    )}
                  </td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
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
      )}
    </div>
  );
};

export default EmployerMyJobs;