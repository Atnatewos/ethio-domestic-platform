// File path: /client/src/pages/worker/Jobs.jsx
// Purpose: Modern job browsing page with filters and animated cards
// Architecture: Uses React Query, Framer Motion, and modern card design

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getJobs } from '../../services/job.service';
import { applyToJob } from '../../services/application.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const Jobs = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    workerType: '',
    schedule: '',
    housing: '',
  });
  const [page, setPage] = useState(1);

  // Fetch jobs
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters, page],
    queryFn: () => getJobs({ ...filters, page, limit: 12 }),
  });

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: applyToJob,
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries(['jobs']);
      queryClient.invalidateQueries(['worker-applications']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to apply');
    },
  });

  const handleApply = (jobId) => {
    applyMutation.mutate(jobId);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const jobs = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="jobs-page"
    >
      {/* Page Header */}
      <div className="page-header">
        <h1>Find Jobs 🔍</h1>
        <p>Browse available positions from verified employers.</p>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Worker Type</label>
            <select
              className="filter-select"
              value={filters.workerType}
              onChange={(e) => handleFilterChange('workerType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="maid">Maid</option>
              <option value="nanny">Nanny</option>
              <option value="cook">Cook</option>
              <option value="driver">Driver</option>
              <option value="cleaner">Cleaner</option>
              <option value="guard">Guard</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Schedule</label>
            <select
              className="filter-select"
              value={filters.schedule}
              onChange={(e) => handleFilterChange('schedule', e.target.value)}
            >
              <option value="">Any Schedule</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Housing</label>
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
        </div>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="jobs-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      ) : error ? (
        <Card className="error-card">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Error loading jobs</h3>
            <p>Please try again later.</p>
          </div>
        </Card>
      ) : jobs.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your filters to see more opportunities.</p>
          </div>
        </Card>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="jobs-grid"
          >
            <AnimatePresence>
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={cardVariants}
                  layout
                >
                  <Card hoverable className="job-card">
                    <div className="job-card-content">
                      {/* Header */}
                      <div className="job-card-header">
                        <Badge variant="primary" size="sm">
                          {job.workerType}
                        </Badge>
                        {job.isUrgent && (
                          <Badge variant="warning" size="sm">
                            ⚡ Urgent
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="job-title">
                        {job.workerType} Needed
                      </h3>

                      {/* Details */}
                      <div className="job-details">
                        <div className="job-detail">
                          <span className="detail-icon">📍</span>
                          <span>{job.employerZone || 'Addis Ababa'}</span>
                        </div>
                        <div className="job-detail">
                          <span className="detail-icon">💰</span>
                          <span>
                            {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()} ETB
                          </span>
                        </div>
                        <div className="job-detail">
                          <span className="detail-icon">🏠</span>
                          <span>{job.housing === 'live_in' ? 'Live-in' : 'Live-out'}</span>
                        </div>
                        <div className="job-detail">
                          <span className="detail-icon">⏰</span>
                          <span>{job.schedule === 'full_time' ? 'Full-time' : 'Part-time'}</span>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button
                        variant="primary"
                        className="apply-button"
                        onClick={() => handleApply(job.id)}
                        loading={applyMutation.isLoading}
                        disabled={applyMutation.isLoading}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                variant="secondary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Previous
              </Button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Jobs;