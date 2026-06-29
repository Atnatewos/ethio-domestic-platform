// File path: /client/src/services/api.js
// Purpose: Centralized API client with auth methods

import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || 'null');
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service methods
export const apiService = {
  // Generic HTTP methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // Config
  getConfig: () => api.get('/api/config'),
  
  // Auth
  login: (credentials) => api.post('/api/auth/login', credentials),
  registerWorker: (data) => api.post('/api/auth/register/worker', data),
  registerEmployer: (data) => api.post('/api/auth/register/employer', data),
  getCurrentUser: () => api.get('/api/auth/me'),
  refreshToken: (refreshToken) => api.post('/api/auth/refresh-token', { refreshToken }),
  
  // Workers
  getWorkers: (params) => api.get('/api/workers', { params }),
  getWorker: (id) => api.get(`/api/workers/${id}`),
  
  // Employers
  getEmployers: (params) => api.get('/api/employers', { params }),
  getEmployer: (id) => api.get(`/api/employers/${id}`),
  
  // Jobs
  getJobs: (params) => api.get('/api/jobs', { params }),
  getJob: (id) => api.get(`/api/jobs/${id}`),
  createJob: (data) => api.post('/api/jobs', data),
  
  // Applications
  getApplications: (params) => api.get('/api/applications', { params }),
  applyToJob: (jobId) => api.post(`/api/applications/apply/${jobId}`),
  
  // Payments
  getPayments: (params) => api.get('/api/payments', { params }),
  createPayment: (data) => api.post('/api/payments', data),
  
  // Uploads
  uploadFile: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Admin
  getAdminStats: () => api.get('/api/admin/stats'),
  approveRegistration: (id, data) => api.post(`/api/admin/approvals/${id}/approve`, data),
  rejectRegistration: (id, data) => api.post(`/api/admin/approvals/${id}/reject`, data)
};

export default api;