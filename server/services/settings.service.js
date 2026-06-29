// File path: /client/src/services/settings.service.js
// Purpose: Frontend API client for platform settings operations.

import api from './api';

/**
 * Fetch all current platform settings
 */
export const getSettings = async () => {
  const response = await api.get('/api/settings');
  return response;
};

/**
 * Update a specific configuration key
 */
export const updateSetting = async (key, value) => {
  const response = await api.patch('/api/settings', { key, value });
  return response;
};