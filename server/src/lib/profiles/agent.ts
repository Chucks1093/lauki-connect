import { env } from '@/lib/env';
import type { ProfileSearchResult } from './index';

type AgentSearchResponse = {
  success: boolean;
  message: string;
  data: ProfileSearchResult[];
};

export async function searchProfilesWithAgent(query: string): Promise<ProfileSearchResult[]> {
  if (!env.agentApiBase) {
    throw new Error('Agent API base is not configured.');
  }

  const response = await fetch(`${env.agentApiBase.replace(/\/$/, '')}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      limit: 5,
    }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as AgentSearchResponse | null;

  if (!response.ok) {
    throw new Error(payload?.message || `Agent search failed with status ${response.status}.`);
  }

  if (!payload || !payload.success || !Array.isArray(payload.data)) {
    throw new Error('Agent search returned an invalid response.');
  }

  return payload.data;
}
