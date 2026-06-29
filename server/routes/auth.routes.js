// File path: /server/routes/auth.routes.js
// Purpose: Auth API routes - register, login, refresh, current user

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate, workerRegistrationSchema, employerRegistrationSchema, loginSchema } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register/worker', validate(workerRegistrationSchema), authController.registerWorker);
router.post('/register/employer', validate(employerRegistrationSchema), authController.registerEmployer);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;