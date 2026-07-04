import mongoose, { Schema, type HydratedDocument, type InferSchemaType, Types } from 'mongoose';

const auditLogSchema = new Schema(
  {
    actorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    resourceId: {
      type: String,
      default: '',
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

auditLogSchema.index({ createdAt: -1 });

export type AuditLog = InferSchemaType<typeof auditLogSchema>;
export type AuditLogDocument = HydratedDocument<AuditLog>;

export const AuditLogModel = mongoose.model<AuditLog>('AuditLog', auditLogSchema);
