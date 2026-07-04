import { type BookmarkDto, type CreateBookmarkDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';

import { BookmarkModel } from '@/models/Bookmark.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { AppError } from '@/utils/appError.js';

type CreateBookmarkInput = CreateBookmarkDto;

type PopulatedBookmarkRecord = {
  _id?: unknown;
  id?: string;
  userId: unknown;
  guideId: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

function getRecordId(record: { _id?: unknown; id?: string }) {
  return record.id ?? String(record._id ?? '');
}

function serializeBookmark(bookmark: PopulatedBookmarkRecord): BookmarkDto {
  return {
    id: getRecordId(bookmark),
    userId: bookmark.userId as BookmarkDto['userId'],
    guideId: bookmark.guideId as BookmarkDto['guideId'],
    createdAt: bookmark.createdAt,
    updatedAt: bookmark.updatedAt,
  };
}

async function ensurePublishedGuide(guideId: string) {
  const guide = await GuideModel.findOne({ _id: guideId, status: 'published' }).select('_id').lean();

  if (!guide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }
}

export async function listBookmarks(userId: string, query: unknown) {
  const { page, limit, skip } = getPagination(query);

  const [items, total] = await Promise.all([
    BookmarkModel.find({ userId })
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
    BookmarkModel.countDocuments({ userId }),
  ]);

  return {
    items: items.map((item) => serializeBookmark(item as PopulatedBookmarkRecord)),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function getBookmarkStatus(userId: string, guideId: string) {
  const bookmark = isValidObjectId(guideId)
    ? await BookmarkModel.findOne({ userId, guideId }).select('_id').lean()
    : null;

  return {
    isBookmarked: Boolean(bookmark),
  };
}

export async function createBookmark(userId: string, input: CreateBookmarkInput) {
  await ensurePublishedGuide(input.guideId);

  const existingBookmark = await BookmarkModel.findOne({ userId, guideId: input.guideId }).lean();

  if (existingBookmark) {
    return serializeBookmark(existingBookmark as PopulatedBookmarkRecord);
  }

  const bookmark = await BookmarkModel.create({
    userId,
    guideId: input.guideId,
  });

  await GuideModel.findByIdAndUpdate(input.guideId, {
    $inc: {
      'metrics.bookmarkCount': 1,
    },
  });

  return serializeBookmark(bookmark.toObject() as PopulatedBookmarkRecord);
}

export async function deleteBookmark(userId: string, guideId: string) {
  const bookmark = await BookmarkModel.findOneAndDelete({ userId, guideId }).lean();

  if (!bookmark) {
    throw new AppError('Bookmark not found', StatusCodes.NOT_FOUND);
  }

  await GuideModel.findByIdAndUpdate(guideId, {
    $inc: {
      'metrics.bookmarkCount': -1,
    },
  });

  return serializeBookmark(bookmark as PopulatedBookmarkRecord);
}
