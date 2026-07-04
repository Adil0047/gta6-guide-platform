import { env } from '@/app/config/env';
import { type ApiErrorResponse, type ApiSuccessResponse } from '@gta6-guide/shared/api';

export class ApiError extends Error {
  statusCode: number;
  payload: unknown;

  constructor(message: string, statusCode: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

type ApiClientOptions = RequestInit & {
  authToken?: string;
};

function createHeaders(headers: HeadersInit | undefined, authToken: string | undefined) {
  const nextHeaders = new Headers(headers);

  if (!nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  if (authToken) {
    nextHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  return nextHeaders;
}

async function readJson(response: Response) {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    return null;
  }

  return response.json() as Promise<unknown>;
}

async function requestEnvelope<TData, TMeta = unknown>(
  path: string,
  options: ApiClientOptions = {},
): Promise<ApiSuccessResponse<TData, TMeta>> {
  const { authToken, headers, ...requestOptions } = options;

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: createHeaders(headers, authToken),
  });

  const payload = (await readJson(response)) as
    | ApiSuccessResponse<TData, TMeta>
    | ApiErrorResponse
    | null;

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message ?? `API request failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  if (!payload) {
    throw new ApiError('API response was not valid JSON', response.status);
  }

  return payload;
}

async function request<TData>(path: string, options: ApiClientOptions = {}) {
  const payload = await requestEnvelope<TData>(path, options);

  return payload.data as TData;
}

export const apiClient = {
  get: <TResponse>(path: string, options?: ApiClientOptions) =>
    request<TResponse>(path, { ...options, method: 'GET' }),
  getEnvelope: <TResponse, TMeta = unknown>(path: string, options?: ApiClientOptions) =>
    requestEnvelope<TResponse, TMeta>(path, { ...options, method: 'GET' }),
  post: <TResponse>(path: string, body?: unknown, options?: ApiClientOptions) =>
    request<TResponse>(path, {
      ...options,
      method: 'POST',
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
  put: <TResponse>(path: string, body: unknown, options?: ApiClientOptions) =>
    request<TResponse>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  patch: <TResponse>(path: string, body: unknown, options?: ApiClientOptions) =>
    request<TResponse>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: <TResponse>(path: string, options?: ApiClientOptions) =>
    request<TResponse>(path, { ...options, method: 'DELETE' }),
};
