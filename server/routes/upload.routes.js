// File path: /server/routes/upload.routes.js
// Purpose: API routes for file uploads.
// Security: Protected by authentication middleware.

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

// All upload routes require authentication
router.use(authenticate);

// Upload a single file
router.post(
  '/single',
  uploadMiddleware.single('file'),
  uploadController.uploadSingleFile
);

// Upload multiple files
router.post(
  '/multiple',
  uploadMiddleware.array('files', 5), // Max 5 files per request
  uploadController.uploadMultipleFiles
);

module.exports = router;