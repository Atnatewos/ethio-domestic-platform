// File path: /config/tables.js
// Purpose: ALL table definitions - workers, employers, jobs, payments, etc.
// These tables are rendered dynamically by TableRenderer component

module.exports = {
  // Admin Workers Management Table
  adminWorkers: {
    id: 'admin-workers',
    title: 'Workers Management',
    endpoint: '/api/admin/workers',
    columns: [
      { key: 'photo', label: 'Photo', type: 'image', sortable: false, width: '60px' },
      { key: 'fullName', label: 'Name', type: 'text', sortable: true },
      { key: 'phone', label: 'Phone', type: 'text', sortable: true },
      { key: 'workerType', label: 'Type', type: 'badge', sortable: true },
      { key: 'trustScore', label: 'Trust Score', type: 'trust-score', sortable: true },
      { key: 'verificationStatus', label: 'Status', type: 'status-badge', sortable: true },
      { key: 'registeredAt', label: 'Registered', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view', 'suspend', 'delete'] }
    ],
    filters: [
      { key: 'workerType', label: 'Worker Type', type: 'select', options: ['maid', 'guard', 'nanny', 'cook', 'driver', 'cleaner'] },
      { key: 'trustTier', label: 'Trust Tier', type: 'select', options: ['premium', 'verified', 'inProgress', 'new'] },
      { key: 'verificationStatus', label: 'Status', type: 'select', options: ['draft', 'payment_pending', 'approved', 'verified', 'suspended', 'rejected'] }
    ],
    search: { 
      placeholder: 'Search by name or phone...', 
      fields: ['fullName', 'phone'] 
    },
    pagination: { pageSize: 20 },
    bulkActions: ['suspend', 'export'],
    export: { formats: ['csv'] }
  },

  // Admin Employers Management Table
  adminEmployers: {
    id: 'admin-employers',
    title: 'Employers Management',
    endpoint: '/api/admin/employers',
    columns: [
      { key: 'fullName', label: 'Name', type: 'text', sortable: true },
      { key: 'phone', label: 'Phone', type: 'text', sortable: true },
      { key: 'email', label: 'Email', type: 'text', sortable: true },
      { key: 'householdSize', label: 'Household', type: 'number', sortable: true },
      { key: 'activeJobs', label: 'Active Jobs', type: 'number', sortable: true },
      { key: 'registrationStatus', label: 'Status', type: 'status-badge', sortable: true },
      { key: 'registeredAt', label: 'Registered', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view', 'suspend'] }
    ],
    filters: [
      { key: 'registrationStatus', label: 'Status', type: 'select', options: ['draft', 'payment_pending', 'approved', 'suspended'] }
    ],
    search: { 
      placeholder: 'Search by name, phone, or email...', 
      fields: ['fullName', 'phone', 'email'] 
    },
    pagination: { pageSize: 20 }
  },

  // Admin Jobs Management Table
  adminJobs: {
    id: 'admin-jobs',
    title: 'Jobs Management',
    endpoint: '/api/admin/jobs',
    columns: [
      { key: 'employerName', label: 'Employer', type: 'text', sortable: true },
      { key: 'workerType', label: 'Worker Type', type: 'badge', sortable: true },
      { key: 'schedule', label: 'Schedule', type: 'badge', sortable: true },
      { key: 'salaryRange', label: 'Salary', type: 'text', sortable: true },
      { key: 'isUrgent', label: 'Urgent', type: 'badge', sortable: true },
      { key: 'applicantCount', label: 'Applicants', type: 'number', sortable: true },
      { key: 'status', label: 'Status', type: 'status-badge', sortable: true },
      { key: 'createdAt', label: 'Posted', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view', 'close'] }
    ],
    filters: [
      { key: 'workerType', label: 'Worker Type', type: 'select', options: ['maid', 'guard', 'nanny', 'cook', 'driver', 'cleaner'] },
      { key: 'status', label: 'Status', type: 'select', options: ['draft', 'active', 'filled', 'closed', 'cancelled'] },
      { key: 'isUrgent', label: 'Urgent Only', type: 'checkbox' }
    ],
    pagination: { pageSize: 20 }
  },

  // Admin Payments Table
  adminPayments: {
    id: 'admin-payments',
    title: 'Payments Management',
    endpoint: '/api/admin/payments',
    columns: [
      { key: 'payerName', label: 'Payer', type: 'text', sortable: true },
      { key: 'paymentType', label: 'Type', type: 'badge', sortable: true },
      { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
      { key: 'method', label: 'Method', type: 'badge', sortable: true },
      { key: 'status', label: 'Status', type: 'status-badge', sortable: true },
      { key: 'transactionRef', label: 'Transaction Ref', type: 'text', sortable: false },
      { key: 'createdAt', label: 'Date', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view', 'confirm'] }
    ],
    filters: [
      { key: 'paymentType', label: 'Type', type: 'select', options: ['registration', 'commission', 'urgent_hire', 'office_service', 'collateral'] },
      { key: 'status', label: 'Status', type: 'select', options: ['pending', 'confirmed', 'failed', 'refunded'] },
      { key: 'method', label: 'Method', type: 'select', options: ['telebirr', 'bank_transfer', 'cash', 'office_cash'] }
    ],
    dateRange: true,
    pagination: { pageSize: 20 },
    export: { formats: ['csv'] }
  },

  // Admin Registration Approvals Queue
  adminApprovals: {
    id: 'admin-approvals',
    title: 'Registration Approvals',
    endpoint: '/api/admin/approvals',
    columns: [
      { key: 'fullName', label: 'Name', type: 'text', sortable: true },
      { key: 'phone', label: 'Phone', type: 'text', sortable: true },
      { key: 'userType', label: 'Type', type: 'badge', sortable: true },
      { key: 'paymentProof', label: 'Payment Proof', type: 'image', sortable: false, width: '60px' },
      { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
      { key: 'registrationSource', label: 'Source', type: 'badge', sortable: true },
      { key: 'createdAt', label: 'Submitted', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['approve', 'reject'] }
    ],
    filters: [
      { key: 'userType', label: 'User Type', type: 'select', options: ['worker', 'employer'] },
      { key: 'registrationSource', label: 'Source', type: 'select', options: ['online', 'office'] }
    ],
    pagination: { pageSize: 20 }
  },

  // Admin Verification Queue
  adminVerification: {
    id: 'admin-verification',
    title: 'Verification Queue',
    endpoint: '/api/admin/verification',
    columns: [
      { key: 'photo', label: 'Photo', type: 'image', sortable: false, width: '60px' },
      { key: 'fullName', label: 'Name', type: 'text', sortable: true },
      { key: 'phone', label: 'Phone', type: 'text', sortable: true },
      { key: 'workerType', label: 'Type', type: 'badge', sortable: true },
      { key: 'documents', label: 'Documents', type: 'badge', sortable: false },
      { key: 'references', label: 'References', type: 'number', sortable: false },
      { key: 'submittedAt', label: 'Submitted', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['review', 'approve', 'reject'] }
    ],
    pagination: { pageSize: 20 }
  },

  // Worker Applications Table
  workerApplications: {
    id: 'worker-applications',
    title: 'My Applications',
    endpoint: '/api/worker/applications',
    columns: [
      { key: 'jobTitle', label: 'Job', type: 'text', sortable: true },
      { key: 'employerName', label: 'Employer', type: 'text', sortable: true },
      { key: 'workerType', label: 'Type', type: 'badge', sortable: false },
      { key: 'salary', label: 'Salary', type: 'text', sortable: false },
      { key: 'status', label: 'Status', type: 'status-badge', sortable: true },
      { key: 'appliedAt', label: 'Applied', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view', 'withdraw'] }
    ],
    filters: [
      { key: 'status', label: 'Status', type: 'select', options: ['applied', 'shortlisted', 'interviewed', 'trial', 'hired', 'rejected', 'withdrawn'] }
    ],
    pagination: { pageSize: 20 }
  },

  // Employer Jobs Table
  employerJobs: {
    id: 'employer-jobs',
    title: 'My Jobs',
    endpoint: '/api/employer/jobs',
    columns: [
      { key: 'workerType', label: 'Worker Type', type: 'badge', sortable: true },
      { key: 'schedule', label: 'Schedule', type: 'badge', sortable: true },
      { key: 'salaryRange', label: 'Salary', type: 'text', sortable: true },
      { key: 'isUrgent', label: 'Urgent', type: 'badge', sortable: false },
      { key: 'applicantCount', label: 'Applicants', type: 'number', sortable: true },
      { key: 'status', label: 'Status', type: 'status-badge', sortable: true },
      { key: 'createdAt', label: 'Posted', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view', 'edit', 'close', 'applicants'] }
    ],
    filters: [
      { key: 'status', label: 'Status', type: 'select', options: ['draft', 'active', 'filled', 'closed'] }
    ],
    pagination: { pageSize: 20 }
  },

  // Job Applicants Table
  jobApplicants: {
    id: 'job-applicants',
    title: 'Job Applicants',
    endpoint: '/api/employer/applicants',
    columns: [
      { key: 'photo', label: 'Photo', type: 'image', sortable: false, width: '60px' },
      { key: 'fullName', label: 'Name', type: 'text', sortable: true },
      { key: 'trustScore', label: 'Trust Score', type: 'trust-score', sortable: true },
      { key: 'experience', label: 'Experience', type: 'text', sortable: true },
      { key: 'skills', label: 'Skills', type: 'badges', sortable: false },
      { key: 'appliedAt', label: 'Applied', type: 'date', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view', 'shortlist', 'reject'] }
    ],
    filters: [
      { key: 'trustTier', label: 'Trust Tier', type: 'select', options: ['premium', 'verified', 'inProgress', 'new'] }
    ],
    pagination: { pageSize: 20 }
  },

  // Worker Directory (Public)
  workerDirectory: {
    id: 'worker-directory',
    title: 'Verified Workers',
    endpoint: '/api/workers/directory',
    columns: [
      { key: 'photo', label: 'Photo', type: 'image', sortable: false, width: '80px' },
      { key: 'fullName', label: 'Name', type: 'text', sortable: true },
      { key: 'workerType', label: 'Type', type: 'badge', sortable: true },
      { key: 'trustScore', label: 'Trust Score', type: 'trust-score', sortable: true },
      { key: 'experience', label: 'Experience', type: 'text', sortable: true },
      { key: 'location', label: 'Location', type: 'text', sortable: true },
      { key: 'availability', label: 'Availability', type: 'badge', sortable: true },
      { key: 'actions', label: 'Actions', type: 'actions', sortable: false, actions: ['view'] }
    ],
    filters: [
      { key: 'workerType', label: 'Worker Type', type: 'select', options: ['maid', 'guard', 'nanny', 'cook', 'driver', 'cleaner'] },
      { key: 'trustTier', label: 'Trust Tier', type: 'select', options: ['premium', 'verified'] },
      { key: 'availability', label: 'Availability', type: 'select', options: ['full_time', 'part_time', 'live_in', 'live_out'] },
      { key: 'location', label: 'Location', type: 'select', options: ['addis_ababa', 'bole', 'kirkos', 'arada', 'gulele', 'yeka'] }
    ],
    search: { 
      placeholder: 'Search workers...', 
      fields: ['fullName', 'skills'] 
    },
    pagination: { pageSize: 12 }
  }
};