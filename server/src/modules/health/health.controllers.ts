import type { NextFunction, Request, Response } from 'express';
import { runtimeState } from '../../utils/runtime-state.js';
import type { HealthApiResponse } from './health.schemas.js';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const httpGetHealth: AsyncController = async (_req, res, _next) => {
  return res.status(200).json({
    success: true,
    message: 'Health check successful',
    data: {
      ok: true,
      service: 'lauki-connect-server',
      timestamp: new Date().toISOString(),
      databaseConnected: runtimeState.databaseConnected,
    },
  } satisfies HealthApiResponse);
};

