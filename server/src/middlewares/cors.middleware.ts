import cors from 'cors';
import { appConfig } from '../config.js';

export const corsMiddleware = () =>
  cors({
    origin: appConfig.allowedOrigins,
    credentials: true,
  });

