import { Client } from 'pg';
import bcrypt from 'bcryptjs';

const HR_DATABASE_URL = process.env.HR_DATABASE_URL || 'postgresql://nexus:your_strong_server_password@localhost:5432/nexus_hr';

async function seed() {
  const client = new Client({
    connectionString: HR_DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✓ Connected to nexus_hr database');

    // Hash the password
    const password = 'C@sper@22032011';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert admin employees
    const admin1 = {
      id: 'admin_caspertech92',
      email: 'caspertech92@gmail.com',
      name: 'Casper Tech',
      hashedPassword,
      role: 'ADMIN',
      department: 'Management',
      isActive: true,
    };

    const admin2 = {
      id: 'admin_nexus_io',
      email: 'admin@nexus-io',
      name: 'NEXUS Admin',
      hashedPassword,
      role: 'ADMIN',
      department: 'Management',
      isActive: true,
    };

    // Insert both admins
    for (const admin of [admin1, admin2]) {
      try {
        await client.query(
          `INSERT INTO "Employee" (id, email, name, "hashedPassword", role, department, "isActive")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (email) DO UPDATE
           SET "hashedPassword" = $4, "isActive" = $7`,
          [admin.id, admin.email, admin.name, admin.hashedPassword, admin.role, admin.department, admin.isActive]
        );
        console.log(`✓ Seeded employee: ${admin.email} (${admin.role})`);
      } catch (err) {
        console.log(`⚠ Employee ${admin.email} already exists or error occurred`);
      }
    }

    const result = await client.query('SELECT COUNT(*) as count FROM "Employee"');
    console.log(`✓ Total employees in HR database: ${result.rows[0].count}`);
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
