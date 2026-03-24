import { NextRequest, NextResponse } from 'next/server';
import { preflight, withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  return withCors(
    request,
    NextResponse.json({
      success: true,
      data: {
        ok: true,
        service: 'lauki-connect-server',
        runtime: 'next',
      },
    }),
  );
}

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}
