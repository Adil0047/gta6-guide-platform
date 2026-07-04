import mongoose, { Schema, type HydratedDocument, type InferSchemaType, Types } from 'mongoose';

const bookmarkSchema = new Schema(
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookmarkSchema.index({ userId: 1, guideId: 1 }, { unique: true });
bookmarkSchema.index({ userId: 1, createdAt: -1 });

export type Bookmark = InferSchemaType<typeof bookmarkSchema>;
export type BookmarkDocument = HydratedDocument<Bookmark>;

export const BookmarkModel = mongoose.model<Bookmark>('Bookmark', bookmarkSchema);
