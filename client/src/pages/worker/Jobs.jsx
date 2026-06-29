// File path: /client/src/pages/worker/Jobs.jsx
// Purpose: Worker job browsing page - discover and apply to available jobs.
// Architecture: Config-driven filters with real-time job fetching.

import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useToast } from '../../context/ToastContext';
import { getJobs } from '../../services/job.service';
import { applyToJob } from '../../services/application.service';
import JobCard from '../../components/domain/JobCard';

const WorkerJobs = () => {
  const { config } = useConfig();
  const { toast, confirm } = useToast();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    workerType: '',
    schedule: '',
    housing: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 12
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getJobs({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.success) {
        setJobs(response.data.items);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleApply = async (jobId) => {
    const confirmed = await confirm({
      title: 'Apply to Job',
      message: 'Are you sure you want to apply to this job?',
      confirmText: 'Apply',
      type: 'info'
    });

    if (!confirmed) return;

    try {
      const response = await applyToJob(jobId);
      if (response.success) {
        toast.success('Application submitted successfully!');
        fetchJobs(); // Refresh to show applied status
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Find Jobs</h1>
        <p>Browse available positions from verified employers.</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select 
          className="filter-select"
          value={filters.workerType}
          onChange={(e) => handleFilterChange('workerType', e.target.value)}
        >
          <option value="">All Worker Types</option>
          {config?.forms?.workerRegistration?.sections
            ?.find(s => s.id === 'work')?.fields
            ?.find(f => f.name === 'workerType')?.options
            ?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>

        <select 
          className="filter-select"
          value={filters.schedule}
          onChange={(e) => handleFilterChange('schedule', e.target.value)}
        >
          <option value="">Any Schedule</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
        </select>

        <select 
          className="filter-select"
          value={filters.housing}
          onChange={(e) => handleFilterChange('housing', e.target.value)}
        >
          <option value="">Any Housing</option>
          <option value="live_in">Live-in</option>
          <option value="live_out">Live-out</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-card" style={{ height: '280px' }}></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your filters to see more opportunities.</p>
        </div>
      ) : (
        <>
          <div className="d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {jobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job}
                onApply={handleApply}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="table-pagination">
              <div className="pagination-info">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} jobs
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                <button 
                  className="pagination-btn"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkerJobs;