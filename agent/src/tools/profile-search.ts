import type { AgentEnv, AgentProfileMatch } from "@/types";

type SearchOptions = {
  query: string;
  limit?: number;
  env: AgentEnv;
};

type FarcasterSearchResponse = {
  result?: {
    users?: NeynarUser[];
  };
};

type NeynarUser = {
  fid: number;
  username: string;
  display_name?: string | null;
  custody_address?: string | null;
  pfp_url?: string | null;
  follower_count?: number;
  following_count?: number;
  score?: number;
  experimental?: {
    neynar_user_score?: number;
  } | null;
  verified_addresses?: {
    eth_addresses?: string[];
    primary?: {
      eth_address?: string | null;
    } | null;
  } | null;
  verified_accounts?: Array<{
    platform?: string | null;
    username?: string | null;
  }>;
  profile?: {
    bio?: {
      text?: string | null;
    } | null;
    location?: {
      address?: {
        city?: string | null;
        country?: string | null;
        state?: string | null;
      } | null;
    } | null;
  } | null;
};

type GitHubSearchResponse = {
  items?: GitHubSearchUser[];
};

type GitHubSearchUser = {
  login: string;
  score: number;
  html_url: string;
  url: string;
  avatar_url: string;
};

type GitHubUser = {
  login: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
};

type GitHubRepo = {
  name: string;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  description: string | null;
};

type WalletSnapshot = {
  txCount: number;
  balanceEth: number;
};

type TalentProfile = {
  score?: number | null;
  url?: string | null;
};

const queryStopWords = new Set([
  "a",
  "an",
  "for",
  "find",
  "i",
  "in",
  "intro",
  "me",
  "need",
  "on",
  "or",
  "someone",
  "the",
  "to",
  "want",
  "with",
]);

const roleKeywords = [
  "builder",
  "developer",
  "engineer",
  "founder",
  "investor",
  "operator",
  "partner",
  "growth",
];

export async function searchProfileCandidates(
  options: SearchOptions,
): Promise<AgentProfileMatch[]> {
  const limit = Math.min(Math.max(options.limit ?? 5, 1), 5);
  const farcasterMatches = await searchFarcasterCandidates(options.query, limit, options.env);

  if (farcasterMatches.length > 0) {
    return farcasterMatches.slice(0, limit);
  }

  return searchGitHubCandidates(options.query, limit, options.env);
}

async function searchFarcasterCandidates(query: string, limit: number, env: AgentEnv) {
  if (!env.NEYNAR_API_KEY) {
    return [];
  }

  const searchQueries = buildProviderQueries(query);
  const dedupedUsers = new Map<number, NeynarUser>();

  for (const searchQuery of searchQueries) {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search/?q=${encodeURIComponent(searchQuery)}&limit=5`,
      {
        headers: {
          "x-api-key": env.NEYNAR_API_KEY,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.warn("Neynar user search failed", {
        query: searchQuery,
        status: response.status,
      });
      continue;
    }

    const payload = (await response.json()) as FarcasterSearchResponse;
    const users = payload.result?.users ?? [];

    for (const user of users) {
      if (!dedupedUsers.has(user.fid)) {
        dedupedUsers.set(user.fid, user);
      }
    }

    if (dedupedUsers.size >= limit * 3) {
      break;
    }
  }

  const candidates = await Promise.all(
    Array.from(dedupedUsers.values())
      .slice(0, limit * 3)
      .map((user) => mapFarcasterCandidate(user, query, env)),
  );

  return candidates
    .filter((candidate): candidate is AgentProfileMatch => candidate !== null)
    .sort((left, right) => right.score - left.score)
    .sort((left, right) => countSocialFootprint(right) - countSocialFootprint(left))
    .slice(0, limit);
}

function buildProviderQueries(query: string) {
  const tokens = getQueryTerms(query).slice(0, 4);
  const roleTerm = tokens.find((token) => roleKeywords.includes(token)) ?? "builder";
  const topicTerms = tokens.filter((token) => token !== roleTerm);
  const topicFragment = topicTerms.join(" ").trim();

  return Array.from(
    new Set(
      [
        query,
        `${roleTerm} base`,
        `${roleTerm} farcaster`,
        `${roleTerm} onchain`,
        topicFragment ? `${topicFragment} ${roleTerm}` : "",
        topicFragment ? `${topicFragment} base` : "",
        "base builder",
        "base investor",
        "base operator",
      ]
        .map((value) => value.replace(/\s+/g, " ").trim())
        .filter((value) => value.length >= 3),
    ),
  ).slice(0, 6);
}

async function mapFarcasterCandidate(
  user: NeynarUser,
  query: string,
  env: AgentEnv,
): Promise<AgentProfileMatch | null> {
  const bio = user.profile?.bio?.text?.trim() ?? "";
  const walletAddress = pickWalletAddress(user);
  const xHandle =
    user.verified_accounts?.find((account) => account.platform === "x")?.username ?? null;
  const xUrl = xHandle ? `https://x.com/${xHandle}` : null;
  const githubHandle = extractGitHubHandle(bio);
  const githubUrl = buildGitHubUrl(githubHandle);
  const linkedinUrl = extractLinkedInUrl(bio);
  const linkedinHandle = extractLinkedInHandle(linkedinUrl);
  const company = inferCompanyFromBio(bio);
  const role = inferRole(bio, query);
  const walletSnapshot = walletAddress
    ? await fetchBaseWalletSnapshot(walletAddress, env.BASE_RPC_URL)
    : null;
  const talentProfile = await fetchTalentProfile({
    env,
    walletAddress,
    farcasterHandle: user.username,
  });
  const contributionSummary = buildFarcasterContributionSummary({
    bio,
    followerCount: user.follower_count ?? 0,
    followingCount: user.following_count ?? 0,
    walletAddress,
    walletSnapshot,
  });
  const score = scoreFarcasterCandidate({
    query,
    bio,
    role,
    followerCount: user.follower_count ?? 0,
    neynarScore: user.experimental?.neynar_user_score ?? user.score ?? 0,
    txCount: walletSnapshot?.txCount ?? 0,
    talentScore: talentProfile?.score ?? 0,
  });

  if (!bio && !walletAddress) {
    return null;
  }

  return {
    id: `fc-${user.fid}`,
    name: user.display_name?.trim() || user.username,
    role,
    company,
    avatarUrl: user.pfp_url ?? null,
    shortDescription: buildShortDescription({
      role,
      bio,
      company,
      onchainActivityGrade: inferOnchainActivityGrade(walletSnapshot?.txCount ?? 0),
    }),
    ensName:
      extractEnsName(`${bio} ${user.username}`) ??
      (user.username.endsWith(".eth") ? user.username : null),
    walletAddress,
    walletAgeDays: null,
    walletVolumeUsd: null,
    baseTxCount: walletSnapshot?.txCount ?? null,
    onchainActivityGrade: inferOnchainActivityGrade(walletSnapshot?.txCount ?? 0),
    farcasterHandle: user.username,
    farcasterUrl: `https://warpcast.com/${user.username}`,
    farcasterFollowerCount: user.follower_count ?? null,
    xHandle,
    xUrl,
    githubHandle,
    githubUrl,
    linkedinHandle,
    linkedinUrl,
    talentProtocolUrl: talentProfile?.url ?? null,
    talentScore: talentProfile?.score ?? null,
    contributionSummary,
    notableContracts: extractContractSignals(bio),
    score,
    reason: buildFarcasterReason({
      query,
      bio,
      role,
      walletAddress,
      txCount: walletSnapshot?.txCount ?? 0,
      talentScore: talentProfile?.score ?? null,
    }),
    sourceUrl: `https://warpcast.com/${user.username}`,
  };
}

async function searchGitHubCandidates(query: string, limit: number, env: AgentEnv) {
  const users = await searchGitHubUsers(query, limit * 2, env);

  if (users.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    users.slice(0, limit * 2).map(async (user) => {
      const details = await fetchGitHubUser(user.url, env);

      if (!details) {
        return null;
      }

      const repos = await fetchGitHubRepos(details.login, env);
      const walletAddress = extractWalletAddress(`${details.bio ?? ""} ${details.blog ?? ""}`);
      const talentProfile = await fetchTalentProfile({
        env,
        walletAddress,
        farcasterHandle: extractFarcasterHandle(
          extractFarcasterUrl(normalizeUrl(details.blog), details.bio ?? ""),
          details.bio ?? "",
        ),
      });

      return mapGitHubCandidate(details, repos, query, user.score, talentProfile, user.avatar_url);
    }),
  );

  const candidates = results
    .filter(
      (result): result is PromiseFulfilledResult<AgentProfileMatch | null> =>
        result.status === "fulfilled",
    )
    .map((result) => result.value)
    .filter((candidate): candidate is AgentProfileMatch => candidate !== null);

  const farcasterBackedCandidates = candidates.filter((candidate) => Boolean(candidate.farcasterUrl));
  const rankedCandidates = (farcasterBackedCandidates.length > 0
    ? farcasterBackedCandidates
    : candidates
  )
    .sort((left, right) => right.score - left.score)
    .sort((left, right) => countSocialFootprint(right) - countSocialFootprint(left));

  return rankedCandidates.slice(0, limit);
}

async function searchGitHubUsers(query: string, limit: number, env: AgentEnv) {
  const queries = buildGitHubQueries(query);
  const responses = await Promise.allSettled(
    queries.map(async (searchQuery) => {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(searchQuery)}&per_page=${limit}`,
        {
          headers: buildGitHubHeaders(env),
          cache: "no-store",
        },
      );

      if (!response.ok) {
        console.warn("GitHub user search failed", {
          searchQuery,
          status: response.status,
        });
        return [];
      }

      const payload = (await response.json()) as GitHubSearchResponse;
      return payload.items ?? [];
    }),
  );

  const dedupedUsers = new Map<string, GitHubSearchUser>();

  for (const result of responses) {
    if (result.status !== "fulfilled") {
      continue;
    }

    for (const item of result.value) {
      if (!dedupedUsers.has(item.login)) {
        dedupedUsers.set(item.login, item);
      }
    }
  }

  return Array.from(dedupedUsers.values()).slice(0, limit * 2);
}

async function fetchGitHubUser(url: string, env: AgentEnv): Promise<GitHubUser | null> {
  const response = await fetch(url, {
    headers: buildGitHubHeaders(env),
    cache: "no-store",
  });

  if (!response.ok) {
    console.warn("GitHub user lookup failed", {
      url,
      status: response.status,
    });
    return null;
  }

  return (await response.json()) as GitHubUser;
}

async function fetchGitHubRepos(login: string, env: AgentEnv): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(login)}/repos?sort=updated&per_page=5`,
    {
      headers: buildGitHubHeaders(env),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as GitHubRepo[];
}

function buildGitHubHeaders(env: AgentEnv) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "LaukiConnectAgent",
  };

  if (env.GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_API_TOKEN}`;
  }

  return headers;
}

function buildGitHubQueries(query: string) {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/i)
    .filter((token) => token.length > 2 && !queryStopWords.has(token));
  const roleTerm = tokens.find((token) => roleKeywords.includes(token)) ?? "builder";
  const topicTerms = tokens
    .filter((token) => token !== roleTerm)
    .filter((token) => !["web3", "crypto", "blockchain", "onchain", "base"].includes(token))
    .slice(0, 2);
  const topicFragment = topicTerms.join(" ").trim();

  return Array.from(
    new Set(
      [
        `${roleTerm} web3 base in:bio type:user`,
        `${roleTerm} ethereum onchain in:bio type:user`,
        `${topicFragment} web3 in:bio type:user`,
        `${topicFragment} solidity ethereum in:bio type:user`,
        `web3 base builder in:bio type:user`,
      ]
        .map((value) => value.replace(/\s+/g, " ").trim())
        .filter((value) => value.length > 0),
    ),
  );
}

function mapGitHubCandidate(
  user: GitHubUser,
  repos: GitHubRepo[],
  query: string,
  searchScore: number,
  talentProfile: TalentProfile | null,
  avatarUrl: string,
): AgentProfileMatch {
  const displayName = user.name?.trim() || user.login;
  const bio = user.bio?.trim() || "Public GitHub profile matched this request.";
  const contributionSummary = buildGitHubContributionSummary(user, repos, bio);
  const blog = normalizeUrl(user.blog);
  const farcasterUrl = extractFarcasterUrl(blog, bio);
  const farcasterHandle = extractFarcasterHandle(farcasterUrl, bio);
  const xUrl = extractXUrl(blog, user.twitter_username, bio);
  const xHandle = extractXHandle(xUrl, user.twitter_username, bio);
  const walletAddress = extractWalletAddress(`${bio} ${blog ?? ""}`);
  const linkedinUrl = extractLinkedInUrl(`${bio} ${blog ?? ""}`);
  const linkedinHandle = extractLinkedInHandle(linkedinUrl);
  const role = inferRole(bio, query);
  const company = user.company?.replace(/^@/, "").trim() || "Independent";
  const repoSignals = repos
    .filter((repo) => isWeb3Repo(repo))
    .sort((left, right) => right.stargazers_count - left.stargazers_count)
    .map((repo) => repo.name)
    .slice(0, 3);
  const score = scoreGitHubCandidate({
    query,
    bio,
    role,
    searchScore,
    followers: user.followers,
    publicRepos: user.public_repos,
    web3Repos: repoSignals.length,
    talentScore: talentProfile?.score ?? 0,
  });

  return {
    id: `gh-${user.login.toLowerCase()}`,
    name: displayName,
    role,
    company,
    avatarUrl,
    shortDescription: buildShortDescription({
      role,
      bio,
      company,
      onchainActivityGrade: inferRepoBackedOnchainGrade(repos, bio),
    }),
    ensName: extractEnsName(`${bio} ${blog ?? ""}`),
    walletAddress,
    walletAgeDays: null,
    walletVolumeUsd: null,
    baseTxCount: null,
    onchainActivityGrade: inferRepoBackedOnchainGrade(repos, bio),
    farcasterHandle,
    farcasterUrl,
    farcasterFollowerCount: null,
    xHandle,
    xUrl,
    githubHandle: user.login,
    githubUrl: user.html_url,
    linkedinHandle,
    linkedinUrl,
    talentProtocolUrl: talentProfile?.url ?? null,
    talentScore: talentProfile?.score ?? null,
    contributionSummary,
    notableContracts: repoSignals,
    score,
    reason: buildGitHubReason(query, bio, role, repoSignals),
    sourceUrl: user.html_url,
  };
}

function buildGitHubContributionSummary(user: GitHubUser, repos: GitHubRepo[], bio: string) {
  const activeRepoNames = repos.slice(0, 3).map((repo) => repo.name);
  const repoFragment =
    activeRepoNames.length > 0 ? ` Recent repos: ${activeRepoNames.join(", ")}.` : "";
  const locationFragment = user.location ? ` Based in ${user.location}.` : "";

  return `${bio}${locationFragment}${repoFragment}`.trim();
}

function buildFarcasterContributionSummary(input: {
  bio: string;
  followerCount: number;
  followingCount: number;
  walletAddress: string | null;
  walletSnapshot: WalletSnapshot | null;
}) {
  const summaryParts = [];

  if (input.bio.trim().length > 0) {
    summaryParts.push(input.bio.trim());
  }

  if (input.followerCount > 0) {
    summaryParts.push(`${formatCompactNumber(input.followerCount)} Farcaster followers`);
  }

  if (input.walletAddress && input.walletSnapshot) {
    summaryParts.push(
      `${formatCompactNumber(input.walletSnapshot.txCount)} Base txs and ${input.walletSnapshot.balanceEth.toFixed(
        3,
      )} ETH balance`,
    );
  }

  if (input.followingCount > 0) {
    summaryParts.push(`${formatCompactNumber(input.followingCount)} following`);
  }

  return summaryParts.join(" • ");
}

function inferRole(bio: string, query: string) {
  const text = `${bio} ${query}`.toLowerCase();

  if (text.includes("investor") || text.includes("angel") || text.includes("vc")) {
    return "Investor";
  }

  if (
    text.includes("operator") ||
    text.includes("growth") ||
    text.includes("ecosystem") ||
    text.includes("partnership")
  ) {
    return "Operator";
  }

  if (
    text.includes("founder") ||
    text.includes("developer") ||
    text.includes("engineer") ||
    text.includes("builder") ||
    text.includes("solidity")
  ) {
    return "Builder";
  }

  return "Web3 Profile";
}

function isWeb3Repo(repo: GitHubRepo) {
  const text = `${repo.name} ${repo.description ?? ""} ${repo.language ?? ""}`.toLowerCase();
  return [
    "solidity",
    "web3",
    "base",
    "ethereum",
    "evm",
    "contract",
    "wallet",
    "onchain",
    "defi",
    "crypto",
  ].some((term) => text.includes(term));
}

function scoreGitHubCandidate(input: {
  query: string;
  bio: string;
  role: string;
  searchScore: number;
  followers: number;
  publicRepos: number;
  web3Repos: number;
  talentScore: number;
}) {
  const queryTerms = getQueryTerms(input.query);
  const haystack = `${input.bio} ${input.role}`.toLowerCase();
  const overlap = queryTerms.reduce(
    (score, term) => score + (haystack.includes(term) ? 6 : 0),
    0,
  );

  return Math.min(
    95,
    Math.round(
      34 +
        overlap +
        Math.min(input.searchScore, 18) +
        Math.min(input.followers / 20, 12) +
        Math.min(input.publicRepos / 3, 10) +
        input.web3Repos * 6 +
        Math.min(input.talentScore / 10, 10),
    ),
  );
}

function scoreFarcasterCandidate(input: {
  query: string;
  bio: string;
  role: string;
  followerCount: number;
  neynarScore: number;
  txCount: number;
  talentScore: number;
}) {
  const queryTerms = getQueryTerms(input.query);
  const haystack = `${input.bio} ${input.role}`.toLowerCase();
  const overlap = queryTerms.reduce(
    (score, term) => score + (haystack.includes(term) ? 7 : 0),
    0,
  );

  return Math.min(
    98,
    Math.round(
      40 +
        overlap +
        Math.min(input.followerCount / 25, 14) +
        Math.min(input.neynarScore / 8, 12) +
        Math.min(input.txCount / 20, 14) +
        Math.min(input.talentScore / 10, 8),
    ),
  );
}

function buildGitHubReason(query: string, bio: string, role: string, repoSignals: string[]) {
  const reasons = [];
  const matchedTerms = getQueryTerms(query).filter((term) => bio.toLowerCase().includes(term));

  if (matchedTerms.length > 0) {
    reasons.push(`Matched on ${matchedTerms.slice(0, 3).join(", ")}`);
  }

  reasons.push(`${role} signal from public GitHub bio`);

  if (repoSignals.length > 0) {
    reasons.push(`web3 repo activity in ${repoSignals.slice(0, 2).join(", ")}`);
  }

  return reasons.join(" • ");
}

function buildFarcasterReason(input: {
  query: string;
  bio: string;
  role: string;
  walletAddress: string | null;
  txCount: number;
  talentScore: number | null;
}) {
  const reasons = [];
  const matchedTerms = getQueryTerms(input.query).filter((term) =>
    input.bio.toLowerCase().includes(term),
  );

  if (matchedTerms.length > 0) {
    reasons.push(`Matched on ${matchedTerms.slice(0, 3).join(", ")}`);
  }

  reasons.push(`${input.role} signal from Farcaster bio`);

  if (input.walletAddress && input.txCount > 0) {
    reasons.push(`${formatCompactNumber(input.txCount)} Base transactions`);
  }

  if (typeof input.talentScore === "number") {
    reasons.push(`Talent score ${Math.round(input.talentScore)}`);
  }

  return reasons.join(" • ");
}

async function fetchBaseWalletSnapshot(
  walletAddress: string,
  rpcUrl = "https://mainnet.base.org",
): Promise<WalletSnapshot | null> {
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          id: 1,
          jsonrpc: "2.0",
          method: "eth_getTransactionCount",
          params: [walletAddress, "latest"],
        },
        {
          id: 2,
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
        },
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as Array<{
      id: number;
      result?: string;
    }>;
    const txCountHex = payload.find((item) => item.id === 1)?.result;
    const balanceHex = payload.find((item) => item.id === 2)?.result;

    if (!txCountHex || !balanceHex) {
      return null;
    }

    return {
      txCount: Number.parseInt(txCountHex, 16),
      balanceEth: Number(BigInt(balanceHex)) / 1e18,
    };
  } catch {
    return null;
  }
}

async function fetchTalentProfile(input: {
  env: AgentEnv;
  walletAddress: string | null;
  farcasterHandle: string | null;
}): Promise<TalentProfile | null> {
  if (!input.env.TALENT_API_KEY) {
    return null;
  }

  const searchValue = input.walletAddress ?? input.farcasterHandle;

  if (!searchValue) {
    return null;
  }

  const url = new URL("https://api.talentprotocol.com/profile");

  if (input.walletAddress) {
    url.searchParams.set("wallet", input.walletAddress);
  } else if (input.farcasterHandle) {
    url.searchParams.set("account_source", "farcaster");
    url.searchParams.set("account_identifier", input.farcasterHandle);
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-API-KEY": input.env.TALENT_API_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const score = readNumericValue(
      payload.score ??
        payload.talent_score ??
        (payload.builder_score as number | string | undefined) ??
        (payload.profile as Record<string, unknown> | undefined)?.score,
    );
    const urlValue = readStringValue(
      payload.url ??
        payload.profile_url ??
        (payload.profile as Record<string, unknown> | undefined)?.url,
    );

    if (score === null && !urlValue) {
      return null;
    }

    return {
      score,
      url: urlValue,
    };
  } catch {
    return null;
  }
}

function pickWalletAddress(user: NeynarUser) {
  return (
    user.verified_addresses?.primary?.eth_address ??
    user.verified_addresses?.eth_addresses?.[0] ??
    user.custody_address ??
    null
  );
}

function inferCompanyFromBio(bio: string) {
  const match =
    bio.match(/(?:@|at )([A-Za-z0-9._-]{2,})/) ?? bio.match(/\b(cofounder|founder) of ([A-Za-z0-9._ -]{2,})/i);

  if (!match) {
    return "Independent";
  }

  return (match[2] ?? match[1] ?? "Independent").replace(/^@/, "").trim();
}

function extractContractSignals(text: string) {
  const loweredText = text.toLowerCase();
  const contractSignals = [
    "Base",
    "Solidity",
    "Onchain",
    "DeFi",
    "Wallet",
    "Infrastructure",
  ];

  return contractSignals.filter((signal) => loweredText.includes(signal.toLowerCase())).slice(0, 3);
}

function getQueryTerms(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/i)
    .filter((term) => term.length > 2 && !queryStopWords.has(term));
}

function normalizeUrl(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return null;
  }

  if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

function extractWalletAddress(text: string) {
  const match = text.match(/0x[a-fA-F0-9]{40}/);
  return match?.[0] ?? null;
}

function extractEnsName(text: string) {
  const match = text.match(/\b[a-z0-9-]+\.eth\b/i);
  return match?.[0] ?? null;
}

function inferOnchainActivityGrade(txCount: number) {
  if (txCount >= 150) {
    return "high";
  }

  if (txCount >= 35) {
    return "medium";
  }

  if (txCount >= 1) {
    return "low";
  }

  return null;
}

function inferRepoBackedOnchainGrade(repos: GitHubRepo[], bio: string) {
  const repoHits = repos.filter((repo) => isWeb3Repo(repo)).length;
  const loweredBio = bio.toLowerCase();
  const bioHits = ["base", "onchain", "ethereum", "solidity", "evm", "web3"].filter((term) =>
    loweredBio.includes(term),
  ).length;
  return inferOnchainActivityGrade(repoHits * 20 + bioHits * 8);
}

function extractFarcasterUrl(blog: string | null, bio: string) {
  const text = `${blog ?? ""} ${bio}`;
  const match = text.match(/https?:\/\/(?:www\.)?(?:warpcast\.com|farcaster\.xyz)\/[^\s)]+/i);
  return match?.[0] ?? null;
}

function extractFarcasterHandle(url: string | null, bio: string) {
  if (url) {
    try {
      const parsed = new URL(url);
      const firstSegment = parsed.pathname.split("/").filter(Boolean)[0];
      return firstSegment || null;
    } catch {
      return null;
    }
  }

  const bioMatch = bio.match(/(?:warpcast|farcaster)[/: ]+@?([a-z0-9._-]+)/i);
  return bioMatch?.[1] ?? null;
}

function extractXUrl(blog: string | null, twitterUsername: string | null, bio: string) {
  if (twitterUsername) {
    return `https://x.com/${twitterUsername}`;
  }

  const text = `${blog ?? ""} ${bio}`;
  const match = text.match(/https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^\s)]+/i);
  return match?.[0] ?? null;
}

function extractXHandle(url: string | null, twitterUsername: string | null, bio: string) {
  if (twitterUsername) {
    return twitterUsername;
  }

  if (url) {
    try {
      const parsed = new URL(url);
      const firstSegment = parsed.pathname.split("/").filter(Boolean)[0];
      return firstSegment || null;
    } catch {
      return null;
    }
  }

  const bioMatch = bio.match(/(?:x|twitter)[/: ]+@?([a-z0-9_]+)/i);
  return bioMatch?.[1] ?? null;
}

function extractLinkedInUrl(text: string) {
  const match = text.match(/https?:\/\/(?:[\w-]+\.)?linkedin\.com\/[^\s)]+/i);
  return match?.[0] ?? null;
}

function extractLinkedInHandle(url: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? null;
  } catch {
    return null;
  }
}

function extractGitHubHandle(text: string) {
  const urlMatch = text.match(/github\.com\/([A-Za-z0-9-]+)/i);

  if (urlMatch?.[1]) {
    return urlMatch[1];
  }

  const handleMatch = text.match(/github[/: ]+@?([A-Za-z0-9-]+)/i);
  return handleMatch?.[1] ?? null;
}

function buildGitHubUrl(handle: string | null) {
  return handle ? `https://github.com/${handle}` : null;
}

function readNumericValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readStringValue(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function countSocialFootprint(profile: AgentProfileMatch) {
  return [
    profile.farcasterUrl,
    profile.xUrl,
    profile.githubUrl,
    profile.linkedinUrl,
    profile.talentProtocolUrl,
  ].filter(Boolean).length;
}

function buildShortDescription(input: {
  role: string;
  bio: string;
  company: string;
  onchainActivityGrade: string | null;
}) {
  const normalizedBio = input.bio
    .replace(/\s+/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .trim();

  if (normalizedBio.length > 0) {
    return truncateSentence(normalizedBio, 88);
  }

  const pieces = [input.role];

  if (input.company && input.company !== "Independent") {
    pieces.push(`at ${input.company}`);
  }

  if (input.onchainActivityGrade) {
    pieces.push(`with ${input.onchainActivityGrade} onchain activity`);
  }

  return truncateSentence(pieces.join(" "), 88);
}

function truncateSentence(value: string, limit: number) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trimEnd()}…`;
}
