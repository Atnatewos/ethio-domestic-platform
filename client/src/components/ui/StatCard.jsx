// File path: /client/src/components/ui/StatCard.jsx
// Purpose: Modern stat card for dashboards with animated counters
// Architecture: Displays key metrics with icons and trend indicators

import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendValue,
  color = 'blue',
  className = '',
}) => {
  const colorClasses = {
    blue: 'stat-icon-blue',
    green: 'stat-icon-green',
    yellow: 'stat-icon-yellow',
    red: 'stat-icon-red',
    purple: 'stat-icon-purple',
  };

  return (
    <Card hoverable className={`stat-card ${className}`}>
      <div className="stat-card-content">
        <div className={`stat-icon ${colorClasses[color]}`}>
          {icon}
        </div>
        
        <div className="stat-info">
          <div className="stat-label">{label}</div>
          <motion.div
            className="stat-value"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.div>
          
          {trend && (
            <div className={`stat-trend ${trend}`}>
              <span className="trend-icon">
                {trend === 'up' ? '↑' : '↓'}
              </span>
              <span className="trend-value">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;