import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/lauki_connect?schema=public'),
  BACKEND_URL: z.string().url().default('http://localhost:4000'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

export const envConfig = envSchema.parse(process.env);

export const appConfig = {
  allowedOrigins: ['http://localhost:5173', 'http://localhost:3000', envConfig.FRONTEND_URL],
};
