import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../middlewares/error.middleware.js';
import {
  createConnectRequestRecord,
  findConnectRequestRecords,
} from './connect-requests.repository.js';
import {
  createConnectRequestSchema,
  type ConnectRequestResponse,
} from './connect-requests.schemas.js';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const mapConnectRequestRecordToResponse = (record: {
  id: string;
  goal: string;
  requester: string | null;
  createdAt: Date;
}): ConnectRequestResponse => ({
  id: record.id,
  goal: record.goal,
  requester: record.requester ?? undefined,
  createdAt: record.createdAt.toISOString(),
});

export const httpCreateConnectRequest: AsyncController = async (req, res, next) => {
  try {
    const validatedInput = createConnectRequestSchema.parse(req.body);
    const record = await createConnectRequestRecord(validatedInput);

    return res.status(201).json({
      success: true,
      message: 'Connect request created successfully',
      data: mapConnectRequestRecordToResponse(record),
    });
  } catch (error) {
    return next(error);
  }
};

export const httpListConnectRequests: AsyncController = async (_req, res, next) => {
  try {
    const records = await findConnectRequestRecords();

    return res.status(200).json({
      success: true,
      message: 'Connect requests fetched successfully',
      data: records.map(mapConnectRequestRecordToResponse),
    });
  } catch (error) {
    return next(error);
  }
};

export const httpGetDeferredMatches: AsyncController = async (_req, _res, next) => {
  return next(
    new ApiError(
      501,
      'Match generation belongs to the next build slice. Request submission is the active feature.',
    ),
  );
};
