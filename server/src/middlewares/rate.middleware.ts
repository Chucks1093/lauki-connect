import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import type { Request, Response } from 'express';
import { envConfig } from '../config.js';

export const appRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: envConfig.MODE === 'production' ? 1000 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_request: Request, response: Response) => {
    response.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: '15 minutes',
      timestamp: new Date().toISOString(),
    });
  },
});

