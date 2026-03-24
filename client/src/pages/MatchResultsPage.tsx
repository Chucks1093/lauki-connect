import { useEffect, useState } from 'react';
import { LockKeyhole, Orbit, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { MatchCard } from '../components/matches/MatchCard.tsx';
import { matchesService, type Match } from '../services/matches.service.ts';
import { ApiError } from '../services/api.service.ts';

export function MatchResultsPage() {
  const { requestId } = useParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      setError('Missing request id.');
      return;
    }

    let isMounted = true;

    matchesService.getMatches(requestId)
      .then((result) => {
        if (isMounted) {
          setMatches(result);
          setError(null);
        }
      })
      .catch((caughtError: unknown) => {
        if (isMounted) {
          if (caughtError instanceof ApiError && caughtError.status === 501) {
            setError(caughtError.message);
            return;
          }

          setError('Failed to load matches.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  return (
    <section className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200">
              <Sparkles className="size-3.5" />
              Next slice
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
              Results are not live yet
            </span>
          </div>
          <h2 className="mt-5 font-grotesque text-4xl font-semibold tracking-tight text-white">
            Ranked match results
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            This screen should stay visibly separate from the active slice until real ranking and
            explanation logic are ready.
          </p>
        </div>

        <div className="rounded-[32px] border border-cyan-300/12 bg-cyan-400/[0.06] p-6 backdrop-blur-sm sm:p-8">
          <div className="flex items-center gap-3">
            <Orbit className="size-5 text-cyan-200" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/80">
              Planned output
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {['Top candidate list', 'Match reason', 'Suggested intro draft', 'Feedback capture'].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3 text-sm text-slate-300"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[28px] border border-red-400/20 bg-red-400/8 p-5 text-sm text-red-200">
          <div className="flex items-center gap-3">
            <LockKeyhole className="size-4" />
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} requestId={requestId ?? 'unknown-request'} />
        ))}
      </div>
    </section>
  );
}
