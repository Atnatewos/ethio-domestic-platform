// File path: /server/routes/admin.routes.js
// Purpose: Admin API routes
// Security: All routes require admin authentication

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Approvals
router.get('/approvals', adminController.getPendingApprovals);
router.post('/approvals/:id/approve', adminController.approveUser);
router.post('/approvals/:id/reject', adminController.rejectUser);

// Dashboard
router.get('/stats', adminController.getDashboardStats);

// Workers management
router.get('/workers', adminController.getAllWorkers);

// Employers management
router.get('/employers', adminController.getAllEmployers);

module.exports = router;