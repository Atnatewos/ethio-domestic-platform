// File path: /server/controllers/job.controller.js
// Purpose: Job request handlers - validates input and delegates to the job service.

const jobService = require('../services/job.service');
const { query } = require('../lib/db');

/**
 * Create a new job posting
 */
const createJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const result = await jobService.createJob(employerId, req.body);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: result
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to post job'
    });
  }
};

/**
 * Get public/worker view of available jobs
 */
const getJobs = async (req, res) => {
  try {
    const result = await jobService.getJobs(req.query);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
};

/**
 * Get jobs posted by the authenticated employer
 */
const getMyJobs = async (req, res) => {
  try {
    const employerId = req.user.id;
    const result = await jobService.getEmployerJobs(employerId, req.query);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs'
    });
  }
};

/**
 * Get detailed information about a specific job
 */
const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT 
        j.*, 
        e.full_name as "employerName", e.phone as "employerPhone", 
        e.zone as "employerZone", e.household_size as "householdSize"
       FROM jobs j
       JOIN employers e ON j.employer_id = e.id
       WHERE j.id = $1 AND j.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get job details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job details'
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getMyJobs,
  getJobDetails
};