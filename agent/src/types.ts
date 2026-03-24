export type AgentEnv = {
  AI: Ai;
  CLOUDFLARE_AI_MODEL?: string;
  BASE_RPC_URL?: string;
  GITHUB_API_TOKEN?: string;
  NEYNAR_API_KEY?: string;
  TALENT_API_KEY?: string;
};

export type RawSearchResult = {
  title: string;
  url: string;
  snippet: string;
  source: string;
};

export type AgentProfileMatch = {
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

export type ProfileSearchAgentState = {
  lastQuery: string | null;
};
