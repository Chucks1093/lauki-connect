import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      ok: true,
      service: 'lauki-connect-server',
      runtime: 'next',
    },
  });
}
