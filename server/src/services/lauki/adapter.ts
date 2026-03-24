import { mockCandidates } from './mock-data.js';

export async function queryLauki(goal: string) {
  return mockCandidates.map((candidate) => ({
    ...candidate,
    relevanceHint: goal,
  }));
}

