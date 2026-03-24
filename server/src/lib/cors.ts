import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

function normalizeOrigin(origin?: string | null) {
  return origin?.replace(/\/$/, '') ?? '';
}

function isLocalhostOrigin(origin: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

export function buildCorsHeaders(request: NextRequest) {
  const requestOrigin = normalizeOrigin(request.headers.get('origin'));
  const configuredOrigin = normalizeOrigin(env.clientOrigin);

  let allowOrigin = configuredOrigin;

  if (!allowOrigin && requestOrigin) {
    allowOrigin = requestOrigin;
  }

  if (
    requestOrigin &&
    (!configuredOrigin || requestOrigin === configuredOrigin || isLocalhostOrigin(configuredOrigin))
  ) {
    allowOrigin = requestOrigin;
  }

  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Origin': allowOrigin || requestOrigin || 'http://localhost:5173',
    Vary: 'Origin',
  };
}

export function withCors(request: NextRequest, response: NextResponse) {
  const headers = buildCorsHeaders(request);

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export function preflight(request: NextRequest) {
  return withCors(request, new NextResponse(null, { status: 204 }));
}
