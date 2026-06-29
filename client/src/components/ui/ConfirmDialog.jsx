// File path: /client/src/components/ui/ConfirmDialog.jsx
// Purpose: Custom confirmation dialog - replaces window.confirm()
// Usage: const confirmed = await confirm({ title: 'Delete?', message: 'Are you sure?' });

import React from 'react';

export default function ConfirmDialog({ 
  title = 'Confirm Action', 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info'
  onConfirm, 
  onCancel 
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className={`confirm-icon confirm-icon-${type}`}>
            {type === 'danger' ? '⚠' : type === 'warning' ? '❓' : 'ℹ'}
          </div>
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          {message && <p className="modal-message">{message}</p>}
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary">
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}