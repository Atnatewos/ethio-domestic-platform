// File path: /server/services/payment.service.js
// Purpose: Payment business logic - recording and tracking payments.
// Architecture: Config-driven pricing with audit trail.

const { query, getClient } = require('../lib/db');
const configService = require('../lib/configService');
const notificationService = require('./notification.service');

class PaymentService {
  /**
   * Record a payment (admin confirms payment)
   */
  async recordPayment(paymentData, adminId) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const { payerType, payerId, paymentType, amount, method, transactionRef, receiptUrl } = paymentData;

      // Insert payment record
      const result = await client.query(
        `INSERT INTO payments (
          payer_type, payer_id, payment_type, amount, method,
          transaction_reference, receipt_url, status, confirmed_at, confirmed_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', NOW(), $8)
        RETURNING id`,
        [payerType, payerId, paymentType, amount, method, transactionRef, receiptUrl, adminId]
      );

      const paymentId = result.rows[0].id;

      // If it's a registration payment, update user status
      if (paymentType === 'registration') {
        const table = payerType === 'worker' ? 'workers' : 'employers';
        await client.query(
          `UPDATE ${table} SET registration_status = 'approved', updated_at = NOW() WHERE id = $1`,
          [payerId]
        );

        // Notify user
        const userResult = await client.query(
          `SELECT full_name FROM ${table} WHERE id = $1`,
          [payerId]
        );

        if (userResult.rows.length > 0) {
          await notificationService.createNotification({
            userType: payerType,
            userId: payerId,
            type: 'payment_confirmed',
            title: 'Payment Confirmed',
            message: `Your registration payment of ${amount} ETB has been confirmed. Your account is now active.`
          });
        }
      }

      await client.query('COMMIT');

      return { success: true, paymentId };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all payments with filters
   */
  async getPayments(filters = {}) {
    const { paymentType, status, method, startDate, endDate, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (paymentType) {
      paramCount++;
      whereClause += ` AND payment_type = $${paramCount}`;
      params.push(paymentType);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (method) {
      paramCount++;
      whereClause += ` AND method = $${paramCount}`;
      params.push(method);
    }

    if (startDate) {
      paramCount++;
      whereClause += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      whereClause += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
    }

    const paymentsQuery = `
      SELECT 
        p.id,
        p.payer_type as "payerType",
        p.payer_id as "payerId",
        p.payment_type as "paymentType",
        p.amount,
        p.method,
        p.status,
        p.transaction_reference as "transactionRef",
        p.receipt_url as "receiptUrl",
        p.created_at as "createdAt",
        CASE 
          WHEN p.payer_type = 'worker' THEN (SELECT full_name FROM workers WHERE id = p.payer_id)
          WHEN p.payer_type = 'employer' THEN (SELECT full_name FROM employers WHERE id = p.payer_id)
          ELSE 'Unknown'
        END as "payerName"
      FROM payments p
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM payments p ${whereClause}
    `;

    const [paymentsResult, countResult] = await Promise.all([
      query(paymentsQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    return {
      items: paymentsResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats() {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_payments,
        COALESCE(SUM(amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'registration' THEN amount ELSE 0 END), 0) as registration_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'commission' THEN amount ELSE 0 END), 0) as commission_revenue,
        COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END), 0) as monthly_revenue
      FROM payments
      WHERE status = 'confirmed'
    `);

    return stats.rows[0];
  }
}

module.exports = new PaymentService();