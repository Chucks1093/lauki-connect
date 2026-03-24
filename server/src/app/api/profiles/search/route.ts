import { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { searchProfiles } from '@/lib/profiles';

type SearchBody = {
  query?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as SearchBody | null;

  if (!body?.query || body.query.trim().length < 3) {
    return fail('Search query must be at least 3 characters.', 400);
  }

  try {
    const profiles = await searchProfiles(body.query.trim());
    return ok(profiles);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : 'Profile search failed unexpectedly.',
      502,
    );
  }
}
