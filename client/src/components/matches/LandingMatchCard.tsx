import {
  AtSign,
  Check,
  Github,
  Linkedin,
  Plus,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { makeBlockie } from '../../lib/makeBlockie.ts';
import type { ProfileMatch } from '../../services/profile.service.ts';
import { ProfileDetailDialog } from './ProfileDetailDialog.tsx';

type LandingMatchCardProps = {
  match: ProfileMatch;
  isSaved?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
};

function getFallbackSeed(match: ProfileMatch) {
  return match.walletAddress ?? match.farcasterHandle ?? match.githubHandle ?? match.id;
}

function getAvatarSource(match: ProfileMatch) {
  if (match.avatarUrl) {
    return match.avatarUrl;
  }

  return makeBlockie(getFallbackSeed(match), 8, 12);
}

function getCoverSource(match: ProfileMatch) {
  return makeBlockie(getFallbackSeed(match), 8, 20);
}

function getExperienceLabel(score: number) {
  if (score >= 88) {
    return 'Elite';
  }

  if (score >= 76) {
    return 'Strong';
  }

  if (score >= 64) {
    return 'Solid';
  }

  return 'Emerging';
}

function getRingStyle(score: number) {
  const progress = Math.min(Math.max(score, 0), 100);
  return {
    background: `conic-gradient(#ff5c16 0deg ${progress * 3.6}deg, rgba(17,17,17,0.08) ${
      progress * 3.6
    }deg 360deg)`,
  };
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function LandingMatchCard({
  match,
  isSaved = false,
  isSaving = false,
  onSave,
}: LandingMatchCardProps) {
  const socials = [
    match.farcasterUrl
      ? { key: 'farcaster', label: `fc/${match.farcasterHandle ?? 'profile'}`, href: match.farcasterUrl, icon: Sparkles }
      : null,
    match.xUrl
      ? { key: 'x', label: `@${match.xHandle ?? 'x'}`, href: match.xUrl, icon: AtSign }
      : null,
    match.githubUrl
      ? { key: 'github', label: match.githubHandle ?? 'github', href: match.githubUrl, icon: Github }
      : null,
    match.linkedinUrl
      ? { key: 'linkedin', label: match.linkedinHandle ?? 'linkedin', href: match.linkedinUrl, icon: Linkedin }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    href: string;
    icon: typeof Sparkles;
  }>;

  const statItems = [
    {
      label: 'Experience',
      value: getExperienceLabel(match.score),
      subValue: `${match.score}`,
    },
    {
      label: 'Followers',
      value:
        typeof match.farcasterFollowerCount === 'number'
          ? formatCompact(match.farcasterFollowerCount)
          : '--',
      subValue: 'Farcaster',
    },
    {
      label: 'Activity',
      value:
        typeof match.baseTxCount === 'number'
          ? formatCompact(match.baseTxCount)
          : match.onchainActivityGrade
            ? match.onchainActivityGrade
            : '--',
      subValue: 'Base',
    },
  ];

  return (
    <article className="overflow-hidden rounded-[28px] border border-black/6 bg-white p-3 shadow-[0_12px_32px_rgba(18,18,18,0.06)]">
      <div className="relative rounded-[22px] bg-neutral-50 pb-4">
        <div
          className="relative h-28 overflow-hidden rounded-[18px]"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.12)), url(${getCoverSource(
              match,
            )})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.45))]" />
          <button
            className="absolute right-3 top-3 inline-flex h-9 min-w-[92px] items-center justify-center gap-2 rounded-full bg-white px-3 text-xs font-semibold text-neutral-900 shadow-sm transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSaved || isSaving}
            onClick={onSave}
            type="button"
          >
            {isSaved ? (
              <>
                <Check className="size-4" />
                Saved
              </>
            ) : isSaving ? (
              <span className="text-xs font-semibold">Saving...</span>
            ) : (
              <>
                <Plus className="size-4" />
                Save
              </>
            )}
          </button>
        </div>

        <div className="relative -mt-10 flex justify-center">
          <div className="rounded-full p-[4px]" style={getRingStyle(match.score)}>
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white">
              <img
                alt={match.name}
                className="size-full object-cover"
                referrerPolicy="no-referrer"
                src={getAvatarSource(match)}
              />
            </div>
          </div>
        </div>

        <div className="px-4 pt-3 text-center">
          <h3 className="line-clamp-2 font-manrope text-[1.5rem] font-semibold tracking-[-0.04em] text-neutral-950">
            {match.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-neutral-600">
            {match.role} at {match.company}
          </p>
          <p className="mx-auto mt-2 max-w-[30ch] line-clamp-2 text-sm leading-6 text-neutral-500">
            {match.shortDescription ?? match.reason}
          </p>
        </div>

        <div className="mx-4 mt-4 rounded-[20px] border border-black/6 bg-white px-3 py-3 shadow-[0_8px_18px_rgba(20,20,20,0.04)]">
          <div className="grid grid-cols-3 gap-2 text-center">
            {statItems.map((item) => (
              <div key={item.label}>
                <p className="text-[1.05rem] font-semibold tracking-[-0.03em] text-neutral-950">
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500">{item.subValue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 px-4 text-xs text-neutral-600">
          <div className="inline-flex min-w-0 items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2">
            <Wallet className="size-3.5 shrink-0" />
            <span className="truncate">
              {match.walletAddress
                ? match.ensName ?? `${match.walletAddress.slice(0, 6)}...${match.walletAddress.slice(-4)}`
                : 'No wallet surfaced'}
            </span>
          </div>
          <div className="rounded-full border border-black/8 bg-white px-3 py-2 font-medium">
            {getExperienceLabel(match.score)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-4">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:-translate-y-0.5 hover:bg-neutral-50"
                href={social.href}
                key={social.key}
                rel="noreferrer"
                target="_blank"
                title={social.label}
              >
                <Icon className="size-[18px]" />
                <span>{social.label}</span>
              </a>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 px-4">
          <a
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
            href={match.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Source
          </a>
          <ProfileDetailDialog
            match={match}
            triggerClassName="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
          />
        </div>
      </div>
    </article>
  );
}
