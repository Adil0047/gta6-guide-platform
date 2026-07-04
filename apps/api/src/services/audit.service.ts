import { AuditLogModel } from '@/models/AuditLog.model.js';

type CreateAuditLogInput = {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: unknown;
  ip?: string;
  userAgent?: string;
};

export async function createAuditLog(input: CreateAuditLogInput) {
  await AuditLogModel.create({
    actorId: input.actorId,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId ?? '',
    metadata: input.metadata ?? {},
    ip: input.ip ?? '',
    userAgent: input.userAgent ?? '',
  });
}

export async function listAuditLogs(limit = 50) {
  return AuditLogModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('actorId', 'name email username role')
    .lean();
}
