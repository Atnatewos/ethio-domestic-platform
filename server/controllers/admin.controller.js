// File path: /server/controllers/admin.controller.js
// Purpose: Admin request handlers
// Architecture: Validates input and delegates to admin service

const adminService = require('../services/admin.service');

/**
 * Get pending approvals
 */
const getPendingApprovals = async (req, res) => {
  try {
    const result = await adminService.getPendingApprovals();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals'
    });
  }
};

/**
 * Approve user registration
 */
const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.body;
    const adminId = req.user.id;

    if (!userType || !['worker', 'employer'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    const result = await adminService.approveUser(id, userType, adminId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to approve user'
    });
  }
};

/**
 * Reject user registration
 */
const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType, reason } = req.body;
    const adminId = req.user.id;

    if (!userType || !['worker', 'employer'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const result = await adminService.rejectUser(id, userType, reason, adminId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reject user'
    });
  }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

/**
 * Get all workers (admin view)
 */
const getAllWorkers = async (req, res) => {
  try {
    const result = await adminService.getAllWorkers(req.query);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get all workers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workers'
    });
  }
};

/**
 * Get all employers (admin view)
 */
const getAllEmployers = async (req, res) => {
  try {
    const result = await adminService.getAllEmployers(req.query);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get all employers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employers'
    });
  }
};

module.exports = {
  getPendingApprovals,
  approveUser,
  rejectUser,
  getDashboardStats,
  getAllWorkers,
  getAllEmployers
};