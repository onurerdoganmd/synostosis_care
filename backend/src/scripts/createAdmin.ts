/**
 * Create Default Admin User
 * Generates a default administrator account for initial system access
 * Phase 1 - Authentication System
 *
 * Usage: tsx src/scripts/createAdmin.ts
 */

import bcrypt from 'bcrypt';
import { createUser, findUserByUsername, clearAllUsers } from '../data/database';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Change this in production!
const ADMIN_EMAIL = 'admin@synostosis.care';
const SALT_ROUNDS = 12;

async function createAdminUser(): Promise<void> {
  try {
    console.log('🔐 Creating default admin user...\n');

    // Check if admin already exists
    const existingAdmin = findUserByUsername(ADMIN_USERNAME);

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Created: ${existingAdmin.createdAt}\n`);
      console.log('✅ No action needed - admin user is ready to use');
      return;
    }

    // Hash password
    console.log('🔒 Hashing password with bcrypt (12 rounds)...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = createUser({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('👤 Admin User Details:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   ID:       ${adminUser.id}`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email:    ${adminUser.email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role:     ${adminUser.role}`);
    console.log(`   Active:   ${adminUser.isActive}`);
    console.log(`   Created:  ${adminUser.createdAt}`);
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   1. Change the admin password immediately after first login!');
    console.log('   2. Never use default credentials in production!');
    console.log('   3. Store credentials securely\n');
    console.log('🚀 You can now login with these credentials');
    console.log('   POST /api/v1/auth/login');
    console.log('   Body: { "username": "admin", "password": "admin123" }\n');
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error);
    if (error instanceof Error) {
      console.error('   Details:', error.message);
    }
    process.exit(1);
  }
}

// Optional: Clear all users (for testing only)
async function resetUsers(): Promise<void> {
  console.log('⚠️  WARNING: Clearing all users...');
  clearAllUsers();
  console.log('✅ All users cleared\n');
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--reset')) {
  resetUsers()
    .then(() => createAdminUser())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
} else {
  createAdminUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
