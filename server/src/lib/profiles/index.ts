import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { searchProfilesWithAgent } from './agent';

export type ProfileSearchResult = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string | null;
  shortDescription?: string | null;
  ensName?: string | null;
  walletAddress?: string | null;
  walletAgeDays?: number | null;
  walletVolumeUsd?: number | null;
  baseTxCount?: number | null;
  onchainActivityGrade?: string | null;
  farcasterHandle?: string | null;
  farcasterUrl?: string | null;
  farcasterFollowerCount?: number | null;
  xHandle?: string | null;
  xUrl?: string | null;
  githubHandle?: string | null;
  githubUrl?: string | null;
  linkedinHandle?: string | null;
  linkedinUrl?: string | null;
  talentProtocolUrl?: string | null;
  talentScore?: number | null;
  contributionSummary: string;
  notableContracts: string[];
  score: number;
  reason: string;
  sourceUrl: string;
};

type SavedProfilePayload = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string | null;
  shortDescription?: string | null;
  ensName?: string | null;
  walletAddress?: string | null;
  walletAgeDays?: number | null;
  walletVolumeUsd?: number | null;
  baseTxCount?: number | null;
  onchainActivityGrade?: string | null;
  farcasterHandle?: string | null;
  farcasterUrl?: string | null;
  farcasterFollowerCount?: number | null;
  xHandle?: string | null;
  xUrl?: string | null;
  githubHandle?: string | null;
  githubUrl?: string | null;
  linkedinHandle?: string | null;
  linkedinUrl?: string | null;
  talentProtocolUrl?: string | null;
  talentScore?: number | null;
  contributionSummary: string;
  notableContracts: string[];
  score?: number | null;
  reason?: string | null;
  sourceUrl: string;
};

export async function searchProfiles(query: string): Promise<ProfileSearchResult[]> {
  return searchProfilesWithAgent(query);
}

export async function listSavedProfiles(walletAddress: string) {
  const { data, error } = await supabaseAdmin
    .from('saved_profiles')
    .select(
      'id, wallet_address, profile_id, profile_name, profile_role, profile_company, profile_score, profile_reason, profile_payload, created_at',
    )
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load saved profiles: ${error.message}`);
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    savedByAddress: item.wallet_address,
    profileId: item.profile_id,
    name: item.profile_name,
    role: item.profile_role,
    company: item.profile_company,
    avatarUrl: item.profile_payload?.avatarUrl ?? null,
    shortDescription: item.profile_payload?.shortDescription ?? null,
    ensName: item.profile_payload?.ensName ?? null,
    score: item.profile_score,
    reason: item.profile_reason,
    profileWalletAddress: item.profile_payload?.walletAddress ?? null,
    walletAgeDays: item.profile_payload?.walletAgeDays ?? null,
    walletVolumeUsd: item.profile_payload?.walletVolumeUsd ?? null,
    baseTxCount: item.profile_payload?.baseTxCount ?? null,
    onchainActivityGrade: item.profile_payload?.onchainActivityGrade ?? null,
    farcasterHandle: item.profile_payload?.farcasterHandle ?? null,
    farcasterUrl: item.profile_payload?.farcasterUrl ?? null,
    farcasterFollowerCount: item.profile_payload?.farcasterFollowerCount ?? null,
    xHandle: item.profile_payload?.xHandle ?? null,
    xUrl: item.profile_payload?.xUrl ?? null,
    githubHandle: item.profile_payload?.githubHandle ?? null,
    githubUrl: item.profile_payload?.githubUrl ?? null,
    linkedinHandle: item.profile_payload?.linkedinHandle ?? null,
    linkedinUrl: item.profile_payload?.linkedinUrl ?? null,
    talentProtocolUrl: item.profile_payload?.talentProtocolUrl ?? null,
    talentScore: item.profile_payload?.talentScore ?? null,
    contributionSummary: item.profile_payload?.contributionSummary ?? '',
    notableContracts: item.profile_payload?.notableContracts ?? [],
    sourceUrl: item.profile_payload?.sourceUrl ?? '',
    createdAt: item.created_at,
  }));
}

export async function saveProfile(walletAddress: string, profile: SavedProfilePayload) {
  const normalizedAddress = walletAddress.toLowerCase();
  const payload = {
    wallet_address: normalizedAddress,
    profile_id: profile.id,
    profile_name: profile.name,
    profile_role: profile.role,
    profile_company: profile.company,
    profile_score: profile.score ?? null,
    profile_reason: profile.reason ?? null,
    profile_payload: profile,
  };

  const { data, error } = await supabaseAdmin
    .from('saved_profiles')
    .upsert(payload, { onConflict: 'wallet_address,profile_id' })
    .select(
      'id, wallet_address, profile_id, profile_name, profile_role, profile_company, profile_score, profile_reason, profile_payload, created_at',
    )
    .single();

  if (error) {
    throw new Error(`Failed to save profile: ${error.message}`);
  }

  return {
    id: data.id,
    savedByAddress: data.wallet_address,
    profileId: data.profile_id,
    name: data.profile_name,
    role: data.profile_role,
    company: data.profile_company,
    avatarUrl: data.profile_payload?.avatarUrl ?? null,
    shortDescription: data.profile_payload?.shortDescription ?? null,
    ensName: data.profile_payload?.ensName ?? null,
    score: data.profile_score,
    reason: data.profile_reason,
    profileWalletAddress: data.profile_payload?.walletAddress ?? null,
    walletAgeDays: data.profile_payload?.walletAgeDays ?? null,
    walletVolumeUsd: data.profile_payload?.walletVolumeUsd ?? null,
    baseTxCount: data.profile_payload?.baseTxCount ?? null,
    onchainActivityGrade: data.profile_payload?.onchainActivityGrade ?? null,
    farcasterHandle: data.profile_payload?.farcasterHandle ?? null,
    farcasterUrl: data.profile_payload?.farcasterUrl ?? null,
    farcasterFollowerCount: data.profile_payload?.farcasterFollowerCount ?? null,
    xHandle: data.profile_payload?.xHandle ?? null,
    xUrl: data.profile_payload?.xUrl ?? null,
    githubHandle: data.profile_payload?.githubHandle ?? null,
    githubUrl: data.profile_payload?.githubUrl ?? null,
    linkedinHandle: data.profile_payload?.linkedinHandle ?? null,
    linkedinUrl: data.profile_payload?.linkedinUrl ?? null,
    talentProtocolUrl: data.profile_payload?.talentProtocolUrl ?? null,
    talentScore: data.profile_payload?.talentScore ?? null,
    contributionSummary: data.profile_payload?.contributionSummary ?? '',
    notableContracts: data.profile_payload?.notableContracts ?? [],
    sourceUrl: data.profile_payload?.sourceUrl ?? '',
    createdAt: data.created_at,
  };
}

export async function removeSavedProfile(walletAddress: string, profileId: string) {
  const { error } = await supabaseAdmin
    .from('saved_profiles')
    .delete()
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('profile_id', profileId);

  if (error) {
    throw new Error(`Failed to remove saved profile: ${error.message}`);
  }
}
