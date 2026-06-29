// File path: /config/workflows.js
// Purpose: State machine definitions for all business workflows
// Controls valid state transitions and actions for registration, verification, hiring, and payments

module.exports = {
  // Registration Workflow
  registration: {
    name: 'Registration',
    initial: 'draft',
    states: ['draft', 'payment_pending', 'approved', 'verified', 'suspended', 'rejected'],
    transitions: {
      draft: ['payment_pending'],
      payment_pending: ['approved', 'rejected'],
      approved: ['verified', 'suspended'],
      verified: ['suspended'],
      suspended: ['approved'],
      rejected: ['draft']
    },
    actions: {
      submit: { from: 'draft', to: 'payment_pending', label: 'Submit Registration' },
      confirmPayment: { from: 'payment_pending', to: 'approved', label: 'Confirm Payment' },
      rejectPayment: { from: 'payment_pending', to: 'rejected', label: 'Reject Payment' },
      completeVerification: { from: 'approved', to: 'verified', label: 'Complete Verification' },
      suspend: { from: ['approved', 'verified'], to: 'suspended', label: 'Suspend Account' },
      reactivate: { from: 'suspended', to: 'approved', label: 'Reactivate Account' },
      reset: { from: 'rejected', to: 'draft', label: 'Reset to Draft' }
    }
  },

  // Verification Workflow
  verification: {
    name: 'Verification',
    initial: 'pending',
    states: ['pending', 'documents_uploaded', 'under_review', 'approved', 'rejected'],
    transitions: {
      pending: ['documents_uploaded'],
      documents_uploaded: ['under_review'],
      under_review: ['approved', 'rejected'],
      approved: [],
      rejected: ['documents_uploaded']
    },
    actions: {
      uploadDocuments: { from: 'pending', to: 'documents_uploaded', label: 'Upload Documents' },
      startReview: { from: 'documents_uploaded', to: 'under_review', label: 'Start Review' },
      approve: { from: 'under_review', to: 'approved', label: 'Approve Verification' },
      reject: { from: 'under_review', to: 'rejected', label: 'Reject Verification' },
      resubmit: { from: 'rejected', to: 'documents_uploaded', label: 'Resubmit Documents' }
    }
  },

  // Application/Hiring Workflow
  application: {
    name: 'Application',
    initial: 'applied',
    states: ['applied', 'shortlisted', 'interviewed', 'trial', 'hired', 'rejected', 'withdrawn'],
    transitions: {
      applied: ['shortlisted', 'rejected', 'withdrawn'],
      shortlisted: ['interviewed', 'rejected', 'withdrawn'],
      interviewed: ['trial', 'hired', 'rejected', 'withdrawn'],
      trial: ['hired', 'rejected', 'withdrawn'],
      hired: [],
      rejected: [],
      withdrawn: []
    },
    actions: {
      apply: { from: null, to: 'applied', label: 'Apply' },
      shortlist: { from: 'applied', to: 'shortlisted', label: 'Shortlist' },
      interview: { from: 'shortlisted', to: 'interviewed', label: 'Schedule Interview' },
      startTrial: { from: 'interviewed', to: 'trial', label: 'Start 3-Day Trial' },
      hire: { from: ['interviewed', 'trial'], to: 'hired', label: 'Confirm Hire' },
      reject: { from: ['applied', 'shortlisted', 'interviewed', 'trial'], to: 'rejected', label: 'Reject' },
      withdraw: { from: ['applied', 'shortlisted', 'interviewed', 'trial'], to: 'withdrawn', label: 'Withdraw' }
    }
  },

  // Payment Workflow
  payment: {
    name: 'Payment',
    initial: 'pending',
    states: ['pending', 'confirmed', 'completed', 'failed', 'refunded'],
    transitions: {
      pending: ['confirmed', 'failed'],
      confirmed: ['completed', 'refunded'],
      completed: [],
      failed: ['pending'],
      refunded: []
    },
    actions: {
      initiate: { from: null, to: 'pending', label: 'Initiate Payment' },
      confirm: { from: 'pending', to: 'confirmed', label: 'Confirm Payment' },
      complete: { from: 'confirmed', to: 'completed', label: 'Mark as Completed' },
      fail: { from: 'pending', to: 'failed', label: 'Mark as Failed' },
      retry: { from: 'failed', to: 'pending', label: 'Retry Payment' },
      refund: { from: 'confirmed', to: 'refunded', label: 'Refund Payment' }
    }
  },

  // Report/Complaint Workflow
  report: {
    name: 'Report',
    initial: 'pending',
    states: ['pending', 'reviewed', 'resolved', 'dismissed'],
    transitions: {
      pending: ['reviewed', 'dismissed'],
      reviewed: ['resolved', 'dismissed'],
      resolved: [],
      dismissed: []
    },
    actions: {
      file: { from: null, to: 'pending', label: 'File Report' },
      review: { from: 'pending', to: 'reviewed', label: 'Review Report' },
      resolve: { from: 'reviewed', to: 'resolved', label: 'Resolve Report' },
      dismiss: { from: ['pending', 'reviewed'], to: 'dismissed', label: 'Dismiss Report' }
    }
  }
};