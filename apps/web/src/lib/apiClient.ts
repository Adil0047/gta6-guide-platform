import { env } from '@/app/config/env';
import {
  clearAuthSession,
  getAccessToken,
  setAuthSession,
} from '@/features/auth/authSession';
import { type ApiErrorResponse, type ApiSuccessResponse } from '@gta6-guide/shared/api';
import { type AuthSessionDto } from '@gta6-guide/shared/dto';

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
  requiresAuth?: boolean;
  retryOnUnauthorized?: boolean;
};

function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1] ?? null;
}

function createHeaders(headers: HeadersInit | undefined, authToken: string | undefined) {
  const nextHeaders = new Headers(headers);

  if (!nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  if (authToken) {
    nextHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  const csrfToken = getCookie('gta6_csrf_token');

  if (csrfToken && !nextHeaders.has('X-CSRF-Token')) {
    nextHeaders.set('X-CSRF-Token', decodeURIComponent(csrfToken));
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

function shouldRefresh(path: string, status: number, retryOnUnauthorized: boolean | undefined) {
  return Boolean(
    status === 401 &&
      retryOnUnauthorized !== false &&
      !path.startsWith('/auth/login') &&
      !path.startsWith('/auth/register') &&
      !path.startsWith('/auth/refresh') &&
      !path.startsWith('/auth/logout'),
  );
}

async function refreshSession() {
  const response = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: createHeaders(undefined, undefined),
  });
  const payload = (await readJson(response)) as ApiSuccessResponse<AuthSessionDto> | ApiErrorResponse | null;

  if (!response.ok || !payload || payload.success === false || !payload.data) {
    clearAuthSession();
    throw new ApiError(payload?.message ?? 'Session refresh failed', response.status, payload);
  }

  setAuthSession(payload.data);

  return payload.data.accessToken;
}

async function requestEnvelope<TData, TMeta = unknown>(
  path: string,
  options: ApiClientOptions = {},
): Promise<ApiSuccessResponse<TData, TMeta>> {
  const { authToken, headers, requiresAuth, retryOnUnauthorized, ...requestOptions } = options;
  const shouldAttachStoredToken = !path.startsWith('/auth/login') && !path.startsWith('/auth/register');
  const storedToken = shouldAttachStoredToken ? getAccessToken() : null;
  const token = authToken ?? storedToken ?? undefined;
  const effectiveToken = requiresAuth && !token && retryOnUnauthorized !== false
    ? await refreshSession()
    : token;

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: createHeaders(headers, effectiveToken),
  });

  const payload = (await readJson(response)) as
    | ApiSuccessResponse<TData, TMeta>
    | ApiErrorResponse
    | null;

  if (!response.ok || payload?.success === false) {
    if (shouldRefresh(path, response.status, retryOnUnauthorized)) {
      const refreshedToken = await refreshSession();

      return requestEnvelope<TData, TMeta>(path, {
        ...options,
        authToken: refreshedToken,
        retryOnUnauthorized: false,
      });
    }

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
