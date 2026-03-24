import type { NextFunction, Request, Response } from 'express';
import { createFeedbackRecord } from './feedback.repository.js';
import {
  createFeedbackSchema,
  type FeedbackApiResponse,
  type FeedbackEventResponse,
} from './feedback.schemas.js';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const mapFeedbackRecordToResponse = (record: {
  id: string;
  connectRequestId: string;
  candidateMatchId: string | null;
  sentiment: string;
  note: string | null;
  createdAt: Date;
}): FeedbackEventResponse => ({
  id: record.id,
  connectRequestId: record.connectRequestId,
  candidateMatchId: record.candidateMatchId ?? undefined,
  sentiment: record.sentiment as 'positive' | 'negative',
  note: record.note ?? undefined,
  createdAt: record.createdAt.toISOString(),
});

export const httpCreateFeedback: AsyncController = async (req, res, next) => {
  try {
    const validatedInput = createFeedbackSchema.parse(req.body);
    const record = await createFeedbackRecord(validatedInput);

    return res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: mapFeedbackRecordToResponse(record),
    } satisfies FeedbackApiResponse);
  } catch (error) {
    return next(error);
  }
};

