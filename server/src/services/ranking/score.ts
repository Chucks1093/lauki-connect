type Candidate = {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  tags: string[];
  relevanceHint: string;
};

export function scoreCandidates(goal: string, candidates: Candidate[]) {
  const loweredGoal = goal.toLowerCase();

  return candidates
    .map(candidate => {
      const matchedTags = candidate.tags.filter(tag => loweredGoal.includes(tag));
      const score = 70 + matchedTags.length * 10;

      return {
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
        company: candidate.company,
        location: candidate.location,
        score,
        reason:
          matchedTags.length > 0
            ? `Strong overlap with ${matchedTags.join(', ')} and likely relevance to the request.`
            : 'Relevant profile based on role, region, and startup context.',
        introDraft: `Hi ${candidate.name}, I think there is a strong fit here based on your work at ${candidate.company} and the current request.`,
      };
    })
    .sort((a, b) => b.score - a.score);
}
