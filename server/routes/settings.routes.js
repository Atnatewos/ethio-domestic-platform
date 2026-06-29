// File path: /server/routes/settings.routes.js
// Purpose: API routes for platform settings management.
// Security: Strictly limited to super_admin role.

const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// All settings routes require super_admin authentication
router.use(authenticate);
router.use(requireRole('super_admin'));

router.get('/', settingsController.getSettings);
router.patch('/', settingsController.updateSetting);

module.exports = router;