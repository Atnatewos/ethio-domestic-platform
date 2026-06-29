// File path: /client/src/router/routes.jsx
// Purpose: Route configuration with lazy loading
// Architecture: Defines all routes grouped by access level

import React, { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';

// ============================================
// LAZY LOADED PAGES
// ============================================

// Public Pages (no auth required)
const Landing = lazy(() => import('../pages/public/Landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const RegisterWorker = lazy(() => import('../pages/auth/RegisterWorker'));
const RegisterEmployer = lazy(() => import('../pages/auth/RegisterEmployer'));
const WorkerDirectory = lazy(() => import('../pages/public/WorkerDirectory'));
const WorkerProfile = lazy(() => import('../pages/public/WorkerProfile'));

// Worker Pages
const WorkerDashboard = lazy(() => import('../pages/worker/Dashboard'));
const WorkerJobs = lazy(() => import('../pages/worker/Jobs'));
const WorkerApplications = lazy(() => import('../pages/worker/Applications'));
const WorkerVerification = lazy(() => import('../pages/worker/Verification'));

// Employer Pages
const EmployerDashboard = lazy(() => import('../pages/employer/Dashboard'));
const EmployerPostJob = lazy(() => import('../pages/employer/PostJob'));
const EmployerMyJobs = lazy(() => import('../pages/employer/MyJobs'));
const EmployerApplicants = lazy(() => import('../pages/employer/Applicants'));
const EmployerBrowseWorkers = lazy(() => import('../pages/employer/BrowseWorkers'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminApprovals = lazy(() => import('../pages/admin/Approvals'));
const AdminVerification = lazy(() => import('../pages/admin/Verification'));
const AdminPayments = lazy(() => import('../pages/admin/Payments'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));
const AdminWorkers = lazy(() => import('../pages/admin/Workers'));
const AdminEmployers = lazy(() => import('../pages/admin/Employers'));
const AdminJobs = lazy(() => import('../pages/admin/Jobs'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));

// ============================================
// LOADING FALLBACK
// ============================================
const PageLoader = () => (
  <div className="page-loader">
    <div className="skeleton-card" style={{ height: '400px' }}></div>
  </div>
);

/**
 * Wrap component with Suspense for lazy loading
 */
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/**
 * Wrap component with ProtectedRoute
 */
const withAuth = (Component, roles = []) => (
  <ProtectedRoute allowedRoles={roles}>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </ProtectedRoute>
);

// ============================================
// ROUTE CONFIGURATION
// ============================================

export const routes = [
  // Public Routes
  {
    path: '/',
    element: withSuspense(Landing),
    layout: 'public',
  },
  {
    path: '/login',
    element: withSuspense(Login),
    layout: 'public',
  },
  {
    path: '/register/worker',
    element: withSuspense(RegisterWorker),
    layout: 'public',
  },
  {
    path: '/register/employer',
    element: withSuspense(RegisterEmployer),
    layout: 'public',
  },
  {
    path: '/directory',
    element: withSuspense(WorkerDirectory),
    layout: 'public',
  },
  {
    path: '/worker/:id',
    element: withSuspense(WorkerProfile),
    layout: 'public',
  },

  // Worker Routes
  {
    path: '/worker/dashboard',
    element: withAuth(WorkerDashboard, ['worker']),
    layout: 'worker',
  },
  {
    path: '/worker/jobs',
    element: withAuth(WorkerJobs, ['worker']),
    layout: 'worker',
  },
  {
    path: '/worker/applications',
    element: withAuth(WorkerApplications, ['worker']),
    layout: 'worker',
  },
  {
    path: '/worker/verification',
    element: withAuth(WorkerVerification, ['worker']),
    layout: 'worker',
  },

  // Employer Routes
  {
    path: '/employer/dashboard',
    element: withAuth(EmployerDashboard, ['employer']),
    layout: 'employer',
  },
  {
    path: '/employer/post-job',
    element: withAuth(EmployerPostJob, ['employer']),
    layout: 'employer',
  },
  {
    path: '/employer/my-jobs',
    element: withAuth(EmployerMyJobs, ['employer']),
    layout: 'employer',
  },
  {
    path: '/employer/my-jobs/:jobId/applicants',
    element: withAuth(EmployerApplicants, ['employer']),
    layout: 'employer',
  },
  {
    path: '/employer/browse-workers',
    element: withAuth(EmployerBrowseWorkers, ['employer']),
    layout: 'employer',
  },

  // Admin Routes
  {
    path: '/admin/dashboard',
    element: withAuth(AdminDashboard, ['super_admin', 'verification_admin', 'finance_admin', 'office_staff']),
    layout: 'admin',
  },
  {
    path: '/admin/approvals',
    element: withAuth(AdminApprovals, ['super_admin', 'verification_admin', 'office_staff']),
    layout: 'admin',
  },
  {
    path: '/admin/verification',
    element: withAuth(AdminVerification, ['super_admin', 'verification_admin']),
    layout: 'admin',
  },
  {
    path: '/admin/payments',
    element: withAuth(AdminPayments, ['super_admin', 'finance_admin']),
    layout: 'admin',
  },
  {
    path: '/admin/settings',
    element: withAuth(AdminSettings, ['super_admin']),
    layout: 'admin',
  },
  {
    path: '/admin/workers',
    element: withAuth(AdminWorkers, ['super_admin', 'verification_admin', 'office_staff']),
    layout: 'admin',
  },
  {
    path: '/admin/employers',
    element: withAuth(AdminEmployers, ['super_admin', 'office_staff']),
    layout: 'admin',
  },
  {
    path: '/admin/jobs',
    element: withAuth(AdminJobs, ['super_admin', 'verification_admin']),
    layout: 'admin',
  },
  {
    path: '/admin/reports',
    element: withAuth(AdminReports, ['super_admin', 'verification_admin']),
    layout: 'admin',
  },
];