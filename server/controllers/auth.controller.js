// File path: /server/controllers/auth.controller.js
// Purpose: Auth request handlers - register, login, refresh token

const authService = require('../services/auth.service');

// Register Worker
const registerWorker = async (req, res) => {
  try {
    const result = await authService.registerWorker(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Worker registration submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('Worker registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// Register Employer
const registerEmployer = async (req, res) => {
  try {
    const result = await authService.registerEmployer(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Employer registration submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('Employer registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { phone, password, userType } = req.body;
    const result = await authService.login(phone, password, userType);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Token refreshed',
      data: result
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Token refresh failed'
    });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const { id, type } = req.user;
    
    let user;
    if (type === 'worker') {
      const result = await require('../lib/db').query(
        'SELECT id, phone, full_name, worker_type, trust_score, registration_status FROM workers WHERE id = $1',
        [id]
      );
      user = result.rows[0];
    } else if (type === 'employer') {
      const result = await require('../lib/db').query(
        'SELECT id, phone, full_name, registration_status FROM employers WHERE id = $1',
        [id]
      );
      user = result.rows[0];
    } else if (type === 'admin') {
      const result = await require('../lib/db').query(
        'SELECT id, email, full_name, role FROM admins WHERE id = $1',
        [id]
      );
      user = result.rows[0];
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};

module.exports = {
  registerWorker,
  registerEmployer,
  login,
  refreshToken,
  getCurrentUser
};