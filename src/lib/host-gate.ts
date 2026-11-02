import type { ResolvedEnv } from '../constants';
import { flagResponse } from '../schemas/flag-response';

const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1'];

export function isAllowedOrigin(env: ResolvedEnv, origin: string | null): boolean {
  if (!origin) return false;
  let hostname: string;
  try {
    hostname = new URL(origin).hostname;
  } catch {
    return false;
  }
  if (hostname === env.BASE_DOMAIN || hostname.endsWith(`.${env.BASE_DOMAIN}`)) return true;
  return env.APP_ENV === 'local' && LOCAL_HOSTNAMES.includes(hostname);
}

export function rejectUnlistedHost(env: ResolvedEnv, request: Request): Response | null {
  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (isAllowedOrigin(env, source)) return null;
  return flagResponse({ ok: false, error: 'Requests are only accepted from karasu256.com hosts' }, 403);
}
