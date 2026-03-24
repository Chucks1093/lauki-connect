import { useEffect, useState } from 'react';
import { LandingMatchCard } from '../components/matches/LandingMatchCard.tsx';
import { profileService, type SavedProfile } from '../services/profile.service.ts';
import type { ProfileMatch } from '../services/profile.service.ts';

function mapSavedProfileToMatch(profile: SavedProfile): ProfileMatch {
  return {
    id: profile.profileId,
    name: profile.name,
    role: profile.role,
    company: profile.company,
    avatarUrl: profile.avatarUrl ?? null,
    shortDescription: profile.shortDescription ?? null,
    ensName: profile.ensName ?? null,
    walletAddress: profile.profileWalletAddress ?? null,
    walletAgeDays: profile.walletAgeDays ?? null,
    walletVolumeUsd: profile.walletVolumeUsd ?? null,
    baseTxCount: profile.baseTxCount ?? null,
    onchainActivityGrade: profile.onchainActivityGrade ?? null,
    farcasterHandle: profile.farcasterHandle ?? null,
    farcasterUrl: profile.farcasterUrl ?? null,
    farcasterFollowerCount: profile.farcasterFollowerCount ?? null,
    xHandle: profile.xHandle ?? null,
    xUrl: profile.xUrl ?? null,
    githubHandle: profile.githubHandle ?? null,
    githubUrl: profile.githubUrl ?? null,
    linkedinHandle: profile.linkedinHandle ?? null,
    linkedinUrl: profile.linkedinUrl ?? null,
    talentProtocolUrl: profile.talentProtocolUrl ?? null,
    talentScore: profile.talentScore ?? null,
    contributionSummary: profile.contributionSummary,
    notableContracts: profile.notableContracts,
    score: profile.score ?? 60,
    reason: profile.reason ?? 'Saved from a previous discovery search.',
    sourceUrl: profile.sourceUrl,
  };
}

export function DashboardPage() {
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    profileService
      .getSavedProfiles()
      .then((result) => {
        if (isMounted) {
          setSavedProfiles(result);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load saved profiles.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="grid gap-6">
      <div className="rounded-[32px] border border-black/6 bg-white/72 px-5 py-7 backdrop-blur-sm sm:px-7 sm:py-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ff5c16]">
          Saved profiles
        </p>
        <h1 className="mt-3 font-manrope text-4xl font-semibold tracking-[-0.04em] text-neutral-950">
          Saved
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
          Profiles you saved earlier stay here so you can revisit the strongest builders,
          investors, operators, and partners.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {savedProfiles.length === 0 ? (
        <div className="rounded-[32px] border border-black/6 bg-white/72 p-8 text-center backdrop-blur-sm">
          <p className="font-manrope text-2xl font-semibold text-neutral-950">No saved profiles yet</p>
          <p className="mt-3 text-sm text-neutral-600">
            Search from the landing page and save the strongest profiles you want to revisit.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedProfiles.map((profile) => (
            <LandingMatchCard
              isSaved
              key={profile.id}
              match={mapSavedProfileToMatch(profile)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
