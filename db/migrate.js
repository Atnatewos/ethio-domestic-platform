// File path: /db/migrate.js
// Purpose: Run database migrations to create all tables
// Usage: node db/migrate.js

const fs = require('fs');
const path = require('path');
const { pool } = require('../server/lib/db');

async function migrate() {
  console.log('🔄 Starting database migration...\n');
  
  try {
    // Read schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Executing schema.sql...');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Schema executed successfully!\n');
    
    // Read and execute seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('📄 Executing seed.sql...');
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('✅ Seed data inserted successfully!\n');
    }
    
    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📊 Tables created:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

migrate();