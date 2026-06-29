// File path: /server/services/auth.service.js
// Purpose: Authentication business logic - login, register, JWT token management

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, getClient } = require('../lib/db');
const configService = require('../lib/configService');

class AuthService {
  // Generate JWT tokens
  generateTokens(user) {
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        type: user.type // 'worker', 'employer', or 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  // Worker Registration
  async registerWorker(data) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      console.log('📝 Registering worker with data:', data);

      // Check if phone already exists
      const existingWorker = await client.query(
        'SELECT id FROM workers WHERE phone = $1',
        [data.phone]
      );

      if (existingWorker.rows.length > 0) {
        throw new Error('Phone number already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Insert worker
      const result = await client.query(
        `INSERT INTO workers (
          phone, password_hash, full_name, age, gender, photo_url,
          emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
          zone, woreda, worker_type, education_level, years_experience,
          languages, skills, availability, salary_expectation_min, salary_expectation_max,
          previous_employers, registration_status, registration_source
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9,
          $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19,
          $20, 'payment_pending', 'online'
        ) RETURNING id, phone, full_name, registration_status`,
        [
          data.phone, 
          passwordHash, 
          data.fullName, 
          parseInt(data.age), 
          data.gender, 
          data.photoUrl || null,
          data.emergencyContactName, 
          data.emergencyContactPhone, 
          data.emergencyContactRelationship,
          data.zone, 
          data.woreda || null, 
          data.workerType, 
          data.educationLevel, 
          parseInt(data.yearsExperience),
          data.languages || [], 
          data.skills || [], 
          data.availability, 
          parseInt(data.salaryExpectationMin), 
          parseInt(data.salaryExpectationMax),
          JSON.stringify(data.previousEmployers || [])
        ]
      );

      const worker = result.rows[0];

      // Create payment record
      const registrationFee = configService.get('pricing.registration.worker.amount');
      await client.query(
        `INSERT INTO payments (payer_type, payer_id, payment_type, amount, status)
         VALUES ('worker', $1, 'registration', $2, 'pending')`,
        [worker.id, registrationFee]
      );

      await client.query('COMMIT');

      console.log('✅ Worker registered successfully:', worker.id);

      return {
        success: true,
        worker: {
          id: worker.id,
          phone: worker.phone,
          fullName: worker.fullName,
          registrationStatus: worker.registrationStatus
        },
        paymentRequired: registrationFee
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Worker registration error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Employer Registration
  async registerEmployer(data) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      console.log('📝 Registering employer with data:', data);

      // Check if phone already exists
      const existingEmployer = await client.query(
        'SELECT id FROM employers WHERE phone = $1',
        [data.phone]
      );

      if (existingEmployer.rows.length > 0) {
        throw new Error('Phone number already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Insert employer
      const result = await client.query(
        `INSERT INTO employers (
          phone, email, password_hash, full_name,
          zone, woreda, household_size, children_under_5, children_5_to_12,
          elderly_members, has_special_needs, special_notes,
          registration_status, registration_source
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8, $9,
          $10, $11, $12,
          'payment_pending', 'online'
        ) RETURNING id, phone, full_name, registration_status`,
        [
          data.phone, data.email, passwordHash, data.fullName,
          data.zone, data.woreda, data.householdSize, data.childrenUnder5, data.children5to12,
          data.elderlyMembers, data.hasSpecialNeeds || false, data.specialNotes
        ]
      );

      const employer = result.rows[0];

      // Create payment record
      const registrationFee = configService.get('pricing.registration.employer.amount');
      await client.query(
        `INSERT INTO payments (payer_type, payer_id, payment_type, amount, status)
         VALUES ('employer', $1, 'registration', $2, 'pending')`,
        [employer.id, registrationFee]
      );

      await client.query('COMMIT');

      console.log('✅ Employer registered successfully:', employer.id);

      return {
        success: true,
        employer: {
          id: employer.id,
          phone: employer.phone,
          fullName: employer.fullName,
          registrationStatus: employer.registrationStatus
        },
        paymentRequired: registrationFee
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Employer registration error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Login (for workers, employers, and admins)
  async login(phone, password, userType = 'worker') {
    let table, user;

    // Determine which table to query based on user type
    if (userType === 'admin') {
      // Admins login with email
      const result = await query(
        'SELECT * FROM admins WHERE email = $1 AND is_active = true',
        [phone] // phone parameter is actually email for admins
      );
      user = result.rows[0];
      table = 'admins';
    } else {
      const result = await query(
        `SELECT * FROM ${userType}s WHERE phone = $1 AND is_active = true`,
        [phone]
      );
      user = result.rows[0];
      table = userType === 'worker' ? 'workers' : 'employers';
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if registration is approved
    if (table !== 'admins' && user.registration_status !== 'approved' && user.registration_status !== 'verified') {
      throw new Error('Account not yet approved. Please complete payment and wait for admin approval.');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens({
      id: user.id,
      role: table === 'admins' ? user.role : userType,
      type: userType
    });

    // Update last login for admins
    if (table === 'admins') {
      await query(
        'UPDATE admins SET last_login_at = NOW() WHERE id = $1',
        [user.id]
      );
    }

    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone || user.email,
        fullName: user.full_name,
        role: table === 'admins' ? user.role : userType,
        type: userType
      },
      tokens
    };
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Get user from database
      const result = await query(
        'SELECT id, full_name, phone FROM workers WHERE id = $1 AND is_active = true UNION ALL SELECT id, full_name, phone FROM employers WHERE id = $1 AND is_active = true',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      const tokens = this.generateTokens(user);

      return { success: true, tokens };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new AuthService();