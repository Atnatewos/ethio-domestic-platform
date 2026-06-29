// File path: /client/src/pages/public/WorkerProfile.jsx
// Purpose: Public worker profile page - detailed view with trust score and reviews.
// Architecture: Uses trust score config for tier display and review tags.

import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useToast } from '../../context/ToastContext';
import { getWorkerProfile } from '../../services/verification.service';

const WorkerProfile = ({ workerId, onBack }) => {
  const { config } = useConfig();
  const { toast } = useToast();
  
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workerId) {
      fetchWorkerProfile();
    }
  }, [workerId]);

  const fetchWorkerProfile = async () => {
    setLoading(true);
    try {
      const response = await getWorkerProfile(workerId);
      if (response.success) {
        setWorker(response.data);
      }
    } catch (error) {
      toast.error('Failed to load worker profile');
      if (onBack) onBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-main">
        <div className="skeleton-card" style={{ height: '600px' }}></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="app-main">
        <div className="empty-state">
          <h3>Worker not found</h3>
          <button className="btn btn-primary" onClick={onBack}>
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const trustScore = worker.trustScore || { total: 0, tier: 'new', breakdown: {} };
  const trustTierConfig = config?.trustScore?.tiers?.find(t => t.name === trustScore.tier) || {};

  return (
    <div className="app-main">
      <button className="btn btn-ghost mb-4" onClick={onBack}>
        ← Back to Directory
      </button>

      <div className="d-grid gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div className="d-flex flex-col items-center text-center">
            <div 
              className="skeleton-circle lg mb-4"
              style={{ width: '120px', height: '120px' }}
            >
              {worker.photo ? (
                <img 
                  src={worker.photo} 
                  alt={worker.fullName}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '3rem' }}>👤</span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-dark mb-2">{worker.fullName}</h2>
            
            <span className={`trust-badge ${trustScore.tier} mb-4`}>
              {trustTierConfig.icon} {trustTierConfig.label}
            </span>

            <div className="w-full mb-4">
              <div className="d-flex justify-between mb-2">
                <span className="text-sm font-medium">Trust Score</span>
                <span className="text-sm font-bold">{trustScore.total}/100</span>
              </div>
              <div style={{ 
                height: '8px', 
                backgroundColor: 'var(--color-slate-200)', 
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    width: `${trustScore.total}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--color-primary)',
                    transition: 'width 0.5s ease'
                  }}
                ></div>
              </div>
            </div>

            <div className="w-full text-left">
              <div className="mb-3">
                <span className="text-xs text-muted font-semibold uppercase">Worker Type</span>
                <p className="text-sm font-medium text-dark capitalize">{worker.workerType}</p>
              </div>
              <div className="mb-3">
                <span className="text-xs text-muted font-semibold uppercase">Experience</span>
                <p className="text-sm font-medium text-dark">{worker.experience} years</p>
              </div>
              <div className="mb-3">
                <span className="text-xs text-muted font-semibold uppercase">Location</span>
                <p className="text-sm font-medium text-dark">{worker.location}</p>
              </div>
              <div className="mb-3">
                <span className="text-xs text-muted font-semibold uppercase">Availability</span>
                <p className="text-sm font-medium text-dark capitalize">{worker.availability?.replace('_', ' ')}</p>
              </div>
              <div className="mb-3">
                <span className="text-xs text-muted font-semibold uppercase">Salary Expectation</span>
                <p className="text-sm font-medium text-dark">
                  {worker.salaryMin?.toLocaleString()} - {worker.salaryMax?.toLocaleString()} ETB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="d-flex flex-col gap-6">
          {/* Languages & Skills */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-lg font-semibold text-dark mb-4">Languages & Skills</h3>
            
            <div className="mb-4">
              <span className="text-xs text-muted font-semibold uppercase mb-2 d-block">Languages</span>
              <div className="d-flex flex-wrap gap-2">
                {worker.languages?.map((lang, i) => (
                  <span key={i} className="badge badge-primary">{lang}</span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-muted font-semibold uppercase mb-2 d-block">Skills</span>
              <div className="d-flex flex-wrap gap-2">
                {worker.skills?.map((skill, i) => (
                  <span key={i} className="badge badge-neutral">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Score Breakdown */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-lg font-semibold text-dark mb-4">Trust Score Breakdown</h3>
            
            <div className="d-flex flex-col gap-3">
              <div className="d-flex justify-between items-center">
                <span className="text-sm">Verification Completion</span>
                <span className="text-sm font-semibold">{trustScore.breakdown.verification || 0}/50</span>
              </div>
              <div className="d-flex justify-between items-center">
                <span className="text-sm">Reference Checks</span>
                <span className="text-sm font-semibold">{trustScore.breakdown.references || 0}/20</span>
              </div>
              <div className="d-flex justify-between items-center">
                <span className="text-sm">Employer Reviews</span>
                <span className="text-sm font-semibold">{trustScore.breakdown.reviews || 0}/20</span>
              </div>
              <div className="d-flex justify-between items-center">
                <span className="text-sm">Response Rate</span>
                <span className="text-sm font-semibold">{trustScore.breakdown.responseRate || 0}/10</span>
              </div>
              {trustScore.breakdown.vouches > 0 && (
                <div className="d-flex justify-between items-center">
                  <span className="text-sm">Community Vouches</span>
                  <span className="text-sm font-semibold text-success">+{trustScore.breakdown.vouches}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          {worker.reviews && worker.reviews.length > 0 && (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 className="text-lg font-semibold text-dark mb-4">Recent Reviews</h3>
              
              <div className="d-flex flex-col gap-4">
                {worker.reviews.map((review, i) => (
                  <div key={i} className="d-flex flex-col gap-2 pb-4" style={{ borderBottom: i < worker.reviews.length - 1 ? '1px solid var(--color-slate-100)' : 'none' }}>
                    <div className="d-flex justify-between items-center">
                      <span className="text-sm font-semibold">{review.employerName}</span>
                      <div className="d-flex items-center gap-1">
                        {[...Array(5)].map((_, star) => (
                          <span key={star} style={{ color: star < review.rating ? '#F59E0B' : '#E5E7EB' }}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.tags && review.tags.length > 0 && (
                      <div className="d-flex flex-wrap gap-2">
                        {review.tags.map((tag, j) => (
                          <span key={j} className="badge badge-sm badge-neutral">{tag}</span>
                        ))}
                      </div>
                    )}
                    {review.comment && (
                      <p className="text-sm text-muted mb-0">{review.comment}</p>
                    )}
                    <span className="text-xs text-muted">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;