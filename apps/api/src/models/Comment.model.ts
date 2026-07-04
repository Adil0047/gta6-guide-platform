import { COMMENT_STATUS_VALUES } from '@gta6-guide/shared/community';
import mongoose, { Schema, type HydratedDocument, type InferSchemaType, Types } from 'mongoose';

const commentSchema = new Schema(
  {
    guideId: {
      type: Types.ObjectId,
      ref: 'Guide',
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    parentId: {
      type: Types.ObjectId,
      ref: 'Comment',
    },
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1200,
    },
    status: {
      type: String,
      enum: COMMENT_STATUS_VALUES,
      default: 'pending',
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

commentSchema.index({ guideId: 1, status: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });
commentSchema.index({ status: 1, createdAt: -1 });

export type Comment = InferSchemaType<typeof commentSchema>;
export type CommentDocument = HydratedDocument<Comment>;

export const CommentModel = mongoose.model<Comment>('Comment', commentSchema);
