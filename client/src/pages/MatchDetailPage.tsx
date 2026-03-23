import AppShell from '../components/shared/AppShell';

export default function MatchDetailPage() {
  return (
    <AppShell
      title="Match detail"
      subtitle="This page will eventually show richer graph context, confidence, and intro actions."
    >
      <div className="stack">
        <p>
          Suggested intro:
        </p>
        <blockquote className="quote">
          Hi, I think you should meet this person because there is a strong fit
          across role, market, and recent activity.
        </blockquote>
        <div className="actions">
          <button className="button primary" type="button">
            Mark useful
          </button>
          <button className="button secondary" type="button">
            Mark weak
          </button>
        </div>
      </div>
    </AppShell>
  );
}
