// File path: /client/src/main.jsx
// Purpose: Application entry point with all providers
// Architecture: Provider hierarchy for global state management

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import providers
import QueryProvider from './providers/QueryProvider';
import ToastProvider from './providers/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';

// Import router
import AppRouter from './router';

// Import styles
import './styles/index.css';
import './styles/animations.css';

/**
 * Application Entry Point
 * Wraps the app with all necessary providers in correct order
 * Provider hierarchy (outermost to innermost):
 * 1. QueryProvider - Data fetching and caching
 * 2. ConfigProvider - Platform configuration
 * 3. AuthProvider - Authentication state
 * 4. ToastProvider - Notifications
 * 5. AppRouter - Routing
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
      <ConfigProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryProvider>
  </React.StrictMode>
);