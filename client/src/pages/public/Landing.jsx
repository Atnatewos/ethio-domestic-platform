// File path: /client/src/pages/public/Landing.jsx
// Purpose: Public landing page - introduces the platform and its value proposition.
// Architecture: Config-driven content with trust-focused messaging.

import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const Landing = ({ onNavigate }) => {
  const { config } = useConfig();

  return (
    <div className="app-main">
      {/* Hero Section */}
      <div className="card" style={{ 
        padding: 'var(--space-12)', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-surface) 100%)',
        marginBottom: 'var(--space-8)'
      }}>
        <h1 className="text-4xl font-bold text-dark mb-4">
          {config.platform.name}
        </h1>
        <p className="text-xl text-muted mb-6" style={{ maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
          {config.platform.tagline}
        </p>
        <div className="d-flex gap-3 justify-center">
          <button className="btn btn-primary btn-lg" onClick={() => onNavigate && onNavigate('register-worker')}>
            I'm a Worker
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => onNavigate && onNavigate('register-employer')}>
            I'm an Employer
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
        <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="d-grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📝</div>
            <h3 className="text-lg font-semibold mb-2">1. Register</h3>
            <p className="text-muted text-sm">Workers and employers create verified accounts</p>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>✅</div>
            <h3 className="text-lg font-semibold mb-2">2. Verify</h3>
            <p className="text-muted text-sm">Workers undergo background checks and earn trust scores</p>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🤝</div>
            <h3 className="text-lg font-semibold mb-2">3. Connect</h3>
            <p className="text-muted text-sm">Employers browse verified workers and make hires</p>
          </div>
        </div>
      </div>

      {/* Trust Score Explanation */}
      <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
        <h2 className="text-2xl font-bold text-center mb-6">Trust Score System</h2>
        <p className="text-center text-muted mb-6" style={{ maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
          Every worker on our platform has a Trust Score based on verification, references, and reviews.
        </p>
        <div className="d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="d-flex items-center gap-3 p-4" style={{ backgroundColor: 'var(--trust-premium-bg)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '2rem' }}>🟢</span>
            <div>
              <h4 className="font-semibold">Premium (80-100)</h4>
              <p className="text-xs text-muted mb-0">Fully verified, excellent reviews</p>
            </div>
          </div>
          <div className="d-flex items-center gap-3 p-4" style={{ backgroundColor: 'var(--trust-verified-bg)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '2rem' }}>🔵</span>
            <div>
              <h4 className="font-semibold">Verified (50-79)</h4>
              <p className="text-xs text-muted mb-0">All checks passed</p>
            </div>
          </div>
          <div className="d-flex items-center gap-3 p-4" style={{ backgroundColor: 'var(--trust-progress-bg)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '2rem' }}>🟡</span>
            <div>
              <h4 className="font-semibold">In Progress (20-49)</h4>
              <p className="text-xs text-muted mb-0">Verification ongoing</p>
            </div>
          </div>
          <div className="d-flex items-center gap-3 p-4" style={{ backgroundColor: 'var(--trust-new-bg)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '2rem' }}>⚪</span>
            <div>
              <h4 className="font-semibold">New (0-19)</h4>
              <p className="text-xs text-muted mb-0">Just registered</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="card" style={{ 
        padding: 'var(--space-8)', 
        textAlign: 'center',
        backgroundColor: 'var(--color-primary)',
        color: 'white'
      }}>
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6" style={{ opacity: 0.9 }}>
          Join thousands of verified workers and employers on our platform.
        </p>
        <div className="d-flex gap-3 justify-center">
          <button 
            className="btn btn-lg" 
            style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}
            onClick={() => onNavigate && onNavigate('directory')}
          >
            Browse Workers
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;