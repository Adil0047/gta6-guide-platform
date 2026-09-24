type AppEnv = {
  appName: string;
  appEnv: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  siteUrl: string;
};

type ViteAppEnvKey = 'VITE_APP_NAME' | 'VITE_APP_ENV' | 'VITE_API_BASE_URL' | 'VITE_SITE_URL';
type EnvSource = Partial<Record<ViteAppEnvKey, string | undefined>>;

const DEFAULT_APP_NAME = 'GTA VI Guide Platform';
const DEFAULT_APP_ENV: AppEnv['appEnv'] = 'production';
const DEFAULT_API_BASE_URL = '/api/v1';

function getEnvSource(): EnvSource {
  // In Vite (dev + build) import.meta.env is injected by the bundler. In
  // non-Vite runtimes (e.g. raw `tsx` unit tests) it is undefined, so fall
  // back to an empty object — callers then use the DEFAULT_* constants
  // below. This is a defensive guard; it does not change Vite behavior.
  return (import.meta as { env?: EnvSource }).env ?? {};
}

function readEnvValue(key: ViteAppEnvKey) {
  const value = getEnvSource()[key]?.trim();

  return value ? value : undefined;
}

function getRuntimeOrigin() {
  if (typeof window === 'undefined') {
    return 'http://localhost:5173';
  }

  return window.location.origin;
}

function normalizeAppEnv(value: string | undefined): AppEnv['appEnv'] {
  if (value === 'development' || value === 'staging' || value === 'production') {
    return value;
  }

  const isDev = (import.meta as { env?: { DEV?: boolean } }).env?.DEV;
  return isDev ? 'development' : DEFAULT_APP_ENV;
}

function normalizeUrl(value: string | undefined, fallback: string) {
  return (value ?? fallback).replace(/\/$/, '');
}

export const env: AppEnv = {
  appName: readEnvValue('VITE_APP_NAME') ?? DEFAULT_APP_NAME,
  appEnv: normalizeAppEnv(readEnvValue('VITE_APP_ENV')),
  apiBaseUrl: normalizeUrl(readEnvValue('VITE_API_BASE_URL'), DEFAULT_API_BASE_URL),
  siteUrl: normalizeUrl(readEnvValue('VITE_SITE_URL'), getRuntimeOrigin()),
};
