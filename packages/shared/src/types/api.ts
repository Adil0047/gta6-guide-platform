import { type PaginationMeta } from '../pagination.js';

export type ApiSuccessResponse<TData = unknown, TMeta = unknown> = {
  success: true;
  message: string;
  data?: TData;
  meta?: TMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  details?: unknown;
  requestId?: string;
  stack?: string;
};

export type ApiResponse<TData = unknown, TMeta = unknown> =
  | ApiSuccessResponse<TData, TMeta>
  | ApiErrorResponse;

export type ApiListResponse<TItem> = ApiSuccessResponse<TItem[], PaginationMeta>;

export type ApiDataResponse<TData> = ApiSuccessResponse<TData>;
