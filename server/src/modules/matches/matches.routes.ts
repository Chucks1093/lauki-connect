import { Router } from 'express';
import { queryLauki } from '../../services/lauki/adapter.js';
import { scoreCandidates } from '../../services/ranking/score.js';

const matchesRouter = Router();

matchesRouter.get('/:requestId', async (_req, res) => {
  const goal = 'I want introductions to AI founders and operators building in Africa.';
  const candidates = await queryLauki(goal);
  const matches = scoreCandidates(goal, candidates);

  res.json({
    success: true,
    data: matches
  });
});

export default matchesRouter;
