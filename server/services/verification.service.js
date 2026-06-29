// File path: /server/services/verification.service.js
// Purpose: Verification workflow management - document review and reference checks.
// Architecture: State machine driven with audit logging.

const { query, getClient } = require('../lib/db');
const trustScoreService = require('./trustScore.service');
const notificationService = require('./notification.service');

class VerificationService {
  /**
   * Get workers pending verification
   */
  async getVerificationQueue(filters = {}) {
    const { page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    const workersQuery = `
      SELECT 
        w.id,
        w.full_name as "fullName",
        w.phone,
        w.photo_url as "photo",
        w.worker_type as "workerType",
        w.police_clearance_url as "policeClearance",
        w.health_certificate_url as "healthCertificate",
        w.id_document_url as "idDocument",
        w.verification_status as "verificationStatus",
        w.created_at as "submittedAt",
        COUNT(vl.id) as "referenceChecksDone"
      FROM workers w
      LEFT JOIN verification_logs vl ON w.id = vl.worker_id
      WHERE w.verification_status IN ('documents_uploaded', 'under_review')
      AND w.is_active = true
      GROUP BY w.id
      ORDER BY w.created_at ASC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM workers 
      WHERE verification_status IN ('documents_uploaded', 'under_review')
      AND is_active = true
    `;

    const [workersResult, countResult] = await Promise.all([
      query(workersQuery, [limit, offset]),
      query(countQuery)
    ]);

    return {
      items: workersResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Get detailed worker verification data
   */
  async getWorkerVerificationDetails(workerId) {
    const workerResult = await query(
      `SELECT 
        id, full_name as "fullName", phone, photo_url as "photo",
        worker_type as "workerType", education_level as "educationLevel",
        years_experience as "yearsExperience", languages, skills,
        police_clearance_url as "policeClearance",
        health_certificate_url as "healthCertificate",
        health_certificate_expiry as "healthExpiry",
        id_document_url as "idDocument",
        id_document_type as "idType",
        id_document_number as "idNumber",
        previous_employers as "previousEmployers",
        verification_status as "verificationStatus",
        trust_score as "trustScore"
       FROM workers 
       WHERE id = $1`,
      [workerId]
    );

    if (workerResult.rows.length === 0) {
      throw new Error('Worker not found');
    }

    const worker = workerResult.rows[0];

    // Get verification logs
    const logsResult = await query(
      `SELECT 
        id, check_type as "checkType", 
        reference_contact_phone as "referencePhone",
        result, notes, checked_at as "checkedAt"
       FROM verification_logs 
       WHERE worker_id = $1
       ORDER BY checked_at DESC`,
      [workerId]
    );

    return {
      ...worker,
      verificationLogs: logsResult.rows
    };
  }

  /**
   * Log a verification check (document review or reference call)
   */
  async logVerificationCheck(workerId, adminId, checkData) {
    const { checkType, referencePhone, result, notes } = checkData;

    await query(
      `INSERT INTO verification_logs 
       (worker_id, check_type, reference_contact_phone, result, notes, checked_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [workerId, checkType, referencePhone, result, notes, adminId]
    );

    // Recalculate trust score
    await trustScoreService.calculateTrustScore(workerId);

    return { success: true };
  }

  /**
   * Approve worker verification
   */
  async approveVerification(workerId, adminId) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Update worker status
      await client.query(
        `UPDATE workers 
         SET verification_status = 'verified', 
             verified_at = NOW(),
             verified_by = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [adminId, workerId]
      );

      // Calculate final trust score
      await trustScoreService.calculateTrustScore(workerId);

      // Notify worker
      const workerResult = await client.query(
        'SELECT full_name FROM workers WHERE id = $1',
        [workerId]
      );

      if (workerResult.rows.length > 0) {
        await notificationService.createNotification({
          userType: 'worker',
          userId: workerId,
          type: 'verification_approved',
          title: 'Verification Approved',
          message: `Congratulations ${workerResult.rows[0].full_name}! Your verification is complete. Your Trust Score has been updated.`
        });
      }

      await client.query('COMMIT');

      return { success: true, message: 'Verification approved' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Reject worker verification
   */
  async rejectVerification(workerId, adminId, reason) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Update worker status
      await client.query(
        `UPDATE workers 
         SET verification_status = 'rejected',
             updated_at = NOW()
         WHERE id = $1`,
        [workerId]
      );

      // Notify worker
      const workerResult = await client.query(
        'SELECT full_name FROM workers WHERE id = $1',
        [workerId]
      );

      if (workerResult.rows.length > 0) {
        await notificationService.createNotification({
          userType: 'worker',
          userId: workerId,
          type: 'verification_rejected',
          title: 'Verification Rejected',
          message: `We're sorry ${workerResult.rows[0].full_name}, your verification was rejected. ${reason ? 'Reason: ' + reason : 'Please contact support for more information.'}`
        });
      }

      await client.query('COMMIT');

      return { success: true, message: 'Verification rejected' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get public worker directory (verified workers only)
   */
  async getWorkerDirectory(filters = {}) {
    const { workerType, trustTier, availability, location, search, page = 1, limit = 12 } = filters;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE w.verification_status = 'verified' AND w.is_active = true";
    const params = [];
    let paramCount = 0;

    if (workerType) {
      paramCount++;
      whereClause += ` AND w.worker_type = $${paramCount}`;
      params.push(workerType);
    }

    if (trustTier) {
      paramCount++;
      whereClause += ` AND w.trust_score->>'tier' = $${paramCount}`;
      params.push(trustTier);
    }

    if (availability) {
      paramCount++;
      whereClause += ` AND w.availability = $${paramCount}`;
      params.push(availability);
    }

    if (location) {
      paramCount++;
      whereClause += ` AND w.zone = $${paramCount}`;
      params.push(location);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND w.full_name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    const workersQuery = `
      SELECT 
        w.id,
        w.full_name as "fullName",
        w.photo_url as "photo",
        w.worker_type as "workerType",
        w.years_experience as "experience",
        w.zone as "location",
        w.availability,
        w.trust_score as "trustScore",
        w.skills
      FROM workers w
      ${whereClause}
      ORDER BY 
        CASE WHEN w.trust_score->>'tier' = 'premium' THEN 1 
             WHEN w.trust_score->>'tier' = 'verified' THEN 2 
             ELSE 3 END,
        (w.trust_score->>'total')::INTEGER DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM workers w ${whereClause}
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
   * Get detailed worker profile (public view)
   */
  async getWorkerProfile(workerId) {
    const result = await query(
      `SELECT 
        w.id,
        w.full_name as "fullName",
        w.photo_url as "photo",
        w.worker_type as "workerType",
        w.education_level as "educationLevel",
        w.years_experience as "experience",
        w.languages,
        w.skills,
        w.availability,
        w.salary_expectation_min as "salaryMin",
        w.salary_expectation_max as "salaryMax",
        w.zone as "location",
        w.trust_score as "trustScore",
        w.verification_status as "verificationStatus"
       FROM workers w
       WHERE w.id = $1 AND w.verification_status = 'verified' AND w.is_active = true`,
      [workerId]
    );

    if (result.rows.length === 0) {
      throw new Error('Worker not found or not verified');
    }

    const worker = result.rows[0];

    // Get reviews
    const reviewsResult = await query(
      `SELECT 
        r.rating,
        r.context_tags as "tags",
        r.comment,
        r.created_at as "date",
        e.full_name as "employerName"
       FROM reviews r
       JOIN employers e ON r.employer_id = e.id
       WHERE r.worker_id = $1
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [workerId]
    );

    return {
      ...worker,
      reviews: reviewsResult.rows
    };
  }
}

module.exports = new VerificationService();