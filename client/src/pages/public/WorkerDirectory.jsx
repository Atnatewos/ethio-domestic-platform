// File path: /client/src/pages/public/WorkerDirectory.jsx
// Purpose: Public worker directory page - browse verified workers with trust scores.
// Architecture: Uses config-driven filters and the centralized design system.

import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useToast } from '../../context/ToastContext';
import { getWorkerDirectory } from '../../services/verification.service';
import WorkerCard from '../../components/domain/WorkerCard';

const WorkerDirectory = ({ onWorkerClick }) => {
  const { config } = useConfig();
  const { toast } = useToast();
  
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    workerType: '',
    trustTier: '',
    availability: '',
    location: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 12
  });

  useEffect(() => {
    fetchWorkers();
  }, [filters, pagination.page]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await getWorkerDirectory({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.success) {
        setWorkers(response.data.items);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      }
    } catch (error) {
      toast.error('Failed to load worker directory');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleWorkerClick = (workerId) => {
    if (onWorkerClick) {
      onWorkerClick(workerId);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Verified Workers</h1>
        <p>Browse our database of verified domestic workers with trust scores.</p>
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
          value={filters.trustTier}
          onChange={(e) => handleFilterChange('trustTier', e.target.value)}
        >
          <option value="">All Trust Tiers</option>
          <option value="premium">🟢 Premium</option>
          <option value="verified">🔵 Verified</option>
        </select>

        <select 
          className="filter-select"
          value={filters.availability}
          onChange={(e) => handleFilterChange('availability', e.target.value)}
        >
          <option value="">Any Availability</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="live_in">Live-in</option>
          <option value="live_out">Live-out</option>
        </select>

        <select 
          className="filter-select"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {config?.forms?.workerRegistration?.sections
            ?.find(s => s.id === 'location')?.fields
            ?.find(f => f.name === 'zone')?.options
            ?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Search by name or skill..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-card" style={{ height: '320px' }}></div>
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No workers found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          <div className="d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {workers.map(worker => (
              <WorkerCard 
                key={worker.id} 
                worker={worker}
                onClick={() => handleWorkerClick(worker.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="table-pagination">
              <div className="pagination-info">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} workers
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

export default WorkerDirectory;