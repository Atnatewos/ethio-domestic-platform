// File path: /client/src/components/ui/Card.jsx
// Purpose: Modern card component with glassmorphism and hover effects
// Architecture: Flexible card with optional header, body, and footer sections

import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  hoverable = false,
  glassmorphism = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'card';
  const hoverClasses = hoverable ? 'card-hover' : '';
  const glassClasses = glassmorphism ? 'card-glass' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${glassClasses} ${className}`.trim();

  const cardContent = (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );

  if (hoverable || onClick) {
    return (
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;