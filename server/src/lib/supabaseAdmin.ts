import { createClient } from '@supabase/supabase-js';
import { env } from './env';

async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, retries = 2) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 200 * Math.pow(2, attempt)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Supabase fetch failed');
}

export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: fetchWithRetry,
  },
});
