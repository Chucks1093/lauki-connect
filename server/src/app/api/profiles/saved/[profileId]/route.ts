import { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { getSession } from '@/lib/auth/session';
import { preflight, withCors } from '@/lib/cors';
import { removeSavedProfile } from '@/lib/profiles';

type RouteContext = {
  params: Promise<{
    profileId: string;
  }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSession();

  if (!session) {
    return withCors(request, fail('Authentication required', 401));
  }

  const { profileId } = await context.params;

  if (!profileId) {
    return withCors(request, fail('Profile id is required', 400));
  }

  await removeSavedProfile(session.address, profileId);
  return withCors(request, ok({ removed: true }));
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
