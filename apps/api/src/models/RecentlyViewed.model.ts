import mongoose, { Schema, type HydratedDocument, type InferSchemaType, Types } from 'mongoose';

const recentlyViewedSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    guideId: {
      type: Types.ObjectId,
      ref: 'Guide',
      required: true,
      index: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

recentlyViewedSchema.index({ userId: 1, guideId: 1 }, { unique: true });
recentlyViewedSchema.index({ userId: 1, viewedAt: -1 });

export type RecentlyViewed = InferSchemaType<typeof recentlyViewedSchema>;
export type RecentlyViewedDocument = HydratedDocument<RecentlyViewed>;

export const RecentlyViewedModel = mongoose.model<RecentlyViewed>('RecentlyViewed', recentlyViewedSchema);
