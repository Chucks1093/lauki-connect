import { useEffect, useState } from 'react';
import { FileText, LockKeyhole } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { matchesService, type Match } from '../services/matches.service.ts';

export function MatchDetailPage() {
  const { requestId, matchId } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId || !matchId) {
      setError('Missing request or match id.');
      return;
    }

    let isMounted = true;

    matchesService
      .getMatches(requestId)
      .then((matches) => {
        if (!isMounted) {
          return;
        }

        const selectedMatch = matches.find((item) => item.id === matchId) ?? null;
        setMatch(selectedMatch);
        setError(selectedMatch ? null : 'Match not found.');
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load match detail.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [requestId, matchId]);

  return (
    <section className="grid gap-6">
      <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-amber-200" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200">
            Match detail
          </p>
        </div>
        <h2 className="mt-4 font-grotesque text-4xl font-semibold tracking-tight text-white">
          Detailed recommendation view
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          This page becomes real only after the results slice exists. Until then it should read as
          a locked follow-up step, not a fake finished feature.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/8 p-4 text-sm text-red-200">
            <div className="flex items-center gap-3">
              <LockKeyhole className="size-4" />
              <p>{error}</p>
            </div>
          </div>
        ) : null}

        {match ? (
          <div className="mt-8 space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Candidate
              </p>
              <p className="mt-3 text-base text-white">
                <strong>{match.name}</strong> is a {match.role} at {match.company}.
              </p>
              <p className="mt-2 text-sm text-slate-500">{match.location}</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Match reason
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{match.reason}</p>
            </div>

            <div className="rounded-[28px] border border-cyan-300/12 bg-cyan-400/[0.06] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
                Draft intro
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{match.introDraft}</p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-400">
            Match detail for request <strong className="text-white">{requestId}</strong> and match{' '}
            <strong className="text-white">{matchId}</strong>.
          </div>
        )}
      </div>
    </section>
  );
}
