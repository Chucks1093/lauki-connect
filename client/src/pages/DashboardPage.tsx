import { useEffect, useState } from 'react';
import { profileService, type SavedProfile } from '../services/profile.service.ts';
import {
  Bookmark,
  Clock3,
  Database,
  ExternalLink,
  Github,
  Sparkles,
  UserRoundSearch,
  Wallet,
} from 'lucide-react';

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200">
            Saved profiles
          </p>
          <h2 className="mt-3 font-grotesque text-4xl font-semibold tracking-tight text-white">
            Dashboard
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Keep the best investor, builder, operator, and partner matches here so the shortlist is
            always ready.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {[
            { label: 'Profiles', value: savedProfiles.length, icon: UserRoundSearch },
            { label: 'Storage', value: 'Supabase', icon: Database },
            { label: 'State', value: 'Wallet-linked', icon: Clock3 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <item.icon className="size-5 text-amber-200" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 font-grotesque text-2xl font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {savedProfiles.length === 0 ? (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm">
          <p className="font-grotesque text-2xl font-semibold text-white">No saved profiles yet</p>
          <p className="mt-3 text-sm text-slate-400">
            Search from the landing page and save the strongest profiles you want to revisit.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {savedProfiles.map((profile) => (
            <article
              key={profile.id}
              className="group rounded-[30px] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-sm transition hover:border-amber-300/20 hover:bg-slate-950/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Saved profile
                  </p>
                  <h3 className="mt-3 font-grotesque text-2xl font-semibold leading-tight text-white">
                    {profile.name}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300">
                    {profile.role} at {profile.company}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                    {profile.profileWalletAddress ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1">
                        <Wallet className="size-3.5" />
                        {profile.ensName ?? shortenAddress(profile.profileWalletAddress)}
                      </span>
                    ) : null}
                    {profile.farcasterUrl && profile.farcasterHandle ? (
                      <a
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 transition hover:border-white/20 hover:text-white"
                        href={profile.farcasterUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        fc/{profile.farcasterHandle}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                    {profile.xUrl && profile.xHandle ? (
                      <a
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 transition hover:border-white/20 hover:text-white"
                        href={profile.xUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        @{profile.xHandle}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                    {profile.githubUrl && profile.githubHandle ? (
                      <a
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 transition hover:border-white/20 hover:text-white"
                        href={profile.githubUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Github className="size-3.5" />
                        {profile.githubHandle}
                      </a>
                    ) : null}
                    {profile.talentProtocolUrl ? (
                      <a
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 transition hover:border-white/20 hover:text-white"
                        href={profile.talentProtocolUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Sparkles className="size-3.5" />
                        Talent
                      </a>
                    ) : null}
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  <Bookmark className="size-3.5" />
                </span>
              </div>
              {profile.reason ? (
                <p className="mt-5 text-sm text-slate-400">{profile.reason}</p>
              ) : null}
              {profile.contributionSummary ? (
                <p className="mt-3 text-sm text-slate-500">{profile.contributionSummary}</p>
              ) : null}
              <p className="mt-2 text-sm text-slate-500">
                {new Date(profile.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
