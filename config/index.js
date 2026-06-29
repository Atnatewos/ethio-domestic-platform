// File path: /config/index.js
// Purpose: Master config export - imports and combines all configuration files
// This is the single entry point for accessing all platform configuration

const platform = require('./platform');
const pricing = require('./pricing');
const forms = require('./forms');
const tables = require('./tables');
const dashboards = require('./dashboards');
const navigation = require('./navigation');
const workflows = require('./workflows');
const trustScore = require('./trustScore');
const features = require('./features');

// Combine all configs into a single object
const config = {
  platform,
  pricing,
  forms,
  tables,
  dashboards,
  navigation,
  workflows,
  trustScore,
  features
};

// Helper function to get nested config values using dot notation
// Example: config.get('pricing.registration.worker.amount') returns 200
config.get = function(path) {
  const keys = path.split('.');
  let result = this;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  
  return result;
};

// Helper function to check if a feature is enabled
// Example: config.isFeatureEnabled('mvp.workerRegistration')
config.isFeatureEnabled = function(featurePath) {
  const feature = this.get(`features.${featurePath}`);
  return feature && feature.enabled === true;
};

// Export the combined config object
module.exports = config;