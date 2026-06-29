// File path: /client/src/context/ConfigContext.jsx
// Purpose: Global config provider - fetches config from backend and makes it available to all components
// This is the heart of the config-driven frontend

import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch config from backend on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getConfig();
      
      if (response.success) {
        setConfig(response.data);
        console.log('✅ Config loaded successfully');
      } else {
        throw new Error('Failed to load config');
      }
    } catch (err) {
      console.error('❌ Failed to load config:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get nested config values using dot notation
  const get = (path) => {
    if (!config) return undefined;
    
    const keys = path.split('.');
    let result = config;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return undefined;
      }
    }
    
    return result;
  };

  // Helper to check if a feature is enabled
  const isFeatureEnabled = (featurePath) => {
    const feature = get(`features.${featurePath}`);
    return feature && feature.enabled === true;
  };

  // Helper to get form config by ID
  const getForm = (formId) => {
    return config?.forms?.[formId];
  };

  // Helper to get table config by ID
  const getTable = (tableId) => {
    return config?.tables?.[tableId];
  };

  // Helper to get dashboard config by ID
  const getDashboard = (dashboardId) => {
    return config?.dashboards?.[dashboardId];
  };

  const value = {
    config,
    loading,
    error,
    get,
    isFeatureEnabled,
    getForm,
    getTable,
    getDashboard,
    refresh: loadConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

// Custom hook to use config
export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

export default ConfigContext;