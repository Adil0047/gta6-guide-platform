import {
  GUIDE_DIFFICULTY_VALUES,
  GUIDE_STATUS_VALUES,
  GUIDE_TYPE_VALUES,
  GUIDE_VISIBILITY_VALUES,
} from '@gta6-guide/shared/content';
import mongoose, { Schema, type HydratedDocument, type InferSchemaType, Types } from 'mongoose';

const guideSectionSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    body: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 800,
    },
  },
  {
    _id: false,
  },
);

const guideSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 320,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    sections: {
      type: [guideSectionSchema],
      default: [],
    },
    faqs: {
      type: [faqSchema],
      default: [],
    },
    categoryId: {
      type: Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    tagIds: {
      type: [String],
      default: [],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    type: {
      type: String,
      enum: GUIDE_TYPE_VALUES,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: GUIDE_DIFFICULTY_VALUES,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: GUIDE_STATUS_VALUES,
      default: 'draft',
      index: true,
    },
    visibility: {
      type: String,
      enum: GUIDE_VISIBILITY_VALUES,
      default: 'public',
      index: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    readTime: {
      type: Number,
      default: 1,
    },
    authorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reviewerId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    lastReviewedAt: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    metrics: {
      viewCount: {
        type: Number,
        default: 0,
      },
      bookmarkCount: {
        type: Number,
        default: 0,
      },
      commentCount: {
        type: Number,
        default: 0,
      },
      helpfulCount: {
        type: Number,
        default: 0,
      },
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
      canonicalUrl: {
        type: String,
        default: '',
      },
      keywords: {
        type: [String],
        default: [],
      },
      ogImage: {
        type: String,
        default: '',
      },
    },
    gameMeta: {
      missionName: {
        type: String,
        default: '',
      },
      characterNames: {
        type: [String],
        default: [],
      },
      locationNames: {
        type: [String],
        default: [],
      },
      vehicleNames: {
        type: [String],
        default: [],
      },
      weaponNames: {
        type: [String],
        default: [],
      },
      platform: {
        type: String,
        default: '',
      },
      gameVersion: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

guideSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text',
  'gameMeta.missionName': 'text',
  'gameMeta.locationNames': 'text',
  'gameMeta.vehicleNames': 'text',
  'gameMeta.characterNames': 'text',
});

guideSchema.index({ status: 1, publishedAt: -1 });
guideSchema.index({ categoryId: 1, status: 1, publishedAt: -1 });
guideSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });

export type Guide = InferSchemaType<typeof guideSchema>;
export type GuideDocument = HydratedDocument<Guide>;

export const GuideModel = mongoose.model<Guide>('Guide', guideSchema);
