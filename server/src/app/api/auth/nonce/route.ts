import { ok } from '@/lib/api';
import { createNonce } from '@/lib/auth/auth-store';

export async function GET() {
  const nonce = await createNonce();
  return ok({ nonce });
}
