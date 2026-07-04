type AppEnv = {
  appName: string;
  appEnv: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  siteUrl: string;
};

function getRequiredEnvValue(key: keyof ImportMetaEnv) {
  const value = import.meta.env[key];

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
