import { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { getSession } from '@/lib/auth/session';
import { listSavedProfiles, saveProfile } from '@/lib/profiles';

type SaveProfileBody = {
  profile: {
    id: string;
    name: string;
    role: string;
    company: string;
    avatarUrl?: string | null;
    shortDescription?: string | null;
    walletAddress?: string | null;
    walletAgeDays?: number | null;
    walletVolumeUsd?: number | null;
    baseTxCount?: number | null;
    farcasterHandle?: string | null;
    farcasterUrl?: string | null;
    farcasterFollowerCount?: number | null;
    xHandle?: string | null;
    xUrl?: string | null;
    githubHandle?: string | null;
    githubUrl?: string | null;
    linkedinHandle?: string | null;
    linkedinUrl?: string | null;
    ensName?: string | null;
    onchainActivityGrade?: string | null;
    talentProtocolUrl?: string | null;
    talentScore?: number | null;
    contributionSummary: string;
    notableContracts: string[];
    score?: number | null;
    reason?: string | null;
    sourceUrl: string;
  };
};

export async function GET() {
  const session = await getSession();

  if (!session) {
    return fail('Authentication required', 401);
  }

  const profiles = await listSavedProfiles(session.address);
  return ok(profiles);
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return fail('Authentication required', 401);
  }

  const body = (await request.json().catch(() => null)) as SaveProfileBody | null;

  if (!body?.profile?.id || !body.profile.name) {
    return fail('A valid profile payload is required', 400);
  }

  const savedProfile = await saveProfile(session.address, body.profile);
  return ok(savedProfile, 201);
}
