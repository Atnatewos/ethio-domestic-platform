// File path: /server/controllers/verification.controller.js
// Purpose: Verification request handlers - manages the admin verification workflow.

const verificationService = require('../services/verification.service');

/**
 * Get verification queue
 */
const getVerificationQueue = async (req, res) => {
  try {
    const result = await verificationService.getVerificationQueue(req.query);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get verification queue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification queue'
    });
  }
};

/**
 * Get worker verification details
 */
const getWorkerVerificationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await verificationService.getWorkerVerificationDetails(id);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get worker details error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Worker not found'
    });
  }
};

/**
 * Log a verification check
 */
const logVerificationCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const result = await verificationService.logVerificationCheck(id, adminId, req.body);

    res.json({
      success: true,
      message: 'Verification check logged',
      data: result
    });
  } catch (error) {
    console.error('Log verification check error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to log verification check'
    });
  }
};

/**
 * Approve worker verification
 */
const approveVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const result = await verificationService.approveVerification(id, adminId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to approve verification'
    });
  }
};

/**
 * Reject worker verification
 */
const rejectVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const { reason } = req.body;
    const result = await verificationService.rejectVerification(id, adminId, reason);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reject verification'
    });
  }
};

/**
 * Get public worker directory
 */
const getWorkerDirectory = async (req, res) => {
  try {
    const result = await verificationService.getWorkerDirectory(req.query);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get worker directory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch worker directory'
    });
  }
};

/**
 * Get worker public profile
 */
const getWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await verificationService.getWorkerProfile(id);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get worker profile error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Worker not found'
    });
  }
};

module.exports = {
  getVerificationQueue,
  getWorkerVerificationDetails,
  logVerificationCheck,
  approveVerification,
  rejectVerification,
  getWorkerDirectory,
  getWorkerProfile
};