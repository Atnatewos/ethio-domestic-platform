// File path: /server/services/admin.service.js
// Purpose: Admin business logic - registration approvals, verification queue, stats
// This is the core workflow that controls who can use the platform

const { query, getClient } = require('../lib/db');
const configService = require('../lib/configService');
const telegramService = require('../lib/telegram');
const notificationService = require('./notification.service');

class AdminService {
  // Get pending registration approvals
  async getPendingApprovals(filters = {}) {
    const { userType, registrationSource, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE registration_status = 'payment_pending'";
    const params = [];
    let paramCount = 0;

    if (userType) {
      paramCount++;
      whereClause += ` AND $${paramCount} = $${paramCount}`;
      params.push(userType);
    }

    if (registrationSource) {
      paramCount++;
      whereClause += ` AND registration_source = $${paramCount}`;
      params.push(registrationSource);
    }

    // Get workers
    const workersQuery = `
      SELECT 
        w.id,
        w.full_name as "fullName",
        w.phone,
        w.worker_type as "workerType",
        w.registration_status as "registrationStatus",
        w.registration_source as "registrationSource",
        w.created_at as "createdAt",
        'worker' as "userType",
        p.amount,
        p.receipt_url as "paymentProof"
      FROM workers w
      LEFT JOIN payments p ON p.payer_id = w.id AND p.payment_type = 'registration' AND p.payer_type = 'worker'
      ${whereClause.replace('registration_status', 'w.registration_status')}
      ORDER BY w.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    // Get employers
    const employersQuery = `
      SELECT 
        e.id,
        e.full_name as "fullName",
        e.phone,
        e.registration_status as "registrationStatus",
        e.registration_source as "registrationSource",
        e.created_at as "createdAt",
        'employer' as "userType",
        p.amount,
        p.receipt_url as "paymentProof"
      FROM employers e
      LEFT JOIN payments p ON p.payer_id = e.id AND p.payment_type = 'registration' AND p.payer_type = 'employer'
      ${whereClause.replace('registration_status', 'e.registration_status')}
      ORDER BY e.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const [workersResult, employersResult] = await Promise.all([
      query(workersQuery, [...params, limit, offset]),
      query(employersQuery, [...params, limit, offset])
    ]);

    // Combine and sort by date
    const allApprovals = [...workersResult.rows, ...employersResult.rows]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    // Get total count
    const countQuery = `
      SELECT 
        (SELECT COUNT(*) FROM workers ${whereClause.replace('registration_status', 'registration_status')}) as workers,
        (SELECT COUNT(*) FROM employers ${whereClause.replace('registration_status', 'registration_status')}) as employers
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].workers) + parseInt(countResult.rows[0].employers);

    return {
      items: allApprovals,
      total,
      page,
      limit
    };
  }

  // Send notification to user after approval
  async sendApprovalNotification(userId, userType) {
    try {
      const table = userType === 'worker' ? 'workers' : 'employers';
      const userResult = await query(
        `SELECT full_name FROM ${table} WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        
        await notificationService.createNotification({
          userType,
          userId,
          type: 'registration_approved',
          title: 'Registration Approved',
          message: `Congratulations ${user.full_name}! Your registration has been approved. You can now login and start using the platform.`
        });
      }
    } catch (error) {
      console.error('Failed to send approval notification:', error);
      // Don't throw - notification failure shouldn't block approval
    }
  }

  // Send notification to user after rejection
  async sendRejectionNotification(userId, userType, reason) {
    try {
      const table = userType === 'worker' ? 'workers' : 'employers';
      const userResult = await query(
        `SELECT full_name FROM ${table} WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        
        await notificationService.createNotification({
          userType,
          userId,
          type: 'registration_rejected',
          title: 'Registration Rejected',
          message: `We're sorry ${user.full_name}, your registration was rejected. ${reason ? 'Reason: ' + reason : 'Please contact support for more information.'}`
        });
      }
    } catch (error) {
      console.error('Failed to send rejection notification:', error);
      // Don't throw - notification failure shouldn't block rejection
    }
  }

  // Approve registration
  async approveRegistration(userId, userType, adminId, notes = '') {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const table = userType === 'worker' ? 'workers' : 'employers';

      // Update registration status
      await client.query(
        `UPDATE ${table} 
         SET registration_status = 'approved', updated_at = NOW()
         WHERE id = $1 AND registration_status = 'payment_pending'`,
        [userId]
      );

      // Update payment status
      await client.query(
        `UPDATE payments 
         SET status = 'confirmed', confirmed_at = NOW(), confirmed_by = $1, admin_notes = $2
         WHERE payer_id = $3 AND payer_type = $4 AND payment_type = 'registration' AND status = 'pending'`,
        [adminId, notes, userId, userType]
      );

      await client.query('COMMIT');

      // Send in-app notification to user
      await this.sendApprovalNotification(userId, userType);

      // Send Telegram notification to admin
      const userResult = await client.query(
        `SELECT full_name, phone FROM ${table} WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await telegramService.sendAlert(
          `✅ Registration Approved\n\n` +
          `User: ${user.full_name}\n` +
          `Phone: ${user.phone}\n` +
          `Type: ${userType}\n` +
          `Approved by: Admin #${adminId}`
        );
      }

      return { success: true, message: 'Registration approved successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Reject registration
  async rejectRegistration(userId, userType, adminId, reason = '') {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const table = userType === 'worker' ? 'workers' : 'employers';

      // Update registration status
      await client.query(
        `UPDATE ${table} 
         SET registration_status = 'rejected', updated_at = NOW()
         WHERE id = $1 AND registration_status = 'payment_pending'`,
        [userId]
      );

      // Update payment status
      await client.query(
        `UPDATE payments 
         SET status = 'failed', admin_notes = $1
         WHERE payer_id = $2 AND payer_type = $3 AND payment_type = 'registration' AND status = 'pending'`,
        [reason, userId, userType]
      );

      await client.query('COMMIT');

      // Send in-app notification to user
      await this.sendRejectionNotification(userId, userType, reason);

      // Send Telegram notification to admin
      const userResult = await client.query(
        `SELECT full_name, phone FROM ${table} WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await telegramService.sendAlert(
          `❌ Registration Rejected\n\n` +
          `User: ${user.full_name}\n` +
          `Phone: ${user.phone}\n` +
          `Type: ${userType}\n` +
          `Reason: ${reason || 'Not specified'}\n` +
          `Rejected by: Admin #${adminId}`
        );
      }

      return { success: true, message: 'Registration rejected' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get admin dashboard stats
  async getDashboardStats() {
    const stats = await Promise.all([
      // Total workers
      query("SELECT COUNT(*) as total FROM workers WHERE is_active = true AND deleted_at IS NULL"),
      // Verified workers
      query("SELECT COUNT(*) as total FROM workers WHERE verification_status = 'verified' AND is_active = true"),
      // Active jobs
      query("SELECT COUNT(*) as total FROM jobs WHERE status = 'active' AND deleted_at IS NULL"),
      // Monthly revenue
      query(`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM payments 
        WHERE status = 'confirmed' 
        AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `),
      // Pending approvals count
      query(`
        SELECT 
          (SELECT COUNT(*) FROM workers WHERE registration_status = 'payment_pending') as workers,
          (SELECT COUNT(*) FROM employers WHERE registration_status = 'payment_pending') as employers
      `)
    ]);

    return {
      workers: {
        total: parseInt(stats[0].rows[0].total),
        verified: parseInt(stats[1].rows[0].total)
      },
      jobs: {
        active: parseInt(stats[2].rows[0].total)
      },
      payments: {
        monthTotal: parseInt(stats[3].rows[0].total)
      },
      pendingApprovals: {
        workers: parseInt(stats[4].rows[0].workers),
        employers: parseInt(stats[4].rows[0].employers),
        total: parseInt(stats[4].rows[0].workers) + parseInt(stats[4].rows[0].employers)
      }
    };
  }

  // Get all workers (admin view)
  async getAllWorkers(filters = {}) {
    const { workerType, trustTier, verificationStatus, search, page = 1, limit = 20, sort } = filters;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE w.is_active = true AND w.deleted_at IS NULL";
    const params = [];
    let paramCount = 0;

    if (workerType) {
      paramCount++;
      whereClause += ` AND w.worker_type = $${paramCount}`;
      params.push(workerType);
    }

    if (verificationStatus) {
      paramCount++;
      whereClause += ` AND w.verification_status = $${paramCount}`;
      params.push(verificationStatus);
    }

    if (trustTier) {
      paramCount++;
      whereClause += ` AND w.trust_score->>'tier' = $${paramCount}`;
      params.push(trustTier);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (w.full_name ILIKE $${paramCount} OR w.phone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Sorting
    let orderBy = 'ORDER BY w.created_at DESC';
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = ['full_name', 'phone', 'worker_type', 'created_at'];
      if (validFields.includes(field)) {
        orderBy = `ORDER BY w.${field} ${direction.toUpperCase()}`;
      }
    }

    const dataQuery = `
      SELECT 
        w.id,
        w.full_name as "fullName",
        w.phone,
        w.photo_url as "photo",
        w.worker_type as "workerType",
        w.trust_score as "trustScore",
        w.verification_status as "verificationStatus",
        w.created_at as "registeredAt"
      FROM workers w
      ${whereClause}
      ${orderBy}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM workers w ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      query(dataQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    return {
      items: dataResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit
    };
  }

  // Get single worker details
  async getWorkerDetails(workerId) {
    const result = await query(
      `SELECT * FROM workers WHERE id = $1`,
      [workerId]
    );

    if (result.rows.length === 0) {
      throw new Error('Worker not found');
    }

    return result.rows[0];
  }

  // Suspend worker
  async suspendWorker(workerId, adminId, reason = '') {
    await query(
      `UPDATE workers 
       SET registration_status = 'suspended', is_active = false, updated_at = NOW()
       WHERE id = $1`,
      [workerId]
    );

    // Send notification to worker
    try {
      const workerResult = await query(
        `SELECT full_name FROM workers WHERE id = $1`,
        [workerId]
      );

      if (workerResult.rows.length > 0) {
        await notificationService.createNotification({
          userType: 'worker',
          userId: workerId,
          type: 'account_suspended',
          title: 'Account Suspended',
          message: `Your account has been suspended. ${reason ? 'Reason: ' + reason : 'Please contact support for more information.'}`
        });
      }
    } catch (error) {
      console.error('Failed to send suspension notification:', error);
    }

    await telegramService.sendAlert(
      `⚠️ Worker Suspended\n\nWorker ID: ${workerId}\nReason: ${reason || 'Not specified'}\nBy: Admin #${adminId}`
    );

    return { success: true, message: 'Worker suspended' };
  }
}

module.exports = new AdminService();