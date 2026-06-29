// File path: /client/src/services/payment.service.js
// Purpose: Frontend API client for payment operations.

import api from './api';

/**
 * Record a payment (admin)
 */
export const recordPayment = async (paymentData) => {
  const response = await api.post('/api/payments', paymentData);
  return response;
};

/**
 * Get all payments (admin)
 */
export const getPayments = async (params = {}) => {
  const response = await api.get('/api/payments', { params });
  return response;
};

/**
 * Get payment statistics (admin)
 */
export const getPaymentStats = async () => {
  const response = await api.get('/api/payments/stats');
  return response;
};