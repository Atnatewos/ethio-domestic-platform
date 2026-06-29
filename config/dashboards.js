// File path: /config/dashboards.js
// Purpose: ALL dashboard widget definitions for Admin, Worker, and Employer
// These widgets are rendered dynamically by the DashboardRenderer component

module.exports = {
  // Admin Dashboard Configuration
  adminDashboard: {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    widgets: [
      {
        id: 'stats-overview',
        type: 'stats-cards',
        position: 'top',
        span: 4,
        stats: [
          { label: 'Total Workers', valueKey: 'workers.total', icon: '👷', color: 'blue', endpoint: '/api/admin/stats/workers/total' },
          { label: 'Verified Workers', valueKey: 'workers.verified', icon: '✅', color: 'green', endpoint: '/api/admin/stats/workers/verified' },
          { label: 'Active Jobs', valueKey: 'jobs.active', icon: '💼', color: 'purple', endpoint: '/api/admin/stats/jobs/active' },
          { label: 'Revenue (Month)', valueKey: 'payments.monthTotal', icon: '💰', color: 'yellow', endpoint: '/api/admin/stats/payments/month', format: 'currency' }
        ]
      },
      {
        id: 'pending-approvals',
        type: 'data-table',
        position: 'left',
        span: 2,
        title: 'Pending Registration Approvals',
        configRef: 'adminApprovals',
        limit: 5,
        endpoint: '/api/admin/approvals?status=pending&limit=5'
      },
      {
        id: 'verification-queue',
        type: 'data-table',
        position: 'right',
        span: 2,
        title: 'Verification Queue',
        configRef: 'adminVerification',
        limit: 5,
        endpoint: '/api/admin/verification?status=pending&limit=5'
      },
      {
        id: 'recent-activity',
        type: 'activity-feed',
        position: 'bottom',
        span: 4,
        title: 'Recent Activity',
        endpoint: '/api/admin/activity/recent',
        limit: 10
      }
    ]
  },

  // Worker Dashboard Configuration
  workerDashboard: {
    id: 'worker-dashboard',
    title: 'Worker Dashboard',
    widgets: [
      {
        id: 'trust-score-card',
        type: 'trust-score-display',
        position: 'top',
        span: 4,
        title: 'Your Trust Score',
        endpoint: '/api/worker/trust-score'
      },
      {
        id: 'verification-progress',
        type: 'progress-card',
        position: 'top',
        span: 4,
        title: 'Verification Status',
        endpoint: '/api/worker/verification/status'
      },
      {
        id: 'recommended-jobs',
        type: 'job-list',
        position: 'main',
        span: 3,
        title: 'Recommended Jobs for You',
        endpoint: '/api/worker/jobs/recommended',
        limit: 5
      },
      {
        id: 'recent-applications',
        type: 'data-table',
        position: 'bottom',
        span: 4,
        title: 'My Recent Applications',
        configRef: 'workerApplications',
        limit: 5,
        endpoint: '/api/worker/applications?limit=5'
      }
    ]
  },

  // Employer Dashboard Configuration
  employerDashboard: {
    id: 'employer-dashboard',
    title: 'Employer Dashboard',
    widgets: [
      {
        id: 'quick-stats',
        type: 'stats-cards',
        position: 'top',
        span: 4,
        stats: [
          { label: 'Active Jobs', valueKey: 'jobs.active', icon: '💼', color: 'blue', endpoint: '/api/employer/stats/jobs/active' },
          { label: 'Total Applicants', valueKey: 'applicants.total', icon: '', color: 'green', endpoint: '/api/employer/stats/applicants/total' },
          { label: 'Hired Workers', valueKey: 'workers.hired', icon: '🤝', color: 'purple', endpoint: '/api/employer/stats/workers/hired' }
        ]
      },
      {
        id: 'quick-actions',
        type: 'action-buttons',
        position: 'top',
        span: 4,
        actions: [
          { label: 'Post New Job', icon: '➕', link: '/employer/post-job', color: 'primary' },
          { label: 'Browse Workers', icon: '🔍', link: '/employer/browse-workers', color: 'secondary' }
        ]
      },
      {
        id: 'active-jobs',
        type: 'data-table',
        position: 'main',
        span: 4,
        title: 'My Active Jobs',
        configRef: 'employerJobs',
        limit: 5,
        endpoint: '/api/employer/jobs?status=active&limit=5'
      },
      {
        id: 'recent-applicants',
        type: 'applicant-list',
        position: 'bottom',
        span: 4,
        title: 'Recent Applicants',
        endpoint: '/api/employer/applicants/recent',
        limit: 5
      }
    ]
  }
};