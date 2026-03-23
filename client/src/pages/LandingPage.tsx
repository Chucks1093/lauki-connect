import { Link } from 'react-router';
import AppShell from '../components/shared/AppShell';

export default function LandingPage() {
  return (
    <AppShell
      title="Relationship-aware introductions, ranked by relevance."
      subtitle="Lauki Connect helps people describe who they need, discover strong matches, and move faster with better intros."
    >
      <div className="stack">
        <p>
          Start with a request, review the best matches, and see a suggested
          intro message for each one.
        </p>
        <div className="actions">
          <Link className="button primary" to="/requests/new">
            Create request
          </Link>
          <Link className="button secondary" to="/dashboard">
            Open dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
