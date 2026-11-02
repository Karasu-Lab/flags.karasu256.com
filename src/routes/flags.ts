import { z } from 'zod';
import type { ResolvedEnv } from '../constants';
import { flagResponse } from '../schemas/flag-response';

const flagPathSchema = z.string().regex(/^[A-Za-z0-9]+(\/[A-Za-z0-9]+)*$/);

export async function handleGetFlag(env: ResolvedEnv, pathtoflags: string): Promise<Response> {
  const parsed = flagPathSchema.safeParse(pathtoflags);
  if (!parsed.success) return flagResponse({ ok: false, error: 'Invalid flag path' }, 400);

  try {
    const details = await env.FLAGS.getBooleanDetails(parsed.data.split('/').join('-'), false);
    if (details.errorCode === 'FLAG_NOT_FOUND') return flagResponse({ ok: false, error: 'Flag not found' }, 404);
    if (details.errorCode) return flagResponse({ ok: false, error: 'Failed to evaluate the flag' }, 500);
    return flagResponse({ ok: true, value: details.value, type: 'boolean' });
  } catch {
    return flagResponse({ ok: false, error: 'Failed to evaluate the flag' }, 500);
  }
}
