import { COMMENT_STATUSES } from '@gta6-guide/shared/community';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import { BookmarkModel } from '@/models/Bookmark.model.js';
import { CommentModel } from '@/models/Comment.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { RecentlyViewedModel } from '@/models/RecentlyViewed.model.js';
import { getProfile } from '@/services/user.service.js';
import { AppError } from '@/utils/appError.js';
import {
  getDocumentId,
  serializeObjectIdOrDocument,
  toObjectId,
  toObjectIdHexString,
  uniqueObjectIds,
} from '@/utils/objectId.js';

const RECENTLY_VIEWED_LIMIT = 20;
const DASHBOARD_ITEM_LIMIT = 4;

const publicGuideFilter = {
  status: 'published',
  visibility: 'public',
};

type RecentlyViewedRecord = {
  _id?: unknown;
  id?: unknown;
  userId: unknown;
  guideId: unknown;
  viewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type GuideRecord = {
  _id?: unknown;
  id?: unknown;
  categoryId?: unknown;
  tags?: string[];
};

function requireObjectId(value: unknown, fieldName: string) {
  const objectId = toObjectId(value);

  if (!objectId) {
    throw new AppError(`Invalid ${fieldName}`, StatusCodes.BAD_REQUEST);
  }

  return objectId;
}

function serializeRecentlyViewed(record: RecentlyViewedRecord) {
  return {
    id: getDocumentId(record),
    userId: serializeObjectIdOrDocument(record.userId),
    guideId: serializeObjectIdOrDocument(record.guideId),
    viewedAt: record.viewedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

async function cleanupRecentlyViewed(userId: Types.ObjectId) {
  const staleItems = await RecentlyViewedModel.find({ userId })
    .sort({ viewedAt: -1 })
    .skip(RECENTLY_VIEWED_LIMIT)
    .select('_id')
    .lean();

  if (staleItems.length > 0) {
    await RecentlyViewedModel.deleteMany({
      _id: {
        $in: staleItems.map((item) => item._id),
      },
    });
  }
}

export async function recordRecentlyViewed(userId: string, guideId: unknown) {
  const userObjectId = requireObjectId(userId, 'user id');
  const guideObjectId = requireObjectId(guideId, 'guide id');

  await RecentlyViewedModel.findOneAndUpdate(
    { userId: userObjectId, guideId: guideObjectId },
    {
      $set: {
        userId: userObjectId,
        guideId: guideObjectId,
        viewedAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  await cleanupRecentlyViewed(userObjectId);
}

export async function listRecentlyViewed(userId: unknown, limit = DASHBOARD_ITEM_LIMIT) {
  const userObjectId = requireObjectId(userId, 'user id');
  const items = await RecentlyViewedModel.find({ userId: userObjectId })
    .populate({
      path: 'guideId',
      match: publicGuideFilter,
      populate: [
        { path: 'categoryId', select: 'title slug description accent' },
        { path: 'authorId', select: 'name username avatar role' },
      ],
    })
    .sort({ viewedAt: -1 })
    .limit(limit)
    .lean();

  return items
    .filter((item) => Boolean(item.guideId))
    .map((item) => serializeRecentlyViewed(item as RecentlyViewedRecord));
}

async function getRecentBookmarks(userId: unknown) {
  const userObjectId = requireObjectId(userId, 'user id');
  const items = await BookmarkModel.find({ userId: userObjectId })
    .populate({
      path: 'guideId',
      match: publicGuideFilter,
      populate: [
        { path: 'categoryId', select: 'title slug description accent' },
        { path: 'authorId', select: 'name username avatar role' },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(DASHBOARD_ITEM_LIMIT)
    .lean();

  return items.filter((item) => Boolean(item.guideId));
}

async function getRecentComments(userId: unknown) {
  const userObjectId = requireObjectId(userId, 'user id');
  const items = await CommentModel.find({ userId: userObjectId })
    .populate('userId', 'name username avatar role')
    .populate({
      path: 'guideId',
      match: publicGuideFilter,
      populate: [
        { path: 'categoryId', select: 'title slug description accent' },
        { path: 'authorId', select: 'name username avatar role' },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(DASHBOARD_ITEM_LIMIT)
    .lean();

  return items.filter((item) => Boolean(item.guideId));
}

async function getSeedGuides(userId: unknown) {
  const userObjectId = requireObjectId(userId, 'user id');
  const [recentViews, recentBookmarks, recentComments] = await Promise.all([
    RecentlyViewedModel.find({ userId: userObjectId }).sort({ viewedAt: -1 }).limit(8).lean(),
    BookmarkModel.find({ userId: userObjectId }).sort({ createdAt: -1 }).limit(8).lean(),
    CommentModel.find({ userId: userObjectId }).sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  const seedGuideIds = uniqueObjectIds([
    ...recentViews.map((item) => item.guideId),
    ...recentBookmarks.map((item) => item.guideId),
    ...recentComments.map((item) => item.guideId),
  ]);

  if (seedGuideIds.length === 0) {
    return [];
  }

  return GuideModel.find({ _id: { $in: seedGuideIds }, ...publicGuideFilter })
    .populate('categoryId', 'title slug description accent')
    .populate('authorId', 'name username avatar role')
    .lean();
}

async function findRecommendationBatch(filter: Record<string, unknown>, excludeIds: Types.ObjectId[], limit: number) {
  if (limit <= 0) {
    return [];
  }

  return GuideModel.find({
    ...publicGuideFilter,
    ...filter,
    _id: {
      $nin: excludeIds,
    },
  })
    .populate('categoryId', 'title slug description accent')
    .populate('authorId', 'name username avatar role')
    .sort({ 'metrics.viewCount': -1, publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}

async function getRecommendations(userId: unknown) {
  const seedGuides = (await getSeedGuides(userId)) as GuideRecord[];
  const excludedIds = uniqueObjectIds(seedGuides.map((guide) => guide._id));
  const excludedIdSet = new Set(excludedIds.map((id) => id.toHexString()));
  const categoryIds = uniqueObjectIds(seedGuides.map((guide) => guide.categoryId));
  const tags = uniqueValues(seedGuides.flatMap((guide) => guide.tags ?? []));
  const recommendations: unknown[] = [];

  function addGuides(guides: GuideRecord[]) {
    guides.forEach((guide) => {
      const objectId = toObjectId(guide._id);

      if (!objectId) {
        return;
      }

      const key = objectId.toHexString();

      if (!excludedIdSet.has(key)) {
        recommendations.push(guide);
        excludedIds.push(objectId);
        excludedIdSet.add(key);
      }
    });
  }

  if (categoryIds.length > 0) {
    addGuides(
      await findRecommendationBatch({ categoryId: { $in: categoryIds } }, excludedIds, DASHBOARD_ITEM_LIMIT),
    );
  }

  if (tags.length > 0 && recommendations.length < DASHBOARD_ITEM_LIMIT) {
    addGuides(
      await findRecommendationBatch(
        { tags: { $in: tags } },
        excludedIds,
        DASHBOARD_ITEM_LIMIT - recommendations.length,
      ),
    );
  }

  if (recommendations.length < DASHBOARD_ITEM_LIMIT) {
    addGuides(await findRecommendationBatch({}, excludedIds, DASHBOARD_ITEM_LIMIT - recommendations.length));
  }

  return recommendations.slice(0, DASHBOARD_ITEM_LIMIT);
}

function getProfileCompletion(user: { avatar?: string; bio?: string; isEmailVerified?: boolean }) {
  const completedFields = [Boolean(user.avatar), Boolean(user.bio), Boolean(user.isEmailVerified)].filter(
    Boolean,
  ).length;

  return Math.round(((2 + completedFields) / 5) * 100);
}

export async function getUserDashboard(userId: string) {
  const userObjectId = requireObjectId(userId, 'user id');
  const userIdForProfile = toObjectIdHexString(userObjectId);
  const [user, totalBookmarks, totalComments, publishedComments, recentlyViewedCount] = await Promise.all([
    getProfile(userIdForProfile),
    BookmarkModel.countDocuments({ userId: userObjectId }),
    CommentModel.countDocuments({ userId: userObjectId }),
    CommentModel.countDocuments({ userId: userObjectId, status: COMMENT_STATUSES.APPROVED }),
    RecentlyViewedModel.countDocuments({ userId: userObjectId }),
  ]);

  const [recentBookmarks, recentComments, recentlyViewedGuides, recommendations] = await Promise.all([
    getRecentBookmarks(userObjectId),
    getRecentComments(userObjectId),
    listRecentlyViewed(userObjectId),
    getRecommendations(userObjectId),
  ]);

  return {
    user,
    stats: {
      totalBookmarks,
      totalComments,
      recentlyViewedCount,
      publishedCommentsCount: publishedComments,
      profileCompletion: getProfileCompletion(user),
    },
    recentBookmarks,
    recentComments,
    recentlyViewedGuides,
    recommendations,
  };
}
