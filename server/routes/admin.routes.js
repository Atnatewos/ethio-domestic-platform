// File path: /server/routes/admin.routes.js
// Purpose: Admin API routes - approvals, verification, management, stats

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// Registration approvals
router.get('/approvals', adminController.getPendingApprovals);
router.post('/approvals/:id/approve', adminController.approveRegistration);
router.post('/approvals/:id/reject', adminController.rejectRegistration);

// Workers management
router.get('/workers', adminController.getAllWorkers);
router.get('/workers/:id', adminController.getWorkerDetails);
router.post('/workers/:id/suspend', adminController.suspendWorker);

// Future routes will be added here:
// router.get('/employers', adminController.getAllEmployers);
// router.get('/jobs', adminController.getAllJobs);
// router.get('/payments', adminController.getAllPayments);
// router.get('/reports', adminController.getAllReports);

module.exports = router;