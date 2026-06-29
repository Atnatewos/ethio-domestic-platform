// File path: /server/routes/payment.routes.js
// Purpose: API routes for payment management.
// Security: All routes require admin authentication.

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const Joi = require('joi');

// All payment routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Validation schema for recording payment
const recordPaymentSchema = Joi.object({
  payerType: Joi.string().valid('worker', 'employer').required(),
  payerId: Joi.string().uuid().required(),
  paymentType: Joi.string().valid('registration', 'commission', 'urgent_hire', 'office_service', 'collateral').required(),
  amount: Joi.number().integer().positive().required(),
  method: Joi.string().valid('telebirr', 'bank_transfer', 'cash', 'office_cash').required(),
  transactionRef: Joi.string().optional().allow(''),
  receiptUrl: Joi.string().uri().optional().allow('')
});

router.post(
  '/',
  validate(recordPaymentSchema),
  paymentController.recordPayment
);

router.get('/', paymentController.getPayments);
router.get('/stats', paymentController.getPaymentStats);

module.exports = router;