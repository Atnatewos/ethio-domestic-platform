// File path: /config/pricing.js
// Purpose: All pricing configuration - registration fees, commissions, premium features
// Admin can change these values at runtime via Platform Settings page

module.exports = {
  // Registration fees (one-time, non-refundable)
  registration: {
    worker: {
      amount: 200, // ETB
      currency: 'ETB',
      required: true,
      description: 'Worker registration fee'
    },
    employer: {
      amount: 300, // ETB
      currency: 'ETB',
      required: true,
      description: 'Employer registration fee'
    }
  },
  
  // Commission on successful hire (percentage of first month salary)
  commission: {
    worker: {
      percent: 15, // 15% of first month salary
      basedOn: 'first_month_salary', // Can be 'first_month_salary' or 'fixed_amount'
      description: 'Worker commission on successful hire'
    },
    employer: {
      percent: 15, // 15% of first month salary
      basedOn: 'first_month_salary',
      description: 'Employer commission on successful hire'
    }
  },
  
  // Urgent hire badge (premium feature for employers)
  urgentHire: {
    enabled: true,
    amount: 200, // ETB
    currency: 'ETB',
    durationHours: 48, // Badge lasts 48 hours
    description: 'Urgent hire badge - job appears at top of worker feeds'
  },
  
  // Office registration service fee (for staff-assisted registration)
  officeService: {
    enabled: true,
    amount: 50, // ETB
    currency: 'ETB',
    description: 'Office registration service fee'
  },
  
  // Worker collateral system (security deposit)
  collateral: {
    enabled: true,
    amount: 500, // ETB
    currency: 'ETB',
    holdMonths: 6, // Held for 6 months of good standing
    returnConditions: [
      'Completed 6 months of employment',
      'Left with proper 30-day notice',
      'No serious misconduct reported'
    ],
    description: 'Worker collateral - security deposit for trust'
  },
  
  // Payment methods accepted
  paymentMethods: {
    telebirr: {
      enabled: true,
      name: 'Telebirr',
      instructions: 'Send payment to Telebirr number: 09XXXXXXXX'
    },
    bankTransfer: {
      enabled: true,
      name: 'Bank Transfer',
      bankName: 'Commercial Bank of Ethiopia',
      accountNumber: '1000XXXXXXXXX',
      accountName: 'EthioDomestic PLC'
    },
    cash: {
      enabled: true,
      name: 'Cash at Office',
      instructions: 'Visit our office to pay in cash'
    }
  },
  
  // Salary ranges for job postings (predefined options)
  salaryRanges: [
    { min: 3000, max: 5000, label: '3,000 - 5,000 ETB' },
    { min: 5000, max: 7000, label: '5,000 - 7,000 ETB' },
    { min: 7000, max: 10000, label: '7,000 - 10,000 ETB' },
    { min: 10000, max: 15000, label: '10,000 - 15,000 ETB' },
    { min: 15000, max: 20000, label: '15,000 - 20,000 ETB' },
    { min: 20000, max: 999999, label: '20,000+ ETB' }
  ]
};