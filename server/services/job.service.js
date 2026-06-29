// File path: /server/services/job.service.js
// Purpose: Job business logic - creation, retrieval, and management.
// Architecture: Config-driven pricing for premium features.

const { query, getClient } = require('../lib/db');
const configService = require('../lib/configService');

class JobService {
  /**
   * Creates a new job posting for an employer.
   */
  async createJob(employerId, data) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Verify employer exists and is active
      const employerCheck = await client.query(
        'SELECT id, registration_status FROM employers WHERE id = $1 AND is_active = true',
        [employerId]
      );

      if (employerCheck.rows.length === 0) {
        throw new Error('Employer account not found or inactive');
      }

      if (employerCheck.rows[0].registration_status !== 'approved') {
        throw new Error('Employer registration must be approved to post jobs');
      }

      // Parse salary range from the predefined config options
      const salaryRange = JSON.parse(data.salaryRange);

      // Insert the job record
      const jobResult = await client.query(
        `INSERT INTO jobs (
          employer_id, worker_type, schedule, housing, 
          salary_min, salary_max, working_hours,
          preferred_gender, min_experience, min_education, required_skills,
          is_urgent, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active'
        ) RETURNING id, created_at`,
        [
          employerId,
          data.workerType,
          data.schedule,
          data.housing,
          salaryRange.min,
          salaryRange.max,
          data.workingHours,
          data.preferredGender,
          parseInt(data.minExperience),
          data.minEducation || null,
          data.requiredSkills || [],
          data.isUrgent || false
        ]
      );

      const jobId = jobResult.rows[0].id;

      // Handle Urgent Hire Payment if requested
      if (data.isUrgent) {
        const urgentFee = configService.get('pricing.urgentHire.amount');
        const durationHours = configService.get('pricing.urgentHire.durationHours');
        
        // Create pending payment record for the urgent fee
        await client.query(
          `INSERT INTO payments (
            payer_type, payer_id, payment_type, reference_id, amount, status
          ) VALUES ('employer', $1, 'urgent_hire', $2, $3, 'pending')`,
          [employerId, jobId, urgentFee]
        );

        // Set expiry time for the urgent badge
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + durationHours);
        
        await client.query(
          `UPDATE jobs SET urgent_expires_at = $1 WHERE id = $2`,
          [expiryDate, jobId]
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        jobId,
        requiresPayment: data.isUrgent,
        paymentAmount: data.isUrgent ? configService.get('pricing.urgentHire.amount') : 0
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves jobs based on filters. Used for worker job browsing.
   */
  async getJobs(filters = {}) {
    const { workerType, schedule, housing, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE j.status = 'active' AND j.deleted_at IS NULL";
    const params = [];
    let paramCount = 0;

    if (workerType) {
      paramCount++;
      whereClause += ` AND j.worker_type = $${paramCount}`;
      params.push(workerType);
    }

    if (schedule) {
      paramCount++;
      whereClause += ` AND j.schedule = $${paramCount}`;
      params.push(schedule);
    }

    if (housing) {
      paramCount++;
      whereClause += ` AND j.housing = $${paramCount}`;
      params.push(housing);
    }

    // Fetch jobs with employer details
    const jobsQuery = `
      SELECT 
        j.id, j.worker_type as "workerType", j.schedule, j.housing,
        j.salary_min as "salaryMin", j.salary_max as "salaryMax",
        j.working_hours as "workingHours", j.preferred_gender as "preferredGender",
        j.is_urgent as "isUrgent", j.created_at as "createdAt",
        e.full_name as "employerName", e.zone as "employerZone"
      FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      ${whereClause}
      ORDER BY 
        CASE WHEN j.is_urgent = true AND (j.urgent_expires_at IS NULL OR j.urgent_expires_at > NOW()) THEN 0 ELSE 1 END,
        j.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM jobs j
      ${whereClause}
    `;

    const [jobsResult, countResult] = await Promise.all([
      query(jobsQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    return {
      items: jobsResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Retrieves jobs posted by a specific employer.
   */
  async getEmployerJobs(employerId, filters = {}) {
    const { status = 'active', page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const jobsQuery = `
      SELECT 
        j.id, j.worker_type as "workerType", j.schedule, j.housing,
        j.salary_min as "salaryMin", j.salary_max as "salaryMax",
        j.is_urgent as "isUrgent", j.status, j.created_at as "createdAt",
        COUNT(a.id) as "applicantCount"
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      WHERE j.employer_id = $1 AND j.status = $2 AND j.deleted_at IS NULL
      GROUP BY j.id
      ORDER BY j.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(*) as total FROM jobs 
      WHERE employer_id = $1 AND status = $2 AND deleted_at IS NULL
    `;

    const [jobsResult, countResult] = await Promise.all([
      query(jobsQuery, [employerId, status, limit, offset]),
      query(countQuery, [employerId, status])
    ]);

    return {
      items: jobsResult.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }
}

module.exports = new JobService();