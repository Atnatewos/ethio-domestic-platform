// File path: /client/src/services/job.service.js
// Purpose: Frontend API client methods for job-related operations.

import api from './api';

/**
 * Create a new job posting
 */
export const createJob = async (jobData) => {
  const response = await api.post('/api/jobs', jobData);
  return response;
};

/**
 * Fetch available jobs (for workers)
 */
export const getJobs = async (params = {}) => {
  const response = await api.get('/api/jobs', { params });
  return response;
};

/**
 * Fetch jobs posted by the current employer
 */
export const getMyJobs = async (params = {}) => {
  const response = await api.get('/api/jobs/my-jobs', { params });
  return response;
};

/**
 * Fetch detailed information about a specific job
 */
export const getJobDetails = async (jobId) => {
  const response = await api.get(`/api/jobs/${jobId}`);
  return response;
};