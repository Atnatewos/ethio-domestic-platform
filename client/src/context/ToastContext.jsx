// File path: /client/src/context/ToastContext.jsx
// Purpose: Global toast notification system - replaces browser's alert()
// Usage: const { toast } = useToast(); toast.success('Saved!');

import React, { createContext, useState, useContext, useCallback } from 'react';
import ToastContainer from '../components/ui/ToastContainer';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [promptDialog, setPromptDialog] = useState(null);

  // Add a new toast
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastIdCounter;
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toast API - easy to use
  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration || 5000),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    remove: removeToast
  };

  // Confirm dialog (replaces window.confirm)
  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        ...options,
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  // Prompt dialog (replaces window.prompt)
  const prompt = useCallback((options) => {
    return new Promise((resolve) => {
      setPromptDialog({
        ...options,
        onSubmit: (value) => {
          setPromptDialog(null);
          resolve(value);
        },
        onCancel: () => {
          setPromptDialog(null);
          resolve(null);
        }
      });
    });
  }, []);

  const value = {
    toast,
    confirm,
    prompt,
    toasts,
    removeToast,
    confirmDialog,
    promptDialog
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}
      {promptDialog && <PromptDialog {...promptDialog} />}
    </ToastContext.Provider>
  );
}

// Prompt Dialog Component (inline here for simplicity)
function PromptDialog({ title, message, defaultValue = '', placeholder, onSubmit, onCancel }) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content prompt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title || 'Input Required'}</h3>
        </div>
        <div className="modal-body">
          {message && <p className="modal-message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="form-input"
              autoFocus
            />
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-primary">OK</button>
        </div>
      </div>
    </div>
  );
}

// Custom hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;