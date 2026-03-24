import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import chalk from 'chalk';
import { z } from 'zod';
import { envConfig } from '../config.js';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundHandler = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  next(new ApiError(404, `Route not found: ${request.method} ${request.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    response.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues,
    });
    return;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('P')
  ) {
    response.status(400).json({
      success: false,
      message: 'Database operation failed',
      ...(envConfig.MODE === 'development' ? { error } : {}),
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({
      success: false,
      message: 'Invalid JSON format',
    });
    return;
  }

  console.error(chalk.red('ERROR'), request.method, request.originalUrl, error);

  response.status(500).json({
    success: false,
    message:
      envConfig.MODE === 'production'
        ? 'Internal server error'
        : error instanceof Error
          ? error.message
          : 'Unexpected server error',
  });
};

