// File path: /server/controllers/settings.controller.js
// Purpose: Admin settings request handlers - manages runtime configuration overrides.
// Architecture: Reads from and writes to the platform_settings table via ConfigService.

const configService = require('../lib/configService');

/**
 * Get all current platform settings (merged defaults + DB overrides)
 */
const getSettings = async (req, res) => {
  try {
    const config = configService.getPublicConfig();
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform settings'
    });
  }
};

/**
 * Update a specific configuration value at runtime
 */
const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const adminId = req.user.id;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Key and value are required'
      });
    }

    await configService.set(key, value, adminId);

    res.json({
      success: true,
      message: `Setting '${key}' updated successfully`
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update setting'
    });
  }
};

module.exports = {
  getSettings,
  updateSetting
};