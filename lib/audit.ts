import { prisma } from '@/src/lib/prisma';

export async function auditLog(
  adminEmail: string,
  action: 'create' | 'update' | 'delete',
  entity: string,
  entityId?: string,
  detail?: string,
) {
  try {
    await prisma.log.create({
      data: { adminEmail, action, entity, entityId, detail },
    });
  } catch {
    // Audit failures must never break the main flow
  }
}
