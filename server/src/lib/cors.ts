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
  const configuredOrigins = [
    normalizeOrigin(env.clientOrigin),
    ...env.clientOrigins.map(origin => normalizeOrigin(origin)),
  ].filter(Boolean);

  let allowOrigin = configuredOrigins[0] ?? '';

  if (!allowOrigin && requestOrigin) {
    allowOrigin = requestOrigin;
  }

  const requestMatchesConfiguredOrigin = configuredOrigins.some(
    origin => origin === requestOrigin || isLocalhostOrigin(origin),
  );

  if (requestOrigin && (!configuredOrigins.length || requestMatchesConfiguredOrigin)) {
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
