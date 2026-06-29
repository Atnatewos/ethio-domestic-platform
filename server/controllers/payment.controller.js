// File path: /server/controllers/payment.controller.js
// Purpose: Payment request handlers - recording and viewing payments.

const paymentService = require('../services/payment.service');

/**
 * Record a payment (admin only)
 */
const recordPayment = async (req, res) => {
  try {
    const adminId = req.user.id;
    const result = await paymentService.recordPayment(req.body, adminId);

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: result
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to record payment'
    });
  }
};

/**
 * Get all payments (admin only)
 */
const getPayments = async (req, res) => {
  try {
    const result = await paymentService.getPayments(req.query);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
};

/**
 * Get payment statistics (admin only)
 */
const getPaymentStats = async (req, res) => {
  try {
    const stats = await paymentService.getPaymentStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics'
    });
  }
};

module.exports = {
  recordPayment,
  getPayments,
  getPaymentStats
};