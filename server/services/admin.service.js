// File path: /server/services/admin.service.js
// Purpose: Admin business logic - database operations for admin functions
// Architecture: Uses parameterized queries for security

const { query, getClient } = require('../lib/db');
const notificationService = require('./notification.service');

class AdminService {
  /**
   * Get pending registrations (workers and employers)
   */
  async getPendingApprovals() {
    const workersQuery = `
      SELECT 
        id, phone, full_name, photo_url, worker_type, zone,
        created_at, registration_status
      FROM workers
      WHERE registration_status = 'payment_pending'
      AND is_active = true
      ORDER BY created_at DESC
    `;

    const employersQuery = `
      SELECT 
        id, phone, email, full_name, zone,
        created_at, registration_status
      FROM employers
      WHERE registration_status = 'payment_pending'
      AND is_active = true
      ORDER BY created_at DESC
    `;

    const [workersResult, employersResult] = await Promise.all([
      query(workersQuery),
      query(employersQuery)
    ]);

    return {
      workers: workersResult.rows,
      employers: employersResult.rows
    };
  }

  /**
   * Approve a user registration
   */
  async approveUser(userId, userType, adminId) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const table = userType === 'worker' ? 'workers' : 'employers';

      // Update registration status
      await client.query(
        `UPDATE ${table} 
         SET registration_status = 'approved', 
             updated_at = NOW()
         WHERE id = $1`,
        [userId]
      );

      // Get user info for notification
      const userResult = await client.query(
        `SELECT full_name, phone FROM ${table} WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        
        // Create notification
        await notificationService.createNotification({
          userType: userType,
          userId: userId,
          type: 'registration_approved',
          title: 'Registration Approved',
          message: `Congratulations ${user.full_name}! Your registration has been approved. You can now access all platform features.`
        });
      }

      await client.query('COMMIT');

      return { success: true, message: `${userType} approved successfully` };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Reject a user registration
   */
  async rejectUser(userId, userType, reason, adminId) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const table = userType === 'worker' ? 'workers' : 'employers';

      // Update registration status
      await client.query(
        `UPDATE ${table} 
         SET registration_status = 'rejected', 
             updated_at = NOW()
         WHERE id = $1`,
        [userId]
      );

      // Get user info for notification
      const userResult = await client.query(
        `SELECT full_name, phone FROM ${table} WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        
        // Create notification
        await notificationService.createNotification({
          userType: userType,
          userId: userId,
          type: 'registration_rejected',
          title: 'Registration Rejected',
          message: `We're sorry ${user.full_name}, your registration was rejected. Reason: ${reason}. Please contact support for more information.`
        });
      }

      await client.query('COMMIT');

      return { success: true, message: `${userType} rejected` };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats() {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM workers WHERE is_active = true) as total_workers,
        (SELECT COUNT(*) FROM workers WHERE verification_status = 'verified') as verified_workers,
        (SELECT COUNT(*) FROM employers WHERE is_active = true) as total_employers,
        (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_jobs,
        (SELECT COUNT(*) FROM applications WHERE status = 'applied') as pending_applications,
        (SELECT COUNT(*) FROM payments WHERE status = 'confirmed') as confirmed_payments,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'confirmed') as total_revenue
    `;

    const result = await query(statsQuery);
    return result.rows[0];
  }

  /**
   * Get all workers (admin view)
   */
  async getAllWorkers(filters = {}) {
    const { page = 1, limit = 20, verificationStatus, workerType, search } = filters;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE is_active = true';
    const params = [];
    let paramCount = 0;

    if (verificationStatus) {
      paramCount++;
      whereClause += ` AND verification_status = $${paramCount}`;
      params.push(verificationStatus);
    }

    if (workerType) {
      paramCount++;
      whereClause += ` AND worker_type = $${paramCount}`;
      params.push(workerType);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (full_name ILIKE $${paramCount} OR phone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const workersQuery = `
      SELECT 
        id, phone, full_name, photo_url, worker_type, zone,
        years_experience, verification_status, trust_score,
        created_at
      FROM workers
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM workers ${whereClause}
    `;

    const [workersResult, countResult] = await Promise.all([
      query(workersQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    return {
      items: workersResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Get all employers (admin view)
   */
  async getAllEmployers(filters = {}) {
    const { page = 1, limit = 20, search } = filters;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE is_active = true';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (full_name ILIKE $${paramCount} OR phone ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const employersQuery = `
      SELECT 
        id, phone, email, full_name, zone,
        household_size, registration_status,
        created_at
      FROM employers
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM employers ${whereClause}
    `;

    const [employersResult, countResult] = await Promise.all([
      query(employersQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    return {
      items: employersResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }
}

module.exports = new AdminService();