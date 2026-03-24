import { PrismaClient } from '@prisma/client';
import { envConfig } from '../config.js';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: envConfig.MODE === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasourceUrl: envConfig.DATABASE_URL,
  });

if (envConfig.MODE !== 'production') {
  global.prisma = prisma;
}
