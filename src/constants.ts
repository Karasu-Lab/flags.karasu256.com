import { z } from 'zod';

const envSchema = z.object({
  BASE_DOMAIN: z.string().default('karasu256.com'),
});

export type ResolvedEnv = Env & z.infer<typeof envSchema>;

export function resolveEnv(raw: Env): ResolvedEnv {
  return { ...raw, ...envSchema.parse(raw) };
}
