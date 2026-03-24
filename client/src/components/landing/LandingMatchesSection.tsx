import { LandingMatchCard } from '../matches/LandingMatchCard.tsx';
import type { ProfileMatch } from '../../services/profile.service.ts';

type LandingMatchesSectionProps = {
  matches: ProfileMatch[];
  savedProfileIds: string[];
  savingProfileId: string | null;
  onSave: (profile: ProfileMatch) => void;
};

export function LandingMatchesSection({
  matches,
  savedProfileIds,
  savingProfileId,
  onSave,
}: LandingMatchesSectionProps) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">Matches</p>
          <h2 className="mt-1 font-manrope text-3xl font-semibold tracking-[-0.03em] text-neutral-900">
            Profiles that fit this request
          </h2>
        </div>
        <p className="text-sm text-neutral-500">
          {matches.length} ranked result{matches.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((match) => (
          <LandingMatchCard
            isSaved={savedProfileIds.includes(match.id)}
            isSaving={savingProfileId === match.id}
            key={match.id}
            match={match}
            onSave={() => onSave(match)}
          />
        ))}
      </div>
    </section>
  );
}
