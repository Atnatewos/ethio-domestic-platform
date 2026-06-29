// File path: /client/src/providers/QueryProvider.jsx
// Purpose: React Query provider for server state management
// Architecture: Configures caching, retries, and background refetching

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure QueryClient with optimal defaults for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes (reduces API calls)
      staleTime: 5 * 60 * 1000,
      
      // Cache data for 10 minutes before garbage collection
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests up to 2 times
      retry: (failureCount, error) => {
        // Don't retry on 401/403/404 errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      
      // Refetch when network reconnects
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Don't retry mutations by default
      retry: false,
    },
  },
});

/**
 * QueryProvider Component
 * Wraps the application with React Query context
 * Provides data fetching, caching, and synchronization
 */
const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;