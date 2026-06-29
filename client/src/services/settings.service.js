// File path: /client/src/services/settings.service.js
// Purpose: Frontend API client for platform settings operations.
// Architecture: Uses the centralized API client with authentication.

import api from './api';

/**
 * Fetch all current platform settings
 * @returns {Promise<Object>} - The complete platform configuration
 */
export const getSettings = async () => {
  const response = await api.get('/api/settings');
  return response;
};

/**
 * Update a specific configuration key at runtime
 * @param {string} key - The configuration key (e.g., 'pricing.registration.worker.amount')
 * @param {any} value - The new value for the configuration
 * @returns {Promise<Object>} - Success response
 */
export const updateSetting = async (key, value) => {
  const response = await api.patch('/api/settings', { key, value });
  return response;
};