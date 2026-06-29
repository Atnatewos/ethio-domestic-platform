// File path: /server/controllers/upload.controller.js
// Purpose: Handles file upload requests and streams them to Cloudinary.
// Security: Validates folder paths to prevent directory traversal attacks.

const cloudinary = require('../lib/cloudinary');

// Define allowed upload folders to prevent path traversal
const ALLOWED_FOLDERS = {
  'worker-photo': 'ethiodomestic/workers/profile-photos',
  'employer-photo': 'ethiodomestic/employers/profile-photos',
  'police-clearance': 'ethiodomestic/workers/police-clearance',
  'health-cert': 'ethiodomestic/workers/health-certificates',
  'id-document': 'ethiodomestic/workers/id-documents',
  'payment-receipt': 'ethiodomestic/payments/receipts'
};

/**
 * Upload a single file to Cloudinary
 */
const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const folderType = req.body.folder || 'worker-photo';
    const folderPath = ALLOWED_FOLDERS[folderType];

    if (!folderPath) {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload folder type'
      });
    }

    // Upload stream to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folderPath,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
};

/**
 * Upload multiple files to Cloudinary
 */
const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    const folderType = req.body.folder || 'verification-doc';
    const folderPath = ALLOWED_FOLDERS[folderType];

    if (!folderPath) {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload folder type'
      });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderPath,
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    const uploadedFiles = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    }));

    res.json({
      success: true,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles
};