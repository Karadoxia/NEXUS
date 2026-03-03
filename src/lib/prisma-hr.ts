// Temporary workaround: use raw pg client until Prisma 7 supports dual schemas properly
import { Pool as PgPool } from 'pg';

let prismaHRInstance: PgPool | null = null;

export const getPrismaHR = () => {
  if (!process.env.HR_DATABASE_URL) {
    throw new Error(
      'HR_DATABASE_URL environment variable is not set. ' +
      'This is required for employee authentication. ' +
      'Please set it in your .env or docker-compose.yml'
    );
  }
  if (!prismaHRInstance) {
    prismaHRInstance = new PgPool({
      connectionString: process.env.HR_DATABASE_URL,
    });
  }
  return prismaHRInstance;
};

// Export as prismaHR for compatibility
export const prismaHR = {
  employee: {
    findUnique: async (query: any) => {
      const pool = getPrismaHR();
      const result = await pool.query(
        'SELECT * FROM "Employee" WHERE email = $1',
        [query.where.email]
      );
      return result.rows[0] || null;
    },
    create: async (data: any) => {
      const pool = getPrismaHR();
      const { id, email, name, hashedPassword, role, department, phone, createdBy } = data.data;
      const result = await pool.query(
        `INSERT INTO "Employee" (id, email, name, "hashedPassword", role, department, phone, "createdBy", "isActive")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
         RETURNING *`,
        [id, email, name, hashedPassword, role, department, phone, createdBy]
      );
      return result.rows[0];
    },
    update: async (query: any, data: any) => {
      const pool = getPrismaHR();
      const { id } = query.where;
      const updates = [];
      const values: any[] = [];
      let paramIndex = 1;
      for (const [key, value] of Object.entries(data.data)) {
        updates.push(`"${key}" = $${paramIndex++}`);
        values.push(value);
      }
      values.push(id);
      const result = await pool.query(
        `UPDATE "Employee" SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );
      return result.rows[0];
    },
    findMany: async (query: any = {}) => {
      const pool = getPrismaHR();
      const result = await pool.query('SELECT * FROM "Employee" WHERE "isActive" = true ORDER BY "createdAt" DESC');
      return result.rows;
    },
  },
  $connect: async () => {
    // With pg.Pool, explicit connect is mostly not needed, but can optionally acquire a client
    // We implement it as no-op to satisfy the Prisma-like interface contract.
  },
  $disconnect: async () => {
    if (prismaHRInstance) {
      await prismaHRInstance.end();
      prismaHRInstance = null;
    }
  },
};
