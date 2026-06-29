// File path: /server/controllers/application.controller.js
// Purpose: Application request handlers - manages the hiring workflow.

const applicationService = require('../services/application.service');

/**
 * Worker applies to a job
 */
const applyToJob = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { jobId } = req.params;
    
    const result = await applicationService.applyToJob(workerId, jobId);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to apply'
    });
  }
};

/**
 * Get all applications for the authenticated worker
 */
const getMyApplications = async (req, res) => {
  try {
    const workerId = req.user.id;
    const result = await applicationService.getWorkerApplications(workerId, req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

/**
 * Get all applicants for a specific job (employer view)
 */
const getJobApplicants = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { jobId } = req.params;
    
    const result = await applicationService.getJobApplicants(employerId, jobId, req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch applicants'
    });
  }
};

/**
 * Update application status (shortlist, interview, hire, reject)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const result = await applicationService.updateApplicationStatus(employerId, applicationId, status);
    
    res.json({
      success: true,
      message: 'Application status updated',
      data: result
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update status'
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
};