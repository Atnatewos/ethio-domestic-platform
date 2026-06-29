// File path: /scripts/setup-admin.js
// Purpose: Securely set up admin user from terminal
// Usage: node scripts/setup-admin.js

const bcrypt = require('bcryptjs');
const { query } = require('../server/lib/db');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupAdmin() {
  console.log('🔐 Admin User Setup\n');

  rl.question('Enter admin email: ', async (email) => {
    rl.question('Enter admin full name: ', async (fullName) => {
      rl.question('Enter admin password (min 6 chars): ', async (password) => {
        if (password.length < 6) {
          console.log('❌ Password must be at least 6 characters');
          rl.close();
          return;
        }

        try {
          // Hash password
          const passwordHash = await bcrypt.hash(password, 10);

          // Check if admin already exists
          const existing = await query('SELECT id FROM admins WHERE email = $1', [email]);

          if (existing.rows.length > 0) {
            // Update existing admin
            await query(
              'UPDATE admins SET password_hash = $1, full_name = $2, role = $3 WHERE email = $4',
              [passwordHash, fullName, 'super_admin', email]
            );
            console.log('✅ Admin password updated successfully!');
          } else {
            // Create new admin
            await query(
              'INSERT INTO admins (email, password_hash, full_name, role, is_active) VALUES ($1, $2, $3, $4, true)',
              [email, passwordHash, fullName, 'super_admin']
            );
            console.log('✅ Admin user created successfully!');
          }

          console.log(`\n📧 Email: ${email}`);
          console.log(`👤 Name: ${fullName}`);
          console.log(`🔑 Role: super_admin`);
          console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
          
          rl.close();
          process.exit(0);
        } catch (error) {
          console.error('❌ Error:', error.message);
          rl.close();
          process.exit(1);
        }
      });
    });
  });
}

setupAdmin();