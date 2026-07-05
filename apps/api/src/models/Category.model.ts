import { CATEGORY_ACCENT_VALUES } from '@gta6-guide/shared/content';
import mongoose, { Schema, type HydratedDocument, type InferSchemaType } from 'mongoose';

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 320,
    },
    accent: {
      type: String,
      enum: CATEGORY_ACCENT_VALUES,
      default: 'cyan',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    seo: {
      metaTitle: {
        type: String,
        default: '',
        trim: true,
        maxlength: 70,
      },
      metaDescription: {
        type: String,
        default: '',
        trim: true,
        maxlength: 170,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

categorySchema.index({ slug: 1, isActive: 1 });
categorySchema.index({ isActive: 1, order: 1, title: 1 });
categorySchema.index({ title: 'text', description: 'text' });

export type Category = InferSchemaType<typeof categorySchema>;
export type CategoryDocument = HydratedDocument<Category>;

export const CategoryModel = mongoose.model<Category>('Category', categorySchema);
