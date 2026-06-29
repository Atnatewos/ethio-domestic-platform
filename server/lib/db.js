// File path: /server/lib/db.js
// Purpose: PostgreSQL database connection pool optimized for Neon serverless
// Architecture: Handles connection suspension/resumption automatically

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5, // Reduced for serverless
  idleTimeoutMillis: 10000, // Shorter idle timeout
  connectionTimeoutMillis: 15000, // Longer connection timeout
  allowExitOnIdle: true // Allow process to exit when idle
});

// Test connection on startup
pool.on('connect', () => console.log('✅ Connected to Neon PostgreSQL'));
pool.on('error', (err) => console.error('❌ DB error:', err.message));

/**
 * Execute a query with automatic retry for serverless timeouts
 */
const queryWithRetry = async (text, params, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await pool.query(text, params);
    } catch (error) {
      if (attempt === retries || !error.message.includes('timeout')) throw error;
      console.log(`⏳ Query timeout (attempt ${attempt}/${retries}), retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

module.exports = {
  pool,
  query: queryWithRetry,
  getClient: () => pool.connect()
};