import {
  AtSign,
  Github,
  Linkedin,
  Sparkles,
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

function getRingStyle(score: number) {
  const progress = Math.min(Math.max(score, 0), 100);
  return {
    background: `conic-gradient(#ff5c16 0deg ${progress * 3.6}deg, rgba(17,17,17,0.08) ${
      progress * 3.6
    }deg 360deg)`,
  };
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

  return (
    <article className="overflow-hidden rounded-[28px] border border-black/6 bg-white p-4 shadow-[0_12px_32px_rgba(18,18,18,0.06)]">
      <div className="rounded-[22px] bg-neutral-50/70 p-5">
        <div className="flex justify-center">
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

        <div className="pt-4 text-center">
          <h3 className="line-clamp-2 font-manrope text-[1.35rem] font-semibold tracking-[-0.04em] text-neutral-950">
            {match.name}
          </h3>
          <p className="mx-auto mt-2 max-w-[30ch] line-clamp-2 text-sm leading-6 text-neutral-500">
            {match.shortDescription ?? match.reason}
          </p>
          {match.walletAddress ? (
            <p className="mt-3 text-xs font-medium text-neutral-400">
              {match.ensName ?? shortenAddress(match.walletAddress)}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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

        <div className="mt-5">
          <ProfileDetailDialog
            isSaved={isSaved}
            isSaving={isSaving}
            match={match}
            onSave={onSave}
            triggerClassName="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          />
        </div>
      </div>
    </article>
  );
}
