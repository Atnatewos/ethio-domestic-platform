// File path: /server/routes/verification.routes.js
// Purpose: API routes for verification workflow and worker directory.
// Security: Admin routes require authentication and admin role.

const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verification.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const Joi = require('joi');

// Validation schema for logging verification checks
const logCheckSchema = Joi.object({
  checkType: Joi.string().valid('police_clearance', 'health_cert', 'id_document', 'reference_check').required(),
  referencePhone: Joi.string().pattern(/^\+251[0-9]{9}$/).optional().allow(''),
  result: Joi.string().valid('passed', 'failed', 'unable_to_verify').required(),
  notes: Joi.string().optional().allow('')
});

// Public routes (no auth required)
router.get('/directory', verificationController.getWorkerDirectory);
router.get('/profile/:id', verificationController.getWorkerProfile);

// Admin routes (require authentication and admin role)
router.get(
  '/queue',
  authenticate,
  requireAdmin,
  verificationController.getVerificationQueue
);

router.get(
  '/worker/:id',
  authenticate,
  requireAdmin,
  verificationController.getWorkerVerificationDetails
);

router.post(
  '/worker/:id/log',
  authenticate,
  requireAdmin,
  validate(logCheckSchema),
  verificationController.logVerificationCheck
);

router.post(
  '/worker/:id/approve',
  authenticate,
  requireAdmin,
  verificationController.approveVerification
);

router.post(
  '/worker/:id/reject',
  authenticate,
  requireAdmin,
  verificationController.rejectVerification
);

module.exports = router;