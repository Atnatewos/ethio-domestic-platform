// File path: /server/routes/index.js
// Purpose: Aggregates and mounts all API route modules.

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');
const uploadRoutes = require('./upload.routes');
const jobRoutes = require('./job.routes');
const applicationRoutes = require('./application.routes');
const verificationRoutes = require('./verification.routes');
const paymentRoutes = require('./payment.routes');
const settingsRoutes = require('./settings.routes');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/upload', uploadRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/verification', verificationRoutes);
router.use('/payments', paymentRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;