import type { ResolvedEnv } from '../constants';
import { isAllowedOrigin } from './host-gate';

function corsHeaders(env: ResolvedEnv, origin: string | null): Record<string, string> {
  if (!origin || !isAllowedOrigin(env, origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

export function handlePreflight(env: ResolvedEnv, request: Request): Response | null {
  if (request.method !== 'OPTIONS') return null;
  return new Response(null, { status: 204, headers: corsHeaders(env, request.headers.get('origin')) });
}

export function withCors(env: ResolvedEnv, request: Request, response: Response): Response {
  const headers = corsHeaders(env, request.headers.get('origin'));
  if (Object.keys(headers).length === 0) return response;
  const copy = new Response(response.body, response);
  for (const [key, value] of Object.entries(headers)) copy.headers.set(key, value);
  return copy;
}
