import AppShell from '../components/shared/AppShell';
import MatchCard from '../components/matches/MatchCard';
import type { MatchResult } from '../components/types';

const matches: MatchResult[] = [
  {
    id: '1',
    name: 'Amina Yusuf',
    role: 'Growth Operator',
    company: 'Northstar Labs',
    location: 'Lagos',
    score: 92,
    reason: 'Strong operator background, African startup context, and repeated growth work with early-stage products.',
    introDraft: 'Hi Amina, I think you should meet this founder because your growth experience fits what they are building.'
  },
  {
    id: '2',
    name: 'David Mensah',
    role: 'AI Founder',
    company: 'Signal Forge',
    location: 'Accra',
    score: 88,
    reason: 'Direct alignment with AI and emerging-market operator networks.',
    introDraft: 'Hi David, sending this intro because there looks to be strong overlap in product and network goals.'
  },
  {
    id: '3',
    name: 'Ruth Okeke',
    role: 'Product Strategist',
    company: 'Orbit Studio',
    location: 'Nairobi',
    score: 84,
    reason: 'Good collaboration fit for marketplace and network-driven products.',
    introDraft: 'Hi Ruth, sharing this introduction because your product background seems highly relevant to this request.'
  }
];

export default function MatchResultsPage() {
  return (
    <AppShell
      title="Match results"
      subtitle="These mocked results show the shape of the first ranking experience."
    >
      <div className="stack">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </AppShell>
  );
}
