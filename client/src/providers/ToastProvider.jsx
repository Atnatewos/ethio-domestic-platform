// File path: /client/src/providers/ToastProvider.jsx
// Purpose: Toast notification provider using react-hot-toast
// Architecture: Replaces custom ToastContext with modern toast library

import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * ToastProvider Component
 * Configures global toast notifications with consistent styling
 * Uses design tokens for colors and spacing
 */
const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      
      {/* Global Toaster Configuration */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 'var(--space-5)',
          right: 'var(--space-5)',
          zIndex: 'var(--z-toast)',
        }}
        toastOptions={{
          // Default toast styling
          duration: 4000,
          
          // Custom styling using design tokens
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-slate-800)',
            border: '1px solid var(--color-slate-200)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            maxWidth: '400px',
          },
          
          // Success toast styling
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid var(--color-success)',
            },
          },
          
          // Error toast styling
          error: {
            duration: 5000,
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid var(--color-danger)',
            },
          },
          
          // Loading toast styling
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider;