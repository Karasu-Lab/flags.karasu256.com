import { Elysia } from 'elysia';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { env as cfEnv } from 'cloudflare:workers';
import { resolveEnv } from './constants';
import { handlePreflight, withCors } from './lib/cors';
import { rejectUnlistedHost } from './lib/host-gate';
import { handleGetFlag } from './routes/flags';

const env = resolveEnv(cfEnv as Env);

const app = new Elysia({ adapter: CloudflareAdapter, aot: false, normalize: 'typebox' }).get(
  '/api/flags/*',
  ({ params }) => handleGetFlag(env, params['*'])
);

export default {
  async fetch(request: Request): Promise<Response> {
    const preflight = handlePreflight(env, request);
    if (preflight) return preflight;
    const rejected = rejectUnlistedHost(env, request);
    return withCors(env, request, rejected ?? (await app.fetch(request)));
  },
};
