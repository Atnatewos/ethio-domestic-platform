// File path: /client/src/components/domain/WorkerCard.jsx
// Purpose: Reusable card component for displaying worker information in directory.
// Design: Clean, modern card with trust score badge and key information.

import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const WorkerCard = ({ worker, onClick }) => {
  const { config } = useConfig();
  
  const trustScore = worker.trustScore || { total: 0, tier: 'new' };
  const trustTierConfig = config?.trustScore?.tiers?.find(t => t.name === trustScore.tier) || {};

  return (
    <div 
      className="card card-hover cursor-pointer"
      onClick={onClick}
      style={{ padding: 'var(--space-5)' }}
    >
      <div className="d-flex flex-col items-center text-center">
        {/* Photo */}
        <div 
          className="skeleton-circle md mb-3"
          style={{ width: '80px', height: '80px' }}
        >
          {worker.photo ? (
            <img 
              src={worker.photo} 
              alt={worker.fullName}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '2rem' }}>👤</span>
          )}
        </div>

        {/* Name & Trust Badge */}
        <h3 className="text-base font-semibold text-dark mb-2">{worker.fullName}</h3>
        <span className={`trust-badge ${trustScore.tier} mb-3`}>
          {trustTierConfig.icon} {trustTierConfig.label}
        </span>

        {/* Key Info */}
        <div className="w-full text-left">
          <div className="d-flex justify-between items-center mb-2">
            <span className="text-xs text-muted">Type</span>
            <span className="text-xs font-medium capitalize">{worker.workerType}</span>
          </div>
          <div className="d-flex justify-between items-center mb-2">
            <span className="text-xs text-muted">Experience</span>
            <span className="text-xs font-medium">{worker.experience} yrs</span>
          </div>
          <div className="d-flex justify-between items-center mb-2">
            <span className="text-xs text-muted">Location</span>
            <span className="text-xs font-medium">{worker.location}</span>
          </div>
          <div className="d-flex justify-between items-center">
            <span className="text-xs text-muted">Availability</span>
            <span className="text-xs font-medium capitalize">
              {worker.availability?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Trust Score Bar */}
        <div className="w-full mt-4">
          <div className="d-flex justify-between items-center mb-1">
            <span className="text-xs text-muted">Trust Score</span>
            <span className="text-xs font-bold">{trustScore.total}/100</span>
          </div>
          <div style={{ 
            height: '6px', 
            backgroundColor: 'var(--color-slate-200)', 
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div 
              style={{ 
                width: `${trustScore.total}%`, 
                height: '100%', 
                backgroundColor: 'var(--color-primary)',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;