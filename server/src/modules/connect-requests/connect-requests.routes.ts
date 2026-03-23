import { Router } from 'express';
import { z } from 'zod';
import { queryLauki } from '../../services/lauki/adapter.js';
import { scoreCandidates } from '../../services/ranking/score.js';

const createRequestSchema = z.object({
  goal: z.string().min(10),
  requester: z.string().optional()
});

const connectRequestsRouter = Router();

connectRequestsRouter.post('/', async (req, res) => {
  const parsed = createRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten()
    });
  }

  const candidates = await queryLauki(parsed.data.goal);
  const matches = scoreCandidates(parsed.data.goal, candidates);

  return res.status(201).json({
    success: true,
    data: {
      request: {
        id: 'request-1',
        ...parsed.data
      },
      matches
    }
  });
});

connectRequestsRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    data: []
  });
});

export default connectRequestsRouter;
