import { COMMENT_STATUSES, type CommentStatus } from '@gta6-guide/shared/community';
import { type CommentDto, type CreateCommentDto, type UpdateCommentDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { isAdminRole } from '@gta6-guide/shared/roles';
import { StatusCodes } from 'http-status-codes';

import { CommentModel } from '@/models/Comment.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { AppError } from '@/utils/appError.js';
import {
  getDocumentId,
  serializeObjectIdOrDocument,
  toObjectId,
  toObjectIdHexString,
} from '@/utils/objectId.js';

type CreateCommentInput = CreateCommentDto;
type UpdateCommentInput = UpdateCommentDto;

type CommentListQuery = {
  guideId?: string;
  status?: CommentStatus;
};

type RequestUser = {
  id: string;
  role: Parameters<typeof isAdminRole>[0];
};

type PopulatedCommentRecord = {
  _id?: unknown;
  id?: unknown;
  guideId: unknown;
  userId: unknown;
  parentId?: unknown;
  body: string;
  status: CommentStatus;
  isEdited: boolean;
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

function serializeComment(comment: PopulatedCommentRecord): CommentDto {
  return {
    id: getDocumentId(comment),
    guideId: serializeObjectIdOrDocument(comment.guideId) as CommentDto['guideId'],
    userId: serializeObjectIdOrDocument(comment.userId) as CommentDto['userId'],
    parentId: serializeObjectIdOrDocument(comment.parentId) as CommentDto['parentId'],
    body: comment.body,
    status: comment.status,
    isEdited: Boolean(comment.isEdited),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

type PopulatableQuery<TQuery> = {
  populate(path: string, select?: string): TQuery;
};

function populateCommentQuery<TQuery extends PopulatableQuery<TQuery>>(query: TQuery) {
  return query
    .populate('userId', 'name username avatar role')
    .populate('guideId', 'title slug excerpt categoryId')
    .populate('parentId', 'body status userId createdAt');
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

export async function listGuideComments(guideId: string, query: unknown) {
  const guideObjectId = await ensurePublicGuide(guideId);

  const { page, limit, skip } = getPagination(query);
  const filter = {
    guideId: guideObjectId,
    status: COMMENT_STATUSES.APPROVED,
  };

  const [items, total] = await Promise.all([
    populateCommentQuery(CommentModel.find(filter))
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => serializeComment(item as PopulatedCommentRecord)),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function listMyComments(userId: string, query: unknown) {
  const userObjectId = requireObjectId(userId, 'user id');
  const { page, limit, skip } = getPagination(query);
  const filter = { userId: userObjectId };

  const [items, total] = await Promise.all([
    populateCommentQuery(CommentModel.find(filter))
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => serializeComment(item as PopulatedCommentRecord)),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function listComments(query: unknown) {
  const { page, limit, skip } = getPagination(query);
  const parsedQuery = query as CommentListQuery;
  const filter: Record<string, unknown> = {};

  if (parsedQuery.guideId) {
    filter.guideId = requireObjectId(parsedQuery.guideId, 'guide id');
  }

  if (parsedQuery.status) {
    filter.status = parsedQuery.status;
  }

  const [items, total] = await Promise.all([
    populateCommentQuery(CommentModel.find(filter))
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => serializeComment(item as PopulatedCommentRecord)),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function createComment(userId: string, input: CreateCommentInput) {
  const userObjectId = requireObjectId(userId, 'user id');
  const guideObjectId = await ensurePublicGuide(input.guideId);
  const parentObjectId = input.parentId ? requireObjectId(input.parentId, 'parent comment id') : undefined;

  const comment = await CommentModel.create({
    userId: userObjectId,
    guideId: guideObjectId,
    parentId: parentObjectId,
    body: input.body,
    status: COMMENT_STATUSES.PENDING,
  });

  await GuideModel.findByIdAndUpdate(guideObjectId, {
    $inc: {
      'metrics.commentCount': 1,
    },
  });

  const populatedComment = await populateCommentQuery(CommentModel.findById(comment._id)).lean();

  if (!populatedComment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  return serializeComment(populatedComment as PopulatedCommentRecord);
}

export async function updateComment(id: string, user: RequestUser, input: UpdateCommentInput) {
  const commentObjectId = requireObjectId(id, 'comment id');
  const currentComment = await CommentModel.findById(commentObjectId);

  if (!currentComment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  if (toObjectIdHexString(currentComment.userId) !== user.id && !isAdminRole(user.role)) {
    throw new AppError('You can only edit your own comments', StatusCodes.FORBIDDEN);
  }

  currentComment.body = input.body;
  currentComment.isEdited = true;
  currentComment.status = COMMENT_STATUSES.PENDING;
  await currentComment.save();

  const populatedComment = await populateCommentQuery(CommentModel.findById(currentComment._id)).lean();

  if (!populatedComment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  return serializeComment(populatedComment as PopulatedCommentRecord);
}

export async function updateCommentStatus(id: string, status: CommentStatus) {
  const commentObjectId = requireObjectId(id, 'comment id');
  const comment = await populateCommentQuery(
    CommentModel.findByIdAndUpdate(
      commentObjectId,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ),
  ).lean();

  if (!comment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  return serializeComment(comment as PopulatedCommentRecord);
}

export async function deleteComment(id: string, user: RequestUser) {
  const commentObjectId = requireObjectId(id, 'comment id');
  const currentComment = await CommentModel.findById(commentObjectId).lean();

  if (!currentComment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  if (toObjectIdHexString(currentComment.userId) !== user.id && !isAdminRole(user.role)) {
    throw new AppError('You can only delete your own comments', StatusCodes.FORBIDDEN);
  }

  const comment = await CommentModel.findByIdAndDelete(commentObjectId).lean();

  if (!comment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  await GuideModel.findByIdAndUpdate(comment.guideId, {
    $inc: {
      'metrics.commentCount': -1,
    },
  });

  return serializeComment(comment as PopulatedCommentRecord);
}
