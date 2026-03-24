import { fail, ok } from '@/lib/api';
import { getSession } from '@/lib/auth/session';
import { removeSavedProfile } from '@/lib/profiles';

type RouteContext = {
  params: Promise<{
    profileId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();

  if (!session) {
    return fail('Authentication required', 401);
  }

  const { profileId } = await context.params;

  if (!profileId) {
    return fail('Profile id is required', 400);
  }

  await removeSavedProfile(session.address, profileId);
  return ok({ removed: true });
}
