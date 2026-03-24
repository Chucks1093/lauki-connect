import { z } from 'zod';

export const createFeedbackSchema = z.object({
  connectRequestId: z.string().min(1),
  candidateMatchId: z.string().optional(),
  sentiment: z.enum(['positive', 'negative']),
  note: z.string().optional(),
});

export type CreateFeedbackBody = z.infer<typeof createFeedbackSchema>;

export type FeedbackEventResponse = CreateFeedbackBody & {
  id: string;
  createdAt: string;
};

export type FeedbackApiResponse = {
  success: true;
  message: string;
  data: FeedbackEventResponse;
};

