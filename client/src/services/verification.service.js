// File path: /client/src/services/verification.service.js
// Purpose: Frontend API client for verification and worker directory operations.

import api from './api';

/**
 * Get verification queue (admin)
 */
export const getVerificationQueue = async (params = {}) => {
  const response = await api.get('/api/verification/queue', { params });
  return response;
};

/**
 * Get worker verification details (admin)
 */
export const getWorkerVerificationDetails = async (workerId) => {
  const response = await api.get(`/api/verification/worker/${workerId}`);
  return response;
};

/**
 * Log a verification check (admin)
 */
export const logVerificationCheck = async (workerId, checkData) => {
  const response = await api.post(`/api/verification/worker/${workerId}/log`, checkData);
  return response;
};

/**
 * Approve worker verification (admin)
 */
export const approveVerification = async (workerId) => {
  const response = await api.post(`/api/verification/worker/${workerId}/approve`);
  return response;
};

/**
 * Reject worker verification (admin)
 */
export const rejectVerification = async (workerId, reason) => {
  const response = await api.post(`/api/verification/worker/${workerId}/reject`, { reason });
  return response;
};

/**
 * Get public worker directory
 */
export const getWorkerDirectory = async (params = {}) => {
  const response = await api.get('/api/verification/directory', { params });
  return response;
};

/**
 * Get worker public profile
 */
export const getWorkerProfile = async (workerId) => {
  const response = await api.get(`/api/verification/profile/${workerId}`);
  return response;
};