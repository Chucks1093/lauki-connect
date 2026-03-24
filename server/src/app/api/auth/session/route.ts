import { NextRequest } from 'next/server';
import { ok } from '@/lib/api';
import { getSession } from '@/lib/auth/session';
import { preflight, withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return withCors(request, ok({ authenticated: false }));
  }

  return withCors(
    request,
    ok({
      authenticated: true,
      address: session.address,
    }),
  );
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
