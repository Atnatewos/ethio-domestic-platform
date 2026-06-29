// File path: /client/src/components/ui/ToastContainer.jsx
// Purpose: Container that renders all active toasts in the top-right corner

import React from 'react';
import Toast from './Toast';

export default function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}