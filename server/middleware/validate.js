// File path: /server/middleware/validate.js
// Purpose: Request validation middleware with better error messages

const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    console.log('🔍 Validating request body:', req.body);
    
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));
      
      console.error('❌ Validation errors:', errors);
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }
    
    // Update req.body with validated/sanitized data
    req.body = value;
    next();
  };
};

// Worker registration schema
const workerRegistrationSchema = Joi.object({
  phone: Joi.string().pattern(/^\+251[0-9]{9}$/).required().messages({
    'string.pattern.base': 'Phone must be in format +251XXXXXXXXX',
    'any.required': 'Phone is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  fullName: Joi.string().min(3).max(100).required(),
  age: Joi.number().integer().min(18).max(70).required(),
  gender: Joi.string().valid('female', 'male').required(),
  photoUrl: Joi.string().uri().optional().allow('', null),
  
  emergencyContactName: Joi.string().required(),
  emergencyContactPhone: Joi.string().pattern(/^\+251[0-9]{9}$/).required(),
  emergencyContactRelationship: Joi.string().required(),
  
  zone: Joi.string().required(),
  woreda: Joi.string().optional().allow('', null),
  
  workerType: Joi.string().valid('maid', 'guard', 'nanny', 'cook', 'driver', 'cleaner').required(),
  educationLevel: Joi.string().valid('none', 'basic_literacy', 'primary', 'some_secondary', 'secondary', 'certificate', 'university').required(),
  yearsExperience: Joi.number().integer().min(0).max(50).required(),
  languages: Joi.array().items(Joi.string()).min(1).required(),
  skills: Joi.array().items(Joi.string()).optional().default([]),
  availability: Joi.string().valid('full_time', 'part_time', 'live_in', 'live_out').required(),
  salaryExpectationMin: Joi.number().integer().min(1000).required(),
  salaryExpectationMax: Joi.number().integer().min(1000).required(),
  
  previousEmployers: Joi.array().items(
    Joi.object({
      employerName: Joi.string().required(),
      employerPhone: Joi.string().pattern(/^\+251[0-9]{9}$/).required(),
      yearsWorked: Joi.number().integer().min(0).required(),
      relationship: Joi.string().required()
    })
  ).min(1).required()
});

// Employer registration schema
const employerRegistrationSchema = Joi.object({
  phone: Joi.string().pattern(/^\+251[0-9]{9}$/).required(),
  email: Joi.string().email().optional().allow('', null),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(3).max(100).required(),
  
  zone: Joi.string().required(),
  woreda: Joi.string().optional().allow('', null),
  
  householdSize: Joi.number().integer().min(1).max(20).required(),
  childrenUnder5: Joi.number().integer().min(0).max(10).required(),
  children5to12: Joi.number().integer().min(0).max(10).required(),
  elderlyMembers: Joi.number().integer().min(0).max(10).required(),
  hasSpecialNeeds: Joi.boolean().optional().default(false),
  specialNotes: Joi.string().optional().allow('', null)
});

// Login schema
const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
  userType: Joi.string().valid('worker', 'employer', 'admin').default('worker')
});

module.exports = {
  validate,
  workerRegistrationSchema,
  employerRegistrationSchema,
  loginSchema
};