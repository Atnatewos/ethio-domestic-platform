// File path: /server/lib/cloudinary.js
// Purpose: Cloudinary configuration and initialization.
// Architecture: Reads credentials strictly from environment variables.

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Ensure HTTPS URLs are returned
});

module.exports = cloudinary;