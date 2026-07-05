declare const process:
  | { env: Record<string, string | undefined> }
  | undefined;

type AppEnv = {
  appName: string;
  appEnv: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  siteUrl: string;
};

type EnvSource = Partial<Record<keyof ImportMetaEnv, string | undefined>>;

function getEnvSource(): EnvSource {
  if (typeof import.meta.env !== 'undefined') {
    return import.meta.env;
  }

  if (typeof process !== 'undefined') {
    return process.env as EnvSource;
  }

  return {};
}

function getRequiredEnvValue(key: keyof ImportMetaEnv) {
  const value = getEnvSource()[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env: AppEnv = {
  appName: getRequiredEnvValue('VITE_APP_NAME'),
  appEnv: getRequiredEnvValue('VITE_APP_ENV') as AppEnv['appEnv'],
  apiBaseUrl: getRequiredEnvValue('VITE_API_BASE_URL'),
  siteUrl: getRequiredEnvValue('VITE_SITE_URL'),
};
