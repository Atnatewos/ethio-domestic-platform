// File path: /server/app.js
// Purpose: Express app setup with middleware and routes

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const configService = require('./lib/configService');
const routes = require('./routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'EthioDomestic API is running',
    timestamp: new Date().toISOString()
  });
});

// Config API
app.get('/api/config', async (req, res) => {
  try {
    if (!configService.isInitialized) {
      await configService.init();
    }
    
    res.json({
      success: true,
      data: configService.getPublicConfig()
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load configuration'
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    data: {
      platform: configService.get('platform.name'),
      workerFee: configService.get('pricing.registration.worker.amount'),
      timestamp: new Date().toISOString()
    }
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = app;