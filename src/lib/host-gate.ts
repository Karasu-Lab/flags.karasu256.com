import type { ResolvedEnv } from '../constants';
import { flagResponse } from '../schemas/flag-response';

function originOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(env: ResolvedEnv, value: string | null): boolean {
  const origin = originOf(value);
  return origin !== null && env.ALLOWED_ORIGINS.includes(origin);
}

export function rejectUnlistedHost(env: ResolvedEnv, request: Request): Response | null {
  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (isAllowedOrigin(env, source)) return null;
  return flagResponse({ ok: false, error: 'Requests are only accepted from allowed origins' }, 403);
}
