// File path: /config/navigation.js
// Purpose: Navigation menus and breadcrumb definitions for all user roles
// Rendered dynamically by the Navigation and Breadcrumbs components

module.exports = {
  // Navigation Menus
  menus: {
    // Public Navigation (Unauthenticated)
    public: [
      { label: 'Home', path: '/', icon: '🏠' },
      { label: 'Find Workers', path: '/directory', icon: '' },
      { label: 'About', path: '/about', icon: 'ℹ️' },
      { label: 'Contact', path: '/contact', icon: '📞' },
      { label: 'Login', path: '/login', icon: '🔑', authRequired: false },
      { label: 'Register', path: '/register', icon: '📝', authRequired: false }
    ],

    // Worker Navigation (Authenticated)
    worker: [
      { label: 'Dashboard', path: '/worker/dashboard', icon: '📊' },
      { label: 'Find Jobs', path: '/worker/jobs', icon: '💼' },
      { label: 'My Applications', path: '/worker/applications', icon: '📋' },
      { label: 'Verification', path: '/worker/verification', icon: '✅' },
      { label: 'My Profile', path: '/worker/profile', icon: '👤' }
    ],

    // Employer Navigation (Authenticated)
    employer: [
      { label: 'Dashboard', path: '/employer/dashboard', icon: '📊' },
      { label: 'Post Job', path: '/employer/post-job', icon: '➕' },
      { label: 'My Jobs', path: '/employer/my-jobs', icon: '💼' },
      { label: 'Browse Workers', path: '/employer/browse-workers', icon: '🔍' }
    ],

    // Admin Navigation (Authenticated)
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
      { label: 'Approvals', path: '/admin/approvals', icon: '⏳', badge: 'pending_approvals' },
      { label: 'Verification', path: '/admin/verification', icon: '✅', badge: 'pending_verification' },
      { label: 'Workers', path: '/admin/workers', icon: '👷' },
      { label: 'Employers', path: '/admin/employers', icon: '' },
      { label: 'Jobs', path: '/admin/jobs', icon: '💼' },
      { label: 'Payments', path: '/admin/payments', icon: '💰' },
      { label: 'Reports', path: '/admin/reports', icon: '', badge: 'pending_reports' },
      { label: 'Office', path: '/admin/office', icon: '🏢' },
      { label: 'Settings', path: '/admin/settings', icon: '⚙️' }
    ]
  },

  // Breadcrumb Definitions
  // Maps route patterns to breadcrumb labels
  breadcrumbs: {
    // Public
    '/': 'Home',
    '/directory': 'Worker Directory',
    '/about': 'About Us',
    '/contact': 'Contact',
    '/login': 'Login',
    '/register': 'Register',
    '/register/worker': 'Worker Registration',
    '/register/employer': 'Employer Registration',

    // Worker
    '/worker/dashboard': 'Dashboard',
    '/worker/jobs': 'Find Jobs',
    '/worker/jobs/:id': 'Job Details',
    '/worker/applications': 'My Applications',
    '/worker/verification': 'Verification',
    '/worker/verification/upload': 'Upload Documents',
    '/worker/verification/status': 'Verification Status',
    '/worker/profile': 'My Profile',
    '/worker/profile/edit': 'Edit Profile',

    // Employer
    '/employer/dashboard': 'Dashboard',
    '/employer/post-job': 'Post Job',
    '/employer/my-jobs': 'My Jobs',
    '/employer/my-jobs/:id': 'Job Details',
    '/employer/my-jobs/:id/applicants': 'Applicants',
    '/employer/browse-workers': 'Browse Workers',
    '/employer/browse-workers/:id': 'Worker Profile',
    '/employer/hire/:id': 'Hire Worker',
    '/employer/review/:id': 'Review Worker',

    // Admin
    '/admin/dashboard': 'Dashboard',
    '/admin/approvals': 'Registration Approvals',
    '/admin/verification': 'Verification Queue',
    '/admin/verification/:id': 'Review Verification',
    '/admin/workers': 'Workers Management',
    '/admin/workers/:id': 'Worker Details',
    '/admin/employers': 'Employers Management',
    '/admin/employers/:id': 'Employer Details',
    '/admin/jobs': 'Jobs Management',
    '/admin/jobs/:id': 'Job Details',
    '/admin/payments': 'Payments Management',
    '/admin/payments/:id': 'Payment Details',
    '/admin/reports': 'Reports Management',
    '/admin/reports/:id': 'Report Details',
    '/admin/office': 'Office Registration',
    '/admin/settings': 'Platform Settings'
  },

  // Route Access Control
  // Defines which roles can access which route patterns
  accessControl: {
    public: ['/', '/directory', '/about', '/contact', '/login', '/register', '/register/*'],
    worker: ['/worker/*'],
    employer: ['/employer/*'],
    admin: ['/admin/*']
  }
};