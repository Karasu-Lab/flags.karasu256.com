const PRODUCTION_ORIGINS = [
  'https://karasu256.com',
  'https://accounts.karasu256.com',
  'https://auth.karasu256.com',
  'https://sso.karasu256.com',
];

const PREVIEW_ORIGINS = [
  'https://dev.karasu256.com',
  'https://dev.accounts.karasu256.com',
  'https://dev-auth.karasu256.com',
  'https://dev-sso.karasu256.com',
];

const LOCAL_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3004',
  'http://localhost:3007',
];

export type ResolvedEnv = Env & { ALLOWED_ORIGINS: string[] };

export function resolveEnv(raw: Env): ResolvedEnv {
  const appEnv: string = raw.APP_ENV;
  const allowedOrigins = appEnv === 'local' ? LOCAL_ORIGINS : appEnv === 'preview' ? PREVIEW_ORIGINS : PRODUCTION_ORIGINS;
  return { ...raw, ALLOWED_ORIGINS: allowedOrigins };
}
