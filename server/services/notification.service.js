// File path: /server/services/application.service.js
// Purpose: Application business logic - managing the lifecycle from application to hire.
// Security: Enforces role-based actions and validates workflow state transitions.

const { query, getClient } = require('../lib/db');
const configService = require('../lib/configService');
const notificationService = require('./notification.service');

class ApplicationService {
  /**
   * Creates a new application from a worker to a job.
   */
  async applyToJob(workerId, jobId) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Verify worker status
      const workerCheck = await client.query(
        'SELECT id, registration_status FROM workers WHERE id = $1 AND is_active = true',
        [workerId]
      );

      if (workerCheck.rows.length === 0) {
        throw new Error('Worker account not found or inactive');
      }

      // Verify job exists and is active
      const jobCheck = await client.query(
        'SELECT id, employer_id, status FROM jobs WHERE id = $1 AND deleted_at IS NULL',
        [jobId]
      );

      if (jobCheck.rows.length === 0) {
        throw new Error('Job not found');
      }

      if (jobCheck.rows[0].status !== 'active') {
        throw new Error('This job is no longer accepting applications');
      }

      // Prevent duplicate applications
      const duplicateCheck = await client.query(
        'SELECT id FROM applications WHERE worker_id = $1 AND job_id = $2',
        [workerId, jobId]
      );

      if (duplicateCheck.rows.length > 0) {
        throw new Error('You have already applied to this job');
      }

      // Insert application
      const result = await client.query(
        `INSERT INTO applications (job_id, worker_id, status, status_history)
         VALUES ($1, $2, 'applied', $3)
         RETURNING id, created_at`,
        [jobId, workerId, JSON.stringify([{ status: 'applied', at: new Date().toISOString() }])]
      );

      // Notify employer
      const employerId = jobCheck.rows[0].employer_id;
      await notificationService.createNotification({
        userType: 'employer',
        userId: employerId,
        type: 'new_application',
        title: 'New Job Application',
        message: 'A verified worker has applied to your job posting.'
      });

      await client.query('COMMIT');

      return {
        success: true,
        applicationId: result.rows[0].id
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves applications for a specific worker.
   */
  async getWorkerApplications(workerId, filters = {}) {
    const { status, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE a.worker_id = $1';
    const params = [workerId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      whereClause += ` AND a.status = $${paramCount}`;
      params.push(status);
    }

    const appsQuery = `
      SELECT 
        a.id, a.status, a.created_at as "appliedAt",
        j.worker_type as "workerType", j.schedule, j.housing,
        j.salary_min as "salaryMin", j.salary_max as "salaryMax",
        e.full_name as "employerName", e.zone as "employerZone"
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN employers e ON j.employer_id = e.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM applications a
      ${whereClause}
    `;

    const [appsResult, countResult] = await Promise.all([
      query(appsQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    return {
      items: appsResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Retrieves all applications for a specific job (Employer view).
   */
  async getJobApplicants(employerId, jobId, filters = {}) {
    const { trustTier, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    // Verify job belongs to employer
    const jobCheck = await query(
      'SELECT id FROM jobs WHERE id = $1 AND employer_id = $2',
      [jobId, employerId]
    );

    if (jobCheck.rows.length === 0) {
      throw new Error('Job not found or access denied');
    }

    let whereClause = 'WHERE a.job_id = $1';
    const params = [jobId];
    let paramCount = 1;

    if (trustTier) {
      paramCount++;
      whereClause += ` AND w.trust_score->>'tier' = $${paramCount}`;
      params.push(trustTier);
    }

    const appsQuery = `
      SELECT 
        a.id as "applicationId", a.status, a.created_at as "appliedAt",
        w.id as "workerId", w.full_name as "fullName", w.phone, w.photo_url as "photo",
        w.worker_type as "workerType", w.years_experience as "experience",
        w.skills, w.trust_score as "trustScore"
      FROM applications a
      JOIN workers w ON a.worker_id = w.id
      ${whereClause}
      ORDER BY 
        CASE WHEN w.trust_score->>'tier' = 'premium' THEN 1 
             WHEN w.trust_score->>'tier' = 'verified' THEN 2 
             ELSE 3 END,
        a.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM applications a
      JOIN workers w ON a.worker_id = w.id
      ${whereClause}
    `;

    const [appsResult, countResult] = await Promise.all([
      query(appsQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    return {
      items: appsResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Updates the status of an application (Shortlist, Interview, Hire, Reject).
   */
  async updateApplicationStatus(employerId, applicationId, newStatus) {
    const validTransitions = {
      applied: ['shortlisted', 'rejected'],
      shortlisted: ['interviewed', 'rejected'],
      interviewed: ['trial', 'hired', 'rejected'],
      trial: ['hired', 'rejected']
    };

    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Fetch current application and verify ownership
      const appResult = await client.query(
        `SELECT a.id, a.status, a.worker_id, a.job_id, j.employer_id 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         WHERE a.id = $1 AND j.employer_id = $2`,
        [applicationId, employerId]
      );

      if (appResult.rows.length === 0) {
        throw new Error('Application not found or access denied');
      }

      const app = appResult.rows[0];

      // Validate state transition
      const allowedNextStates = validTransitions[app.status] || [];
      if (!allowedNextStates.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${app.status} to ${newStatus}`);
      }

      // Update status
      const historyEntry = { status: newStatus, at: new Date().toISOString(), by: employerId };
      
      await client.query(
        `UPDATE applications 
         SET status = $1, status_history = status_history || $2, updated_at = NOW()
         WHERE id = $3`,
        [newStatus, JSON.stringify([historyEntry]), applicationId]
      );

      // If hired, update job status and worker collateral logic would go here
      if (newStatus === 'hired') {
        await client.query(
          `UPDATE jobs SET status = 'filled', filled_at = NOW(), filled_by_worker_id = $1 WHERE id = $2`,
          [app.worker_id, app.job_id]
        );
      }

      // Notify worker
      await notificationService.createNotification({
        userType: 'worker',
        userId: app.worker_id,
        type: `application_${newStatus}`,
        title: `Application ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        message: `Your application status has been updated to ${newStatus}.`
      });

      await client.query('COMMIT');

      return { success: true, newStatus };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ApplicationService();