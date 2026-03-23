import { Router } from 'express';
import { z } from 'zod';

const feedbackSchema = z.object({
  connectRequestId: z.string(),
  candidateMatchId: z.string().optional(),
  sentiment: z.enum(['useful', 'weak']),
  note: z.string().optional()
});

const feedbackRouter = Router();

feedbackRouter.post('/', (req, res) => {
  const parsed = feedbackSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten()
    });
  }

  return res.status(201).json({
    success: true,
    data: parsed.data
  });
});

export default feedbackRouter;
