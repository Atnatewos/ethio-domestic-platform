// File path: /config/forms.js
// Purpose: ALL form definitions - worker registration, employer registration, job posting, etc.
// These forms are rendered dynamically by FormRenderer component

const platform = require('./platform');
const pricing = require('./pricing');

module.exports = {
  // Worker Registration Form
  workerRegistration: {
    id: 'worker-registration',
    title: 'Worker Registration',
    description: 'Join EthioDomestic and connect with verified employers',
    sections: [
      {
        id: 'personal',
        title: 'Personal Information',
        fields: [
          {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your full name',
            validation: { minLength: 3, maxLength: 100 }
          },
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: true,
            placeholder: '+251XXXXXXXXX',
            validation: { pattern: '^\\+251[0-9]{9}$' },
            helpText: 'Format: +251912345678'
          },
          {
            name: 'age',
            label: 'Age',
            type: 'number',
            required: true,
            min: 18,
            max: 70,
            placeholder: 'Your age'
          },
          {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' }
            ]
          },
          {
            name: 'photo',
            label: 'Photo',
            type: 'file',
            required: true,
            accept: 'image/*',
            helpText: 'Take a clear photo with your phone camera'
          }
        ]
      },
      {
        id: 'emergency',
        title: 'Emergency Contact',
        description: 'Required for your safety',
        fields: [
          {
            name: 'emergencyContactName',
            label: 'Emergency Contact Name',
            type: 'text',
            required: true,
            placeholder: 'Full name of emergency contact'
          },
          {
            name: 'emergencyContactPhone',
            label: 'Emergency Contact Phone',
            type: 'tel',
            required: true,
            placeholder: '+251XXXXXXXXX',
            validation: { pattern: '^\\+251[0-9]{9}$' }
          },
          {
            name: 'emergencyContactRelationship',
            label: 'Relationship',
            type: 'select',
            required: true,
            options: [
              { value: 'spouse', label: 'Spouse' },
              { value: 'parent', label: 'Parent' },
              { value: 'sibling', label: 'Sibling' },
              { value: 'relative', label: 'Relative' },
              { value: 'friend', label: 'Friend' }
            ]
          }
        ]
      },
      {
        id: 'location',
        title: 'Location',
        fields: [
          {
            name: 'zone',
            label: 'Zone/Subcity',
            type: 'select',
            required: true,
            options: [
              { value: 'addis_ababa', label: 'Addis Ababa' },
              { value: 'bole', label: 'Bole' },
              { value: 'kirkos', label: 'Kirkos' },
              { value: 'arada', label: 'Arada' },
              { value: 'gulele', label: 'Gulele' },
              { value: 'yeka', label: 'Yeka' },
              { value: 'nifas_silk', label: 'Nifas Silk-Lafto' },
              { value: 'kolfe', label: 'Kolfe Keranio' },
              { value: 'lideta', label: 'Lideta' },
              { value: 'akaki_kality', label: 'Akaki Kality' }
            ]
          },
          {
            name: 'woreda',
            label: 'Woreda',
            type: 'text',
            required: false,
            placeholder: 'Woreda (optional)'
          }
        ]
      },
      {
        id: 'work',
        title: 'Work Information',
        fields: [
          {
            name: 'workerType',
            label: 'Worker Type',
            type: 'select',
            required: true,
            options: [
              { value: 'maid', label: 'Maid/Housekeeper' },
              { value: 'guard', label: 'Security Guard' },
              { value: 'nanny', label: 'Nanny/Childcare' },
              { value: 'cook', label: 'Cook' },
              { value: 'driver', label: 'Driver' },
              { value: 'cleaner', label: 'Cleaner' }
            ]
          },
          {
            name: 'educationLevel',
            label: 'Education Level',
            type: 'select',
            required: true,
            options: [
              { value: 'none', label: 'No formal education' },
              { value: 'basic_literacy', label: 'Basic literacy' },
              { value: 'primary', label: 'Primary school' },
              { value: 'some_secondary', label: 'Some secondary school' },
              { value: 'secondary', label: 'Secondary school complete' },
              { value: 'certificate', label: 'Certificate/Diploma' },
              { value: 'university', label: 'University degree' }
            ]
          },
          {
            name: 'yearsExperience',
            label: 'Years of Experience',
            type: 'number',
            required: true,
            min: 0,
            max: 50,
            placeholder: '0'
          },
          {
            name: 'languages',
            label: 'Languages Spoken',
            type: 'multiselect',
            required: true,
            options: [
              { value: 'amharic', label: 'Amharic' },
              { value: 'oromo', label: 'Oromo' },
              { value: 'english', label: 'English' },
              { value: 'tigre', label: 'Tigrinya' },
              { value: 'somali', label: 'Somali' }
            ]
          },
          {
            name: 'skills',
            label: 'Special Skills',
            type: 'multiselect',
            required: false,
            options: [
              { value: 'cooking_ethiopian', label: 'Cooking Ethiopian food' },
              { value: 'cooking_international', label: 'Cooking international food' },
              { value: 'childcare_infants', label: 'Childcare (infants 0-2)' },
              { value: 'childcare_toddlers', label: 'Childcare (toddlers 3-5)' },
              { value: 'elderly_care', label: 'Elderly care' },
              { value: 'driving_license', label: 'Valid driving license' },
              { value: 'first_aid', label: 'First aid certified' },
              { value: 'cleaning_deep', label: 'Deep cleaning' }
            ]
          },
          {
            name: 'availability',
            label: 'Availability',
            type: 'select',
            required: true,
            options: [
              { value: 'full_time', label: 'Full-time' },
              { value: 'part_time', label: 'Part-time' },
              { value: 'live_in', label: 'Live-in' },
              { value: 'live_out', label: 'Live-out' }
            ]
          },
          {
            name: 'salaryExpectationMin',
            label: 'Minimum Salary Expectation (ETB)',
            type: 'number',
            required: true,
            min: 1000,
            placeholder: '3000'
          },
          {
            name: 'salaryExpectationMax',
            label: 'Maximum Salary Expectation (ETB)',
            type: 'number',
            required: true,
            min: 1000,
            placeholder: '5000'
          }
        ]
      },
      {
        id: 'experience',
        title: 'Previous Work Experience',
        description: 'Provide at least one previous employer for reference checks',
        fields: [
          {
            name: 'previousEmployers',
            label: 'Previous Employers',
            type: 'repeatable',
            minItems: 1,
            maxItems: 5,
            fields: [
              {
                name: 'employerName',
                label: 'Employer Name',
                type: 'text',
                required: true
              },
              {
                name: 'employerPhone',
                label: 'Employer Phone',
                type: 'tel',
                required: true,
                validation: { pattern: '^\\+251[0-9]{9}$' }
              },
              {
                name: 'yearsWorked',
                label: 'Years Worked',
                type: 'number',
                required: true,
                min: 0
              },
              {
                name: 'relationship',
                label: 'Your Relationship',
                type: 'text',
                required: true,
                placeholder: 'e.g., "Maid", "Nanny", "Driver"'
              }
            ]
          }
        ]
      }
    ],
    payment: {
      required: true,
      amount: pricing.registration.worker.amount,
      currency: pricing.registration.worker.currency,
      description: pricing.registration.worker.description,
      methods: Object.keys(pricing.paymentMethods).filter(key => pricing.paymentMethods[key].enabled)
    },
    submit: {
      label: 'Submit Registration',
      successMessage: 'Registration submitted! Please pay the registration fee to activate your account.',
      redirect: '/worker/verification'
    }
  },

  // Employer Registration Form
  employerRegistration: {
    id: 'employer-registration',
    title: 'Employer Registration',
    description: 'Find verified domestic workers for your household',
    sections: [
      {
        id: 'personal',
        title: 'Personal Information',
        fields: [
          {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: true,
            placeholder: '+251XXXXXXXXX',
            validation: { pattern: '^\\+251[0-9]{9}$' }
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: false,
            placeholder: 'your@email.com'
          }
        ]
      },
      {
        id: 'location',
        title: 'Location',
        fields: [
          {
            name: 'zone',
            label: 'Zone/Subcity',
            type: 'select',
            required: true,
            options: [
              { value: 'addis_ababa', label: 'Addis Ababa' },
              { value: 'bole', label: 'Bole' },
              { value: 'kirkos', label: 'Kirkos' },
              { value: 'arada', label: 'Arada' },
              { value: 'gulele', label: 'Gulele' },
              { value: 'yeka', label: 'Yeka' },
              { value: 'nifas_silk', label: 'Nifas Silk-Lafto' },
              { value: 'kolfe', label: 'Kolfe Keranio' },
              { value: 'lideta', label: 'Lideta' },
              { value: 'akaki_kality', label: 'Akaki Kality' }
            ]
          },
          {
            name: 'woreda',
            label: 'Woreda',
            type: 'text',
            required: false,
            placeholder: 'Woreda (optional)'
          }
        ]
      },
      {
        id: 'household',
        title: 'Household Composition',
        fields: [
          {
            name: 'householdSize',
            label: 'Total People in Household',
            type: 'number',
            required: true,
            min: 1,
            max: 20,
            placeholder: '4'
          },
          {
            name: 'childrenUnder5',
            label: 'Children Under 5 Years',
            type: 'number',
            required: true,
            min: 0,
            max: 10,
            placeholder: '1'
          },
          {
            name: 'children5to12',
            label: 'Children 5-12 Years',
            type: 'number',
            required: true,
            min: 0,
            max: 10,
            placeholder: '2'
          },
          {
            name: 'elderlyMembers',
            label: 'Elderly Members (65+)',
            type: 'number',
            required: true,
            min: 0,
            max: 10,
            placeholder: '0'
          },
          {
            name: 'hasSpecialNeeds',
            label: 'Any Special Needs Members?',
            type: 'checkbox',
            required: false
          },
          {
            name: 'specialNotes',
            label: 'Special Requirements or Notes',
            type: 'textarea',
            required: false,
            placeholder: 'Any special requirements for the worker...',
            rows: 3
          }
        ]
      }
    ],
    payment: {
      required: true,
      amount: pricing.registration.employer.amount,
      currency: pricing.registration.employer.currency,
      description: pricing.registration.employer.description,
      methods: Object.keys(pricing.paymentMethods).filter(key => pricing.paymentMethods[key].enabled)
    },
    submit: {
      label: 'Submit Registration',
      successMessage: 'Registration submitted! Please pay the registration fee to activate your account.',
      redirect: '/employer/dashboard'
    }
  },

  // Job Posting Form
  jobPosting: {
    id: 'job-posting',
    title: 'Post a Job',
    description: 'Tell us what kind of worker you need',
    sections: [
      {
        id: 'jobDetails',
        title: 'Job Details',
        fields: [
          {
            name: 'workerType',
            label: 'Worker Type Needed',
            type: 'select',
            required: true,
            options: [
              { value: 'maid', label: 'Maid/Housekeeper' },
              { value: 'guard', label: 'Security Guard' },
              { value: 'nanny', label: 'Nanny/Childcare' },
              { value: 'cook', label: 'Cook' },
              { value: 'driver', label: 'Driver' },
              { value: 'cleaner', label: 'Cleaner' }
            ]
          },
          {
            name: 'schedule',
            label: 'Schedule',
            type: 'select',
            required: true,
            options: [
              { value: 'full_time', label: 'Full-time' },
              { value: 'part_time', label: 'Part-time' }
            ]
          },
          {
            name: 'housing',
            label: 'Housing',
            type: 'select',
            required: true,
            options: [
              { value: 'live_in', label: 'Live-in' },
              { value: 'live_out', label: 'Live-out' }
            ]
          },
          {
            name: 'salaryRange',
            label: 'Salary Range',
            type: 'select',
            required: true,
            options: pricing.salaryRanges
          },
          {
            name: 'workingHours',
            label: 'Working Hours',
            type: 'select',
            required: true,
            options: [
              { value: 'morning', label: 'Morning (6 AM - 2 PM)' },
              { value: 'afternoon', label: 'Afternoon (2 PM - 10 PM)' },
              { value: 'night', label: 'Night (10 PM - 6 AM)' },
              { value: 'flexible', label: 'Flexible' }
            ]
          }
        ]
      },
      {
        id: 'requirements',
        title: 'Requirements',
        fields: [
          {
            name: 'preferredGender',
            label: 'Preferred Gender',
            type: 'select',
            required: true,
            options: [
              { value: 'any', label: 'Any' },
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' }
            ]
          },
          {
            name: 'minExperience',
            label: 'Minimum Experience',
            type: 'select',
            required: true,
            options: [
              { value: '0', label: 'Any experience level' },
              { value: '1', label: '1+ years' },
              { value: '3', label: '3+ years' },
              { value: '5', label: '5+ years' }
            ]
          },
          {
            name: 'minEducation',
            label: 'Minimum Education',
            type: 'select',
            required: false,
            options: [
              { value: '', label: 'No requirement' },
              { value: 'basic_literacy', label: 'Basic literacy' },
              { value: 'primary', label: 'Primary school' },
              { value: 'secondary', label: 'Secondary school' }
            ]
          },
          {
            name: 'requiredSkills',
            label: 'Required Skills',
            type: 'multiselect',
            required: false,
            options: [
              { value: 'cooking_ethiopian', label: 'Cooking Ethiopian food' },
              { value: 'cooking_international', label: 'Cooking international food' },
              { value: 'childcare_infants', label: 'Childcare (infants)' },
              { value: 'childcare_toddlers', label: 'Childcare (toddlers)' },
              { value: 'elderly_care', label: 'Elderly care' },
              { value: 'driving_license', label: 'Valid driving license' },
              { value: 'first_aid', label: 'First aid certified' }
            ]
          }
        ]
      },
      {
        id: 'premium',
        title: 'Premium Features',
        fields: [
          {
            name: 'isUrgent',
            label: 'Mark as Urgent',
            type: 'checkbox',
            required: false,
            helpText: `Pay ${pricing.urgentHire.amount} ${pricing.urgentHire.currency} to boost your job to the top for 48 hours`
          }
        ]
      }
    ],
    submit: {
      label: 'Post Job',
      successMessage: 'Job posted successfully! Workers will start applying soon.',
      redirect: '/employer/my-jobs'
    }
  },

  // Verification Document Upload Form
  verificationUpload: {
    id: 'verification-upload',
    title: 'Upload Verification Documents',
    description: 'Upload required documents for verification',
    sections: [
      {
        id: 'documents',
        title: 'Required Documents',
        fields: [
          {
            name: 'policeClearance',
            label: 'Police Clearance Certificate',
            type: 'file',
            required: true,
            accept: 'image/*,application/pdf',
            helpText: 'Upload a clear photo or PDF of your police clearance'
          },
          {
            name: 'healthCertificate',
            label: 'Health Certificate',
            type: 'file',
            required: true,
            accept: 'image/*,application/pdf',
            helpText: 'Upload your health certificate with expiry date visible'
          },
          {
            name: 'healthCertificateExpiry',
            label: 'Health Certificate Expiry Date',
            type: 'date',
            required: true
          },
          {
            name: 'idDocument',
            label: 'ID Document',
            type: 'file',
            required: true,
            accept: 'image/*,application/pdf',
            helpText: 'Upload passport, kebele ID, or driver license'
          },
          {
            name: 'idDocumentType',
            label: 'ID Document Type',
            type: 'select',
            required: true,
            options: [
              { value: 'passport', label: 'Passport' },
              { value: 'kebele_id', label: 'Kebele ID' },
              { value: 'drivers_license', label: "Driver's License" }
            ]
          },
          {
            name: 'idDocumentNumber',
            label: 'ID Document Number',
            type: 'text',
            required: true,
            placeholder: 'Enter ID number'
          }
        ]
      }
    ],
    submit: {
      label: 'Submit Documents',
      successMessage: 'Documents submitted! Admin will review and verify your account.',
      redirect: '/worker/verification-status'
    }
  },

  // Worker Profile Edit Form
  workerEditProfile: {
    id: 'worker-edit-profile',
    title: 'Edit Profile',
    description: 'Update your profile information',
    sections: [
      {
        id: 'personal',
        title: 'Personal Information',
        fields: [
          {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true
          },
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: true
          },
          {
            name: 'photo',
            label: 'Photo',
            type: 'file',
            required: false,
            accept: 'image/*'
          }
        ]
      },
      {
        id: 'work',
        title: 'Work Information',
        fields: [
          {
            name: 'workerType',
            label: 'Worker Type',
            type: 'select',
            required: true,
            options: [
              { value: 'maid', label: 'Maid/Housekeeper' },
              { value: 'guard', label: 'Security Guard' },
              { value: 'nanny', label: 'Nanny/Childcare' },
              { value: 'cook', label: 'Cook' },
              { value: 'driver', label: 'Driver' },
              { value: 'cleaner', label: 'Cleaner' }
            ]
          },
          {
            name: 'availability',
            label: 'Availability',
            type: 'select',
            required: true,
            options: [
              { value: 'full_time', label: 'Full-time' },
              { value: 'part_time', label: 'Part-time' },
              { value: 'live_in', label: 'Live-in' },
              { value: 'live_out', label: 'Live-out' }
            ]
          },
          {
            name: 'salaryExpectationMin',
            label: 'Minimum Salary Expectation (ETB)',
            type: 'number',
            required: true
          },
          {
            name: 'salaryExpectationMax',
            label: 'Maximum Salary Expectation (ETB)',
            type: 'number',
            required: true
          }
        ]
      }
    ],
    submit: {
      label: 'Save Changes',
      successMessage: 'Profile updated successfully!',
      redirect: '/worker/profile'
    }
  }
};