// File path: /client/src/components/ui/Input.jsx
// Purpose: Modern input component with validation states and animations
// Architecture: Integrates with React Hook Form and provides visual feedback

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const inputClasses = `form-input ${error ? 'error' : ''} ${className}`.trim();

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {props.required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <motion.span
          className="form-error"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.span>
      )}
      
      {hint && !error && (
        <span className="form-hint">{hint}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;