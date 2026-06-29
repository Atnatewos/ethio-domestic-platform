// File path: /db/seed-minimal.js
// Purpose: Seed ONLY workers and employers - skip complex relationships
// Usage: node db/seed-minimal.js

const { query, pool } = require('../server/lib/db');

async function seedMinimal() {
  console.log('📊 Seeding minimal test data...\n');

  try {
    console.log('🗑️  Clearing existing test data...');
    await query("DELETE FROM workers WHERE phone LIKE '+2519%'");
    await query("DELETE FROM employers WHERE email LIKE '%example.com'");
    console.log('✅ Cleared\n');

    const passwordHash = '$2a$10$rKvQhJ8xYzZzZzZzZzZzZuQvXzZzZzZzZzZzZzZzZzZzZzZzZzZzZ';

    // ============================================
    // WORKERS (10 workers with various trust scores)
    // ============================================
    console.log('👷 Inserting workers...');
    
    const workers = [
      { phone: '+251911234567', name: 'Abebe Kebede', age: 28, gender: 'male', type: 'maid', zone: 'bole', exp: 5, salary: [5000, 7000], status: 'verified', tier: 'premium', score: 92 },
      { phone: '+251922345678', name: 'Sara Mohammed', age: 32, gender: 'female', type: 'nanny', zone: 'kirkos', exp: 7, salary: [7000, 10000], status: 'verified', tier: 'verified', score: 68 },
      { phone: '+251933456789', name: 'Dawit Tadesse', age: 25, gender: 'male', type: 'driver', zone: 'yeka', exp: 3, salary: [4000, 6000], status: 'approved', tier: 'inProgress', score: 35 },
      { phone: '+251944567890', name: 'Hanna Getachew', age: 29, gender: 'female', type: 'cook', zone: 'arada', exp: 4, salary: [5000, 8000], status: 'draft', tier: 'new', score: 0 },
      { phone: '+251955678901', name: 'Meron Haile', age: 35, gender: 'female', type: 'cook', zone: 'gulele', exp: 10, salary: [8000, 12000], status: 'verified', tier: 'premium', score: 95 },
      { phone: '+2519600000001', name: 'Tigist Alemu', age: 26, gender: 'female', type: 'maid', zone: 'bole', exp: 2, salary: [3000, 5000], status: 'verified', tier: 'premium', score: 85 },
      { phone: '+2519600000002', name: 'Beza Kebede', age: 27, gender: 'female', type: 'cleaner', zone: 'kirkos', exp: 3, salary: [3500, 5500], status: 'verified', tier: 'verified', score: 72 },
      { phone: '+2519600000003', name: 'Solomon Tesfaye', age: 28, gender: 'male', type: 'guard', zone: 'yeka', exp: 4, salary: [4000, 6000], status: 'approved', tier: 'inProgress', score: 40 },
      { phone: '+2519600000004', name: 'Rahel Mohammed', age: 29, gender: 'female', type: 'nanny', zone: 'arada', exp: 5, salary: [4500, 6500], status: 'draft', tier: 'new', score: 5 },
      { phone: '+2519600000005', name: 'Yonas Bekele', age: 30, gender: 'male', type: 'driver', zone: 'gulele', exp: 6, salary: [5000, 7000], status: 'verified', tier: 'verified', score: 65 }
    ];

    for (const w of workers) {
      await query(
        `INSERT INTO workers (
          phone, password_hash, full_name, age, gender, 
          emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
          zone, worker_type, years_experience, 
          languages, skills, availability, 
          salary_expectation_min, salary_expectation_max,
          registration_status, verification_status, is_active, trust_score
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11,
          $12, $13, $14,
          $15, $16,
          $17, $18, true, $19
        )`,
        [
          w.phone, passwordHash, w.name, w.age, w.gender,
          'Emergency Contact', '+251900000000', 'parent',
          w.zone, w.type, w.exp,
          ['amharic', 'english'], [], 'full_time',
          w.salary[0], w.salary[1],
          w.status === 'draft' ? 'payment_pending' : 'approved',
          w.status,
          JSON.stringify({ total: w.score, tier: w.tier, breakdown: {} })
        ]
      );
    }
    console.log(`✅ ${workers.length} workers inserted\n`);

    // ============================================
    // EMPLOYERS (5 employers)
    // ============================================
    console.log('🏢 Inserting employers...');
    
    const employers = [
      { phone: '+251911111111', email: 'employer1@example.com', name: 'Ato Tesfaye Bekele', zone: 'bole' },
      { phone: '+251922222222', email: 'employer2@example.com', name: 'W/ro Selamawit Haile', zone: 'kirkos' },
      { phone: '+251933333333', email: 'employer3@example.com', name: 'Ato Yonas Tadesse', zone: 'yeka' },
      { phone: '+251944444444', email: 'employer4@example.com', name: 'W/ro Hanna Getachew', zone: 'arada' },
      { phone: '+251955555555', email: 'employer5@example.com', name: 'Ato Dawit Solomon', zone: 'gulele' }
    ];

    for (const e of employers) {
      await query(
        `INSERT INTO employers (
          phone, email, password_hash, full_name, zone,
          household_size, children_under_5, children_5_to_12, elderly_members,
          registration_status, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'approved', true)`,
        [e.phone, e.email, passwordHash, e.name, e.zone, 4, 1, 1, 0]
      );
    }
    console.log(`✅ ${employers.length} employers inserted\n`);

    // ============================================
    // SUMMARY
    // ============================================
    const summary = await query(`
      SELECT 
        (SELECT COUNT(*) FROM workers) as total_workers,
        (SELECT COUNT(*) FROM workers WHERE verification_status IN ('verified','approved')) as verified_workers,
        (SELECT COUNT(*) FROM employers) as total_employers
    `);

    console.log('📊 Test Data Summary:');
    console.log(`   Workers: ${summary.rows[0].total_workers} (${summary.rows[0].verified_workers} verified)`);
    console.log(`   Employers: ${summary.rows[0].total_employers}`);
    console.log('\n✅ Minimal seed completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Login as admin to see worker directory');
    console.log('   2. Login as employer to post jobs manually');
    console.log('   3. Login as worker to apply for jobs\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedMinimal();