// File path: /server/routes/job.routes.js
// Purpose: API routes for job management.
// Security: Enforces role-based access control for creation and management.

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticate } = require('../middleware/auth');
const { requireEmployer } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const Joi = require('joi');

// Validation schema for job creation
const createJobSchema = Joi.object({
  workerType: Joi.string().valid('maid', 'guard', 'nanny', 'cook', 'driver', 'cleaner').required(),
  schedule: Joi.string().valid('full_time', 'part_time').required(),
  housing: Joi.string().valid('live_in', 'live_out').required(),
  salaryRange: Joi.string().required(),
  workingHours: Joi.string().valid('morning', 'afternoon', 'night', 'flexible').required(),
  preferredGender: Joi.string().valid('any', 'female', 'male').required(),
  minExperience: Joi.string().valid('0', '1', '3', '5').required(),
  minEducation: Joi.string().valid('', 'basic_literacy', 'primary', 'secondary').optional().allow(''),
  requiredSkills: Joi.array().items(Joi.string()).optional(),
  isUrgent: Joi.boolean().optional().default(false)
});

// Public/Worker accessible routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobDetails);

// Employer protected routes
router.post(
  '/', 
  authenticate, 
  requireEmployer, 
  validate(createJobSchema), 
  jobController.createJob
);

router.get(
  '/my-jobs', 
  authenticate, 
  requireEmployer, 
  jobController.getMyJobs
);

module.exports = router;