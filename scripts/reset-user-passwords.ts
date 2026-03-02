#!/usr/bin/env npx ts-node
/**
 * Reset passwords for users without password hashes
 *
 * This script adds bcrypt-hashed passwords to existing users who have no password set.
 * Useful for testing, password resets, or fixing accounts that lost password access.
 *
 * Usage:
 *   npx ts-node scripts/reset-user-passwords.ts
 */

import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

interface UserToUpdate {
  id: string;
  email: string;
}

const SALT_ROUNDS = 10;

async function main() {
  console.log('🔐 User Password Reset Script\n');

  // Find all users without passwords
  const usersWithoutPasswords = await prisma.user.findMany({
    where: {
      hashedPassword: null,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (usersWithoutPasswords.length === 0) {
    console.log('✅ All users already have passwords set!');
    return;
  }

  console.log(`Found ${usersWithoutPasswords.length} users without passwords:\n`);
  usersWithoutPasswords.forEach((user) => {
    console.log(`  - ${user.email}`);
  });
  console.log();

  // Hash a default password for all passwordless users
  // In production, use individual password reset emails instead
  const defaultPassword = 'TestPassword123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

  console.log(`Setting temporary password for all users...\n`);

  let successCount = 0;
  for (const user of usersWithoutPasswords) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { hashedPassword },
      });
      console.log(`  ✅ ${user.email}`);
      successCount++;
    } catch (error) {
      console.log(`  ❌ ${user.email} - Error: ${error}`);
    }
  }

  console.log(`\n✅ Password reset complete!\n`);
  console.log(`Updated: ${successCount}/${usersWithoutPasswords.length} users`);
  console.log(`\nTemporary password for all updated users: ${defaultPassword}`);
  console.log(`\n⚠️  Users should change this password immediately after login!`);
}

main()
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
