import AppShell from '../components/shared/AppShell';

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="A simple place to review requests, matches, and feedback as the product grows."
    >
      <ul className="stack">
        <li>1 active request</li>
        <li>3 mocked candidate matches</li>
        <li>Feedback tracking will appear here next</li>
      </ul>
    </AppShell>
  );
}
