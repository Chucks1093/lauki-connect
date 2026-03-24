import { prisma } from '../../utils/prisma.utils.js';
import type { CreateFeedbackBody } from './feedback.schemas.js';

export const createFeedbackRecord = async (input: CreateFeedbackBody) => {
  return prisma.feedbackEvent.create({
    data: {
      connectRequestId: input.connectRequestId,
      candidateMatchId: input.candidateMatchId || null,
      sentiment: input.sentiment,
      note: input.note || null,
    },
  });
};

