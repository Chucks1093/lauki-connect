import { NextRequest } from 'next/server';
import { ok } from '@/lib/api';
import { createNonce } from '@/lib/auth/auth-store';
import { preflight, withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  const nonce = await createNonce();
  return withCors(request, ok({ nonce }));
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
