// File path: /client/src/components/ui/Badge.jsx
// Purpose: Modern badge component for status indicators and tags
// Architecture: Animated badges with multiple variants and sizes

import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  const variantClasses = `badge-${variant}`;
  const sizeClasses = `badge-${size}`;
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <motion.span
      className={classes}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </motion.span>
  );
};

export default Badge;