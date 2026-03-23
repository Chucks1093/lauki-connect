import { Link } from 'react-router';
import type { MatchResult } from '../types';

type MatchCardProps = {
  match: MatchResult;
};

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <h3>{match.name}</h3>
          <p className="muted">
            {match.role} at {match.company}
          </p>
        </div>
        <strong>{match.score}</strong>
      </div>
      <p>{match.reason}</p>
      <Link className="button secondary" to={`/matches/${match.id}`}>
        View intro details
      </Link>
    </article>
  );
}
