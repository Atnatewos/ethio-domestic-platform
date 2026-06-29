// File path: /server/routes/application.routes.js
// Purpose: API routes for application management.
// Security: Workers can apply, employers can manage applicants.

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate } = require('../middleware/auth');
const { requireWorker, requireEmployer } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const Joi = require('joi');

// Validation schema for status updates
const updateStatusSchema = Joi.object({
  status: Joi.string().valid('shortlisted', 'interviewed', 'trial', 'hired', 'rejected').required()
});

// Worker routes
router.post(
  '/apply/:jobId',
  authenticate,
  requireWorker,
  applicationController.applyToJob
);

router.get(
  '/my-applications',
  authenticate,
  requireWorker,
  applicationController.getMyApplications
);

// Employer routes
router.get(
  '/job/:jobId/applicants',
  authenticate,
  requireEmployer,
  applicationController.getJobApplicants
);

router.patch(
  '/:applicationId/status',
  authenticate,
  requireEmployer,
  validate(updateStatusSchema),
  applicationController.updateApplicationStatus
);

module.exports = router;