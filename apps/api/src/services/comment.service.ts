import { COMMENT_STATUSES, type CommentStatus } from '@gta6-guide/shared/community';
import { type CommentDto, type CreateCommentDto, type UpdateCommentDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { isAdminRole } from '@gta6-guide/shared/roles';
import { StatusCodes } from 'http-status-codes';

import { CommentModel } from '@/models/Comment.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { AppError } from '@/utils/appError.js';

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
  id?: string;
  guideId: unknown;
  userId: unknown;
  parentId?: unknown;
  body: string;
  status: CommentStatus;
  isEdited: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

function getRecordId(record: { _id?: unknown; id?: string }) {
  return record.id ?? String(record._id ?? '');
}

function serializeComment(comment: PopulatedCommentRecord): CommentDto {
  return {
    id: getRecordId(comment),
    guideId: comment.guideId as CommentDto['guideId'],
    userId: comment.userId as CommentDto['userId'],
    parentId: comment.parentId as CommentDto['parentId'],
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

async function ensurePublishedGuide(guideId: string) {
  const guide = await GuideModel.findOne({ _id: guideId, status: 'published' }).select('_id').lean();

  if (!guide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }
}

export async function listGuideComments(guideId: string, query: unknown) {
  const { page, limit, skip } = getPagination(query);
  const filter = {
    guideId,
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
  const { page, limit, skip } = getPagination(query);
  const filter = { userId };

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
    filter.guideId = parsedQuery.guideId;
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
  await ensurePublishedGuide(input.guideId);

  const comment = await CommentModel.create({
    userId,
    guideId: input.guideId,
    parentId: input.parentId,
    body: input.body,
    status: COMMENT_STATUSES.PENDING,
  });

  await GuideModel.findByIdAndUpdate(input.guideId, {
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
  const currentComment = await CommentModel.findById(id);

  if (!currentComment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  if (String(currentComment.userId) !== user.id && !isAdminRole(user.role)) {
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
  const comment = await populateCommentQuery(
    CommentModel.findByIdAndUpdate(
      id,
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
  const currentComment = await CommentModel.findById(id).lean();

  if (!currentComment) {
    throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
  }

  if (String(currentComment.userId) !== user.id && !isAdminRole(user.role)) {
    throw new AppError('You can only delete your own comments', StatusCodes.FORBIDDEN);
  }

  const comment = await CommentModel.findByIdAndDelete(id).lean();

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
