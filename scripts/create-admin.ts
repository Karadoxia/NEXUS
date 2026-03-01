import { prisma } from '@/src/lib/prisma';
import * as bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'caspertech92@gmail.com' },
    });

    if (existingAdmin) {
      if (existingAdmin.isAdmin) {
        console.log('✅ Admin account already exists: caspertech92@gmail.com');
      } else {
        console.log('⚠️ User exists but is not admin. Updating...');
        await prisma.user.update({
          where: { email: 'caspertech92@gmail.com' },
          data: { isAdmin: true },
        });
        console.log('✅ Updated to admin account');
      }
      return;
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'caspertech92@gmail.com',
        name: 'Admin',
        isAdmin: true,
      },
    });

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('Admin Credentials:');
    console.log('─────────────────────────────────────');
    console.log(`Email:    caspertech92@gmail.com`);
    console.log(`Password: C@sper@22032011`);
    console.log('─────────────────────────────────────');
    console.log('');
    console.log('User ID:', adminUser.id);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
