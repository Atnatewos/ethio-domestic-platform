// File path: /client/src/services/upload.service.js
// Purpose: Frontend service for handling file uploads to the backend.

import api from './api';

/**
 * Upload a single file
 * @param {File} file - The file object to upload
 * @param {string} folder - The target folder type (e.g., 'worker-photo')
 * @returns {Promise<Object>} - The uploaded file data
 */
export const uploadFile = async (file, folder = 'worker-photo') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await api.post('/api/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

/**
 * Upload multiple files
 * @param {FileList|File[]} files - The files to upload
 * @param {string} folder - The target folder type
 * @returns {Promise<Object[]>} - Array of uploaded file data
 */
export const uploadFiles = async (files, folder = 'verification-doc') => {
  const formData = new FormData();
  
  Array.from(files).forEach(file => {
    formData.append('files', file);
  });
  
  formData.append('folder', folder);

  const response = await api.post('/api/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};