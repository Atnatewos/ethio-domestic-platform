// File path: /client/src/components/ui/Skeleton.jsx
// Purpose: Skeleton loading components for better UX during data fetching
// Architecture: Animated placeholder components that match actual layout

import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => (
  <motion.div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius }}
    animate={{
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`skeleton-text-group ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '60%' : '100%'}
        height="16px"
        borderRadius="4px"
      />
    ))}
  </div>
);

const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`}>
    <Skeleton width="40px" height="40px" borderRadius="50%" />
    <SkeletonText lines={3} />
  </div>
);

const SkeletonTable = ({ rows = 5, className = '' }) => (
  <div className={`skeleton-table ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton-table-row">
        <Skeleton width="100%" height="20px" />
      </div>
    ))}
  </div>
);

Skeleton.Text = SkeletonText;
Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;

export default Skeleton;