import { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { getSession } from '@/lib/auth/session';
import { preflight, withCors } from '@/lib/cors';
import { searchProfiles } from '@/lib/profiles';

type SearchBody = {
  query?: string;
};

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return withCors(request, fail('Authentication required', 401));
  }

  const body = (await request.json().catch(() => null)) as SearchBody | null;

  if (!body?.query || body.query.trim().length < 3) {
    return withCors(request, fail('Search query must be at least 3 characters.', 400));
  }

  try {
    const profiles = await searchProfiles(body.query.trim());
    return withCors(request, ok(profiles));
  } catch (error) {
    return withCors(
      request,
      fail(
        error instanceof Error ? error.message : 'Profile search failed unexpectedly.',
        502,
      ),
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
