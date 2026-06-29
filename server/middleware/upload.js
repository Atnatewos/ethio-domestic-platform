// File path: /server/middleware/upload.js
// Purpose: Multer middleware configuration for handling file uploads.
// Security: Enforces file size limits and restricts allowed MIME types.

const multer = require('multer');

// Store files in memory to stream directly to Cloudinary
const storage = multer.memoryStorage();

// File filter to restrict uploads to images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.'), false);
  }
};

// Initialize multer with security constraints
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});

module.exports = upload;