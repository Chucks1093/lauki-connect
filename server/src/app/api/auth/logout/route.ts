import { NextRequest } from 'next/server';
import { ok } from '@/lib/api';
import { clearSessionCookieOnResponse } from '@/lib/auth/session';
import { preflight, withCors } from '@/lib/cors';

export async function POST(request: NextRequest) {
  const response = ok({ loggedOut: true });
  return withCors(request, clearSessionCookieOnResponse(response));
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
