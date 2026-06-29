// File path: /client/src/pages/public/Landing.jsx
// Purpose: Public landing page with hero section and CTAs
// Architecture: Modern design with animations and clear value proposition

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useConfig } from '../../context/ConfigContext';

const Landing = () => {
  const { config } = useConfig();

  const features = [
    { icon: '🔒', title: 'Verified Workers', description: 'All workers undergo thorough background checks and verification' },
    { icon: '⭐', title: 'Trust Scores', description: 'Transparent rating system based on experience and reviews' },
    { icon: '🤝', title: 'Easy Hiring', description: 'Simple process to find and hire the perfect domestic worker' },
    { icon: '📱', title: 'Mobile Friendly', description: 'Access the platform from any device, anywhere' },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            {config?.platform?.name || 'EthioDomestic'}
          </h1>
          <p className="hero-subtitle">
            {config?.platform?.tagline || 'Verified Domestic Workers for Ethiopian Families'}
          </p>
          <div className="hero-actions">
            <Link to="/register/worker" className="btn btn-primary btn-lg">
              I'm a Worker
            </Link>
            <Link to="/register/employer" className="btn btn-secondary btn-lg">
              I'm an Employer
            </Link>
            <Link to="/directory" className="btn btn-outline btn-lg">
              Browse Workers
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Score Section */}
      <section className="trust-section">
        <h2 className="section-title">Trust Score System</h2>
        <p className="section-description">
          Every worker on our platform has a Trust Score based on verification, references, and reviews.
        </p>
        <div className="trust-tiers">
          <div className="trust-tier premium">
            <span className="tier-icon">🟢</span>
            <h4>Premium (80-100)</h4>
            <p>Fully verified, excellent reviews</p>
          </div>
          <div className="trust-tier verified">
            <span className="tier-icon">🔵</span>
            <h4>Verified (50-79)</h4>
            <p>All checks passed</p>
          </div>
          <div className="trust-tier progress">
            <span className="tier-icon">🟡</span>
            <h4>In Progress (20-49)</h4>
            <p>Verification ongoing</p>
          </div>
          <div className="trust-tier new">
            <span className="tier-icon">⚪</span>
            <h4>New (0-19)</h4>
            <p>Just registered</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of verified workers and employers on our platform.</p>
        <div className="cta-actions">
          <Link to="/directory" className="btn btn-primary btn-lg">
            Browse Workers
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;