import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Match } from '../../services/matches.service.ts';

type MatchCardProps = {
  requestId: string;
  match: Match;
};

export function MatchCard({ requestId, match }: MatchCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Candidate match
          </p>
          <h3 className="mt-2 font-grotesque text-2xl font-semibold text-white">{match.name}</h3>
          <p className="mt-2 text-sm text-slate-300">
            {match.role} at {match.company}
          </p>
        </div>
        <span className="inline-flex min-w-14 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-100">
          {match.score}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">{match.location}</p>
      <p className="mt-4 text-sm leading-6 text-slate-300">{match.reason}</p>
      <p className="mt-4 rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.06] p-4 text-sm leading-6 text-slate-200">
        {match.introDraft}
      </p>

      <Link
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-amber-200 transition hover:text-amber-100"
        to={`/requests/${requestId}/matches/${match.id}`}
      >
        View match detail
        <ArrowUpRight className="size-4" />
      </Link>
    </article>
  );
}
