// File path: /client/src/services/application.service.js
// Purpose: Frontend API client methods for application operations.

import api from './api';

export const applyToJob = async (jobId) => {
  const response = await api.post(`/api/applications/apply/${jobId}`);
  return response;
};

export const getMyApplications = async (params = {}) => {
  const response = await api.get('/api/applications/my-applications', { params });
  return response;
};

export const getJobApplicants = async (jobId, params = {}) => {
  const response = await api.get(`/api/applications/job/${jobId}/applicants`, { params });
  return response;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/api/applications/${applicationId}/status`, { status });
  return response;
};