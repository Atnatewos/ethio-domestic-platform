// File path: /client/src/pages/public/WorkerDirectory.jsx
// Purpose: Public worker directory with filters and search
// Architecture: Uses React Query for data fetching

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWorkerDirectory } from '../../services/verification.service';
import WorkerCard from '../../components/domain/WorkerCard';

const WorkerDirectory = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    workerType: '',
    trustTier: '',
    availability: '',
    location: '',
    search: '',
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['workers', filters, page],
    queryFn: () => getWorkerDirectory({ ...filters, page, limit: 12 }),
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleWorkerClick = (workerId) => {
    navigate(`/worker/${workerId}`);
  };

  return (
    <div className="directory-page">
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
          <option value="maid">Maid</option>
          <option value="nanny">Nanny</option>
          <option value="cook">Cook</option>
          <option value="driver">Driver</option>
          <option value="cleaner">Cleaner</option>
          <option value="guard">Guard</option>
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

        <input
          type="text"
          className="search-input"
          placeholder="Search by name or skill..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="loading-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-card" style={{ height: '320px' }}></div>
          ))}
        </div>
      ) : error ? (
        <div className="error-state">
          <h3>Error loading workers</h3>
          <p>Please try again later.</p>
        </div>
      ) : data?.items?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No workers found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          <div className="workers-grid">
            {data?.items?.map(worker => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onClick={() => handleWorkerClick(worker.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.total > 12 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {Math.ceil(data.total / 12)}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / 12)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkerDirectory;