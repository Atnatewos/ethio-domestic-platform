// File path: /config/trustScore.js
// Purpose: Trust Score calculation rules, weights, and tier definitions
// Trust Score is the core value proposition - determines worker visibility and trust

module.exports = {
  // Trust Score ranges from 0 to 100
  maxScore: 100,
  
  // Scoring weights (must sum to 100)
  weights: {
    verification: 50, // Verification completion (police, health, ID)
    references: 20, // Reference check quality
    reviews: 20, // Employer reviews after hire
    responseRate: 10, // Response rate to job applications
    // Community vouches is a bonus (can exceed 100 total)
    vouchBonus: 15 // Bonus for 3+ employer vouches
  },
  
  // Trust Score tiers with visual badges
  tiers: [
    {
      name: 'premium',
      label: 'Premium Worker',
      icon: '🟢',
      color: 'green',
      minScore: 80,
      maxScore: 100,
      benefits: [
        'Appears at top of search results',
        'Featured profile badge',
        'Priority in job matching'
      ]
    },
    {
      name: 'verified',
      label: 'Verified Worker',
      icon: '🔵',
      color: 'blue',
      minScore: 50,
      maxScore: 79,
      benefits: [
        'All verification checks passed',
        'Visible in worker directory'
      ]
    },
    {
      name: 'inProgress',
      label: 'Verification In Progress',
      icon: '🟡',
      color: 'yellow',
      minScore: 20,
      maxScore: 49,
      benefits: [
        'Verification ongoing',
        'Limited visibility'
      ]
    },
    {
      name: 'new',
      label: 'New Worker',
      icon: '⚪',
      color: 'gray',
      minScore: 0,
      maxScore: 19,
      benefits: [
        'Just registered',
        'Awaiting verification'
      ]
    }
  ],
  
  // Verification scoring rules
  verification: {
    policeClearance: {
      required: true,
      points: 20,
      description: 'Police clearance certificate'
    },
    healthCertificate: {
      required: true,
      points: 15,
      description: 'Health certificate (with expiry tracking)',
      expiryWarningDays: 30 // Warn 30 days before expiry
    },
    idDocument: {
      required: true,
      points: 15,
      description: 'Valid ID document (passport, kebele ID, or driver license)'
    }
  },
  
  // Reference check scoring
  references: {
    allPositive: {
      points: 20,
      description: 'All references checked and positive'
    },
    mixed: {
      points: 10,
      description: 'Some references positive, some unable to verify'
    },
    unableToVerify: {
      points: 0,
      description: 'Unable to verify references'
    },
    negative: {
      points: -20,
      description: 'Negative reference feedback',
      autoReject: true // Auto-reject if negative reference
    }
  },
  
  // Review scoring (based on employer ratings)
  reviews: {
    excellent: {
      minRating: 4.5,
      points: 20,
      description: 'Excellent reviews (4.5+ stars)'
    },
    good: {
      minRating: 3.5,
      points: 15,
      description: 'Good reviews (3.5-4.4 stars)'
    },
    average: {
      minRating: 2.5,
      points: 10,
      description: 'Average reviews (2.5-3.4 stars)'
    },
    poor: {
      minRating: 0,
      points: 0,
      description: 'Poor reviews (below 2.5 stars)'
    }
  },
  
  // Response rate scoring
  responseRate: {
    within24Hours: {
      points: 10,
      description: 'Responds to applications within 24 hours'
    },
    within48Hours: {
      points: 5,
      description: 'Responds within 48 hours'
    },
    slow: {
      points: 0,
      description: 'Slow to respond (over 48 hours)'
    }
  },
  
  // Community vouching bonus
  vouching: {
    requiredVouches: 3, // Need 3 employer vouches for bonus
    bonusPoints: 15,
    description: 'Community vouching bonus - 3 employers vouch for this worker'
  },
  
  // Context tags for reviews (structured feedback)
  reviewTags: {
    positive: [
      { id: 'on_time', label: 'Shows up on time', icon: '⏰' },
      { id: 'good_with_children', label: 'Good with children', icon: '👶' },
      { id: 'honest', label: 'Honest and trustworthy', icon: '🤝' },
      { id: 'hard_worker', label: 'Hard worker', icon: '💪' },
      { id: 'good_cooking', label: 'Good cooking', icon: '🍳' },
      { id: 'clean', label: 'Very clean', icon: '✨' },
      { id: 'respectful', label: 'Respectful', icon: '🙏' }
    ],
    warning: [
      { id: 'needs_supervision', label: 'Needs supervision', icon: '⚠️' },
      { id: 'phone_addiction', label: 'Frequently on phone', icon: '📱' },
      { id: 'attendance_issues', label: 'Attendance issues', icon: '📅' },
      { id: 'slow', label: 'Works slowly', icon: '🐌' }
    ]
  }
};