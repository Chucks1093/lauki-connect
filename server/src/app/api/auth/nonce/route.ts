import { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createNonce } from '@/lib/auth/auth-store';
import { preflight, withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  try {
    const nonce = await createNonce();
    return withCors(request, ok({ nonce }));
  } catch (error) {
    return withCors(
      request,
      fail(error instanceof Error ? error.message : 'Failed to create auth nonce', 500),
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
