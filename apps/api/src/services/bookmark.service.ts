import { type BookmarkDto, type CreateBookmarkDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { StatusCodes } from 'http-status-codes';

import { BookmarkModel } from '@/models/Bookmark.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { AppError } from '@/utils/appError.js';
import { getDocumentId, serializeObjectIdOrDocument, toObjectId } from '@/utils/objectId.js';

type CreateBookmarkInput = CreateBookmarkDto;

type PopulatedBookmarkRecord = {
  _id?: unknown;
  id?: unknown;
  userId: unknown;
  guideId: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

function requireObjectId(value: unknown, fieldName: string) {
  const objectId = toObjectId(value);

  if (!objectId) {
    throw new AppError(`Invalid ${fieldName}`, StatusCodes.BAD_REQUEST);
  }

  return objectId;
}

function serializeBookmark(bookmark: PopulatedBookmarkRecord): BookmarkDto {
  return {
    id: getDocumentId(bookmark),
    userId: serializeObjectIdOrDocument(bookmark.userId) as BookmarkDto['userId'],
    guideId: serializeObjectIdOrDocument(bookmark.guideId) as BookmarkDto['guideId'],
    createdAt: bookmark.createdAt,
    updatedAt: bookmark.updatedAt,
  };
}

async function ensurePublicGuide(guideId: unknown) {
  const guideObjectId = requireObjectId(guideId, 'guide id');
  const guide = await GuideModel.findOne({ _id: guideObjectId, status: 'published', visibility: 'public' })
    .select('_id')
    .lean();

  if (!guide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }

  return guideObjectId;
}

export async function listBookmarks(userId: string, query: unknown) {
  const userObjectId = requireObjectId(userId, 'user id');
  const { page, limit, skip } = getPagination(query);
  const publicGuideIds = await GuideModel.find({ status: 'published', visibility: 'public' })
    .select('_id')
    .lean();
  const filter = { userId: userObjectId, guideId: { $in: publicGuideIds.map((guide) => guide._id) } };

  const [items, total] = await Promise.all([
    BookmarkModel.find(filter)
      .populate({
        path: 'guideId',
        populate: [
          { path: 'categoryId', select: 'title slug description accent' },
          { path: 'authorId', select: 'name username avatar role' },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BookmarkModel.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => serializeBookmark(item as PopulatedBookmarkRecord)),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function getBookmarkStatus(userId: string, guideId: string) {
  const userObjectId = toObjectId(userId);
  const guideObjectId = toObjectId(guideId);

  if (!userObjectId || !guideObjectId) {
    return {
      isBookmarked: false,
    };
  }

  const publicGuide = await GuideModel.findOne({ _id: guideObjectId, status: 'published', visibility: 'public' })
    .select('_id')
    .lean();

  if (!publicGuide) {
    return {
      isBookmarked: false,
    };
  }

  const bookmark = await BookmarkModel.findOne({ userId: userObjectId, guideId: guideObjectId }).select('_id').lean();

  return {
    isBookmarked: Boolean(bookmark),
  };
}

export async function createBookmark(userId: string, input: CreateBookmarkInput) {
  const userObjectId = requireObjectId(userId, 'user id');
  const guideObjectId = await ensurePublicGuide(input.guideId);

  const existingBookmark = await BookmarkModel.findOne({ userId: userObjectId, guideId: guideObjectId }).lean();

  if (existingBookmark) {
    return serializeBookmark(existingBookmark as PopulatedBookmarkRecord);
  }

  const bookmark = await BookmarkModel.create({
    userId: userObjectId,
    guideId: guideObjectId,
  });

  await GuideModel.findByIdAndUpdate(guideObjectId, {
    $inc: {
      'metrics.bookmarkCount': 1,
    },
  });

  return serializeBookmark(bookmark.toObject() as PopulatedBookmarkRecord);
}

export async function deleteBookmark(userId: string, guideId: string) {
  const userObjectId = requireObjectId(userId, 'user id');
  const guideObjectId = requireObjectId(guideId, 'guide id');
  const bookmark = await BookmarkModel.findOneAndDelete({ userId: userObjectId, guideId: guideObjectId }).lean();

  if (!bookmark) {
    throw new AppError('Bookmark not found', StatusCodes.NOT_FOUND);
  }

  await GuideModel.findByIdAndUpdate(guideObjectId, {
    $inc: {
      'metrics.bookmarkCount': -1,
    },
  });

  return serializeBookmark(bookmark as PopulatedBookmarkRecord);
}
