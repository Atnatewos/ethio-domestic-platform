// File path: /client/src/components/ui/Toast.jsx
// Purpose: Individual toast notification component
// Types: success (green), error (red), warning (yellow), info (blue)

import React, { useEffect, useState } from 'react';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
};

export default function Toast({ id, message, type = 'info', onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className="toast-icon">
        {ICONS[type]}
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Close">
        ×
      </button>
      <div className="toast-progress" />
    </div>
  );
}