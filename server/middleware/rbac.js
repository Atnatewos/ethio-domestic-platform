// File path: /server/middleware/rbac.js
// Purpose: Role-Based Access Control middleware - checks if user has required role

// Check if user has specific role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = requireRole('super_admin', 'verification_admin', 'finance_admin', 'office_staff');

// Check if user is worker
const requireWorker = requireRole('worker');

// Check if user is employer
const requireEmployer = requireRole('employer');

// Check if user is worker OR employer (authenticated user)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

module.exports = {
  requireRole,
  requireAdmin,
  requireWorker,
  requireEmployer,
  requireAuth
};