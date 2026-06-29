// File path: /client/src/router/index.jsx
// Purpose: Main router configuration with layouts
// Architecture: Maps routes to appropriate layouts

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';

// Import layouts
import PublicLayout from '../layouts/PublicLayout';
import WorkerLayout from '../layouts/WorkerLayout';
import EmployerLayout from '../layouts/EmployerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Layout mapping
const layouts = {
  public: PublicLayout,
  worker: WorkerLayout,
  employer: EmployerLayout,
  admin: AdminLayout,
};

/**
 * AppRouter Component
 * Main router that organizes routes by layout
 * Provides 404 handling for unknown routes
 */
const AppRouter = () => {
  // Group routes by layout
  const routesByLayout = routes.reduce((acc, route) => {
    const layout = route.layout || 'public';
    if (!acc[layout]) {
      acc[layout] = [];
    }
    acc[layout].push(route);
    return acc;
  }, {});

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Layout Routes */}
        <Route element={<PublicLayout />}>
          {routesByLayout.public?.map((route, index) => (
            <Route key={`public-${index}`} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Worker Layout Routes */}
        <Route element={<WorkerLayout />}>
          {routesByLayout.worker?.map((route, index) => (
            <Route key={`worker-${index}`} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Employer Layout Routes */}
        <Route element={<EmployerLayout />}>
          {routesByLayout.employer?.map((route, index) => (
            <Route key={`employer-${index}`} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Admin Layout Routes */}
        <Route element={<AdminLayout />}>
          {routesByLayout.admin?.map((route, index) => (
            <Route key={`admin-${index}`} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* 404 Not Found - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;