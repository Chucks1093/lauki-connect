import AppShell from '../components/shared/AppShell';
import RequestForm from '../components/requests/RequestForm';

export default function NewRequestPage() {
  return (
    <AppShell
      title="New request"
      subtitle="Describe the person, collaborator, operator, founder, or opportunity you want to find."
    >
      <RequestForm />
    </AppShell>
  );
}
