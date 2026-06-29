// File path: /server/controllers/admin.controller.js
// Purpose: Admin request handlers - approvals, verification, stats, management

const adminService = require('../services/admin.service');

// Get pending approvals
const getPendingApprovals = async (req, res) => {
  try {
    const { userType, registrationSource, page, limit } = req.query;
    const result = await adminService.getPendingApprovals({
      userType,
      registrationSource,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approvals'
    });
  }
};

// Approve registration
const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType, notes } = req.body;
    const adminId = req.user.id;

    const result = await adminService.approveRegistration(id, userType, adminId, notes);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Approve registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to approve registration'
    });
  }
};

// Reject registration
const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType, reason } = req.body;
    const adminId = req.user.id;

    const result = await adminService.rejectRegistration(id, userType, adminId, reason);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Reject registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reject registration'
    });
  }
};

// Get dashboard stats
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
      message: 'Failed to fetch dashboard stats'
    });
  }
};

// Get all workers
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

// Get worker details
const getWorkerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await adminService.getWorkerDetails(id);

    res.json({
      success: true,
      data: worker
    });
  } catch (error) {
    console.error('Get worker details error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Worker not found'
    });
  }
};

// Suspend worker
const suspendWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const result = await adminService.suspendWorker(id, adminId, reason);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Suspend worker error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to suspend worker'
    });
  }
};

module.exports = {
  getPendingApprovals,
  approveRegistration,
  rejectRegistration,
  getDashboardStats,
  getAllWorkers,
  getWorkerDetails,
  suspendWorker
};