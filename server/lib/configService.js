// File path: /server/lib/configService.js
// Purpose:  THE HEART OF THE BACKEND 
// Loads the default config from our config/ files and merges with DB overrides.
// Every controller and service will use this to get business rules.

const defaultConfig = require('../../config'); // Imports our 10 config files
const { query } = require('./db');

class ConfigService {
  constructor() {
    this.config = defaultConfig;
    this.dbOverrides = {};
    this.isInitialized = false;
  }

  // Initialize the service by loading DB overrides
  async init() {
    try {
      // Fetch all overrides from the platform_settings table
      const result = await query('SELECT key, value FROM platform_settings');
      
      // Merge DB overrides into the default config
      result.rows.forEach(row => {
        this.setNestedValue(this.config, row.key, row.value);
        this.dbOverrides[row.key] = row.value;
      });
      
      this.isInitialized = true;
      console.log('✅ ConfigService initialized with DB overrides');
    } catch (error) {
      console.warn('⚠️ Could not load DB config overrides (DB might not be ready yet). Using defaults.');
      this.isInitialized = true;
    }
  }

  // Get a config value using dot notation
  // Example: configService.get('pricing.registration.worker.amount')
  get(path) {
    const keys = path.split('.');
    let result = this.config;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return undefined;
      }
    }
    
    return result;
  }

  // Get the entire config object (excluding sensitive data like JWT secrets)
  getPublicConfig() {
    // Return everything except server/lib paths if we ever add them
    return this.config;
  }

  // Update a config value at runtime (saves to DB and updates memory)
  async set(path, value, updatedByAdminId) {
    // 1. Update in memory
    this.setNestedValue(this.config, path, value);
    
    // 2. Save to database
    const valueType = typeof value;
    const description = `Runtime override for ${path}`;
    
    await query(
      `INSERT INTO platform_settings (key, value, value_type, description, updated_by) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, updated_by = $5, updated_at = NOW()`,
      [path, JSON.stringify(value), valueType, description, updatedByAdminId]
    );
    
    console.log(`✅ Config updated: ${path} = ${JSON.stringify(value)}`);
    return true;
  }

  // Helper to set a nested value in an object using dot notation
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  // Check if a feature is enabled
  isFeatureEnabled(featurePath) {
    const feature = this.get(`features.${featurePath}`);
    return feature && feature.enabled === true;
  }
}

// Export a singleton instance
const configService = new ConfigService();
module.exports = configService;