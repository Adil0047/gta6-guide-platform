import { type ApiSuccessResponse } from '@gta6-guide/shared/api';
import { type Response } from 'express';

type ApiResponseOptions<TData, TMeta = unknown> = {
  response: Response;
  statusCode: number;
  message: string;
  data?: TData;
  meta?: TMeta;
};

export function sendResponse<TData, TMeta = unknown>({
  response,
  statusCode,
  message,
  data,
  meta,
}: ApiResponseOptions<TData, TMeta>) {
  const payload: ApiSuccessResponse<TData, TMeta> = {
    success: true,
    message,
    data,
    meta,
  };

  response.status(statusCode).json(payload);
}
