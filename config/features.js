// File path: /config/features.js
// Purpose: Feature flags for phased rollout
// Toggle features on/off without code changes

module.exports = {
  // Phase 1: MVP Features (enabled by default)
  mvp: {
    workerRegistration: {
      enabled: true,
      name: 'Worker Registration',
      description: 'Worker self-registration with payment flow'
    },
    employerRegistration: {
      enabled: true,
      name: 'Employer Registration',
      description: 'Employer self-registration with payment flow'
    },
    officeRegistration: {
      enabled: true,
      name: 'Office Registration',
      description: 'Staff-assisted registration at physical office'
    },
    verificationWorkflow: {
      enabled: true,
      name: 'Verification Workflow',
      description: 'Document upload and admin verification'
    },
    trustScore: {
      enabled: true,
      name: 'Trust Score System',
      description: 'Worker trust score calculation and display'
    },
    jobPosting: {
      enabled: true,
      name: 'Job Posting',
      description: 'Employers can post job listings'
    },
    jobApplication: {
      enabled: true,
      name: 'Job Application',
      description: 'Workers can apply to jobs'
    },
    telegramAlerts: {
      enabled: true,
      name: 'Telegram Alerts',
      description: 'Admin notifications via Telegram bot'
    },
    whatsappNotifications: {
      enabled: false, // Disabled for MVP - needs WhatsApp Business API
      name: 'WhatsApp Notifications',
      description: 'User notifications via WhatsApp'
    }
  },
  
  // Phase 2: Growth Features (disabled by default)
  growth: {
    smartMatching: {
      enabled: false,
      name: 'Smart Matching',
      description: 'AI-powered worker-job matching algorithm'
    },
    trialPeriod: {
      enabled: false,
      name: 'Trial Period',
      description: '3-day paid trial before permanent hire'
    },
    reviewSystem: {
      enabled: false,
      name: 'Review System',
      description: 'Employer reviews with context tags'
    },
    emergencyReplacement: {
      enabled: false,
      name: 'Emergency Replacement',
      description: 'Auto-priority replacement if worker leaves within 30 days'
    },
    urgentHireBadge: {
      enabled: false,
      name: 'Urgent Hire Badge',
      description: 'Premium feature to boost job visibility'
    },
    workerCollateral: {
      enabled: false,
      name: 'Worker Collateral',
      description: 'Security deposit system for workers'
    },
    digitalPassport: {
      enabled: false,
      name: 'Digital Work Passport',
      description: 'Downloadable PDF profile for workers'
    },
    telebirrIntegration: {
      enabled: false,
      name: 'Telebirr Integration',
      description: 'Automated payment processing via Telebirr'
    }
  },
  
  // Phase 3: Scale Features (disabled by default)
  scale: {
    mobileApp: {
      enabled: false,
      name: 'Mobile App',
      description: 'React Native mobile application'
    },
    amharicSupport: {
      enabled: false,
      name: 'Amharic Language',
      description: 'Full Amharic translation'
    },
    subscriptionPlans: {
      enabled: false,
      name: 'Subscription Plans',
      description: 'Monthly subscriptions for frequent-hiring employers'
    },
    videoInterviews: {
      enabled: false,
      name: 'Video Interviews',
      description: 'In-app video interview scheduling'
    },
    trainingPrograms: {
      enabled: false,
      name: 'Training Programs',
      description: 'Worker training and certification'
    }
  }
};