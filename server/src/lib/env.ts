import { z } from 'zod';

function readEnvValue(value: string | undefined) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('placeholder-service-role-key'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  BASE_RPC_URL: z.string().default('https://mainnet.base.org'),
  SESSION_COOKIE_NAME: z.string().default('lauki_connect_session'),
  AGENT_API_BASE: z.string().url().optional(),
});

const parsedEnv = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL:
    readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY),
  SUPABASE_SERVICE_ROLE_KEY:
    readEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY) || 'placeholder-service-role-key',
  CLIENT_ORIGIN: readEnvValue(process.env.CLIENT_ORIGIN),
  BASE_RPC_URL: readEnvValue(process.env.BASE_RPC_URL) || 'https://mainnet.base.org',
  SESSION_COOKIE_NAME: readEnvValue(process.env.SESSION_COOKIE_NAME),
  AGENT_API_BASE: readEnvValue(process.env.AGENT_API_BASE),
});

export const env = {
  supabaseUrl: parsedEnv.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableDefaultKey: parsedEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  supabaseServiceRoleKey: parsedEnv.SUPABASE_SERVICE_ROLE_KEY,
  clientOrigin: parsedEnv.CLIENT_ORIGIN,
  baseRpcUrl: parsedEnv.BASE_RPC_URL,
  sessionCookieName: parsedEnv.SESSION_COOKIE_NAME,
  agentApiBase: parsedEnv.AGENT_API_BASE,
};
