// File path: /client/src/components/ui/Button.jsx
// Purpose: Modern animated button component with multiple variants
// Architecture: Uses Framer Motion for smooth interactions and accessibility

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, y: -1 },
  tap: { scale: 0.98 },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  as = 'button',
  to,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const loadingClasses = loading ? 'loading' : '';
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${loadingClasses} ${className}`.trim();

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </>
  );

  if (as === 'link' && to) {
    return (
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : undefined}
        style={{ display: 'inline-block' }}
      >
        <Link to={to} className={classes} onClick={onClick} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;