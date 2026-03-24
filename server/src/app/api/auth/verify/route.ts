import { NextRequest } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { fail, ok } from '@/lib/api';
import { consumeNonce } from '@/lib/auth/auth-store';
import { setSessionCookieOnResponse } from '@/lib/auth/session';
import { preflight, withCors } from '@/lib/cors';
import { env } from '@/lib/env';

const client = createPublicClient({
  chain: base,
  transport: http(env.baseRpcUrl),
});

type VerifyBody = {
  address?: string;
  message?: string;
  signature?: string;
};

function extractNonce(message: string) {
  const inlineNonce = message.match(/Nonce:\s*(\w+)/i)?.[1];
  if (inlineNonce) {
    return inlineNonce;
  }

  return message.match(/at\s+(\w{32,})$/i)?.[1] ?? null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as VerifyBody | null;

  if (!body?.address || !body.message || !body.signature) {
    return withCors(request, fail('Missing required auth payload', 400));
  }

  const nonce = extractNonce(body.message);
  if (!nonce || !(await consumeNonce(nonce))) {
    return withCors(request, fail('Invalid or reused nonce', 401));
  }

  const valid = await client.verifyMessage({
    address: body.address as `0x${string}`,
    message: body.message,
    signature: body.signature as `0x${string}`,
  });

  if (!valid) {
    return withCors(request, fail('Invalid signature', 401));
  }

  const response = ok({ address: body.address.toLowerCase() });
  return withCors(request, setSessionCookieOnResponse(response, body.address.toLowerCase()));
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
