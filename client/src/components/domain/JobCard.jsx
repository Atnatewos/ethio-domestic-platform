// File path: /client/src/components/domain/JobCard.jsx
// Purpose: Reusable card component for displaying job listings.
// Design: Clean, modern card utilizing the Slate & Indigo design system.

import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const JobCard = ({ job, onApply, isApplied = false }) => {
  const { config } = useConfig();
  
  const formatSalary = (min, max) => {
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${config?.platform?.currencySymbol || 'ETB'}`;
  };

  const isUrgent = job.isUrgent && (!job.urgent_expires_at || new Date(job.urgent_expires_at) > new Date());

  return (
    <div className={`card card-hover ${isUrgent ? 'border-primary' : ''}`} style={{ position: 'relative' }}>
      {isUrgent && (
        <span className="badge badge-warning" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          ⚡ Urgent
        </span>
      )}
      
      <div className="card-body">
        <div className="d-flex items-center justify-between mb-2">
          <span className="badge badge-primary text-capitalize">{job.workerType}</span>
          <span className="text-xs text-muted">{job.schedule === 'full_time' ? 'Full-time' : 'Part-time'}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-dark mb-2" style={{ marginTop: '0.5rem' }}>
          {job.workerType} Needed
        </h3>
        
        <div className="d-flex flex-col gap-2 mb-4">
          <div className="d-flex items-center gap-2 text-sm text-muted">
            <span>📍</span> {job.employerZone || 'Addis Ababa'}
          </div>
          <div className="d-flex items-center gap-2 text-sm text-muted">
            <span>💰</span> {formatSalary(job.salaryMin, job.salaryMax)}
          </div>
          <div className="d-flex items-center gap-2 text-sm text-muted">
            <span></span> {job.housing === 'live_in' ? 'Live-in' : 'Live-out'}
          </div>
        </div>

        <div className="d-flex gap-2">
          {isApplied ? (
            <button className="btn btn-secondary btn-block" disabled>
              Applied
            </button>
          ) : (
            <button className="btn btn-primary btn-block" onClick={() => onApply(job.id)}>
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;