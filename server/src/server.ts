import app from './app.js';
import { envConfig } from './config.js';
import { logger } from './utils/logger.utils.js';
import { prisma } from './utils/prisma.utils.js';
import { runtimeState } from './utils/runtime-state.js';

async function startServer() {
  try {
    await prisma.$connect();
    runtimeState.databaseConnected = true;
    logger.info('Connected to database');
  } catch (error) {
    runtimeState.databaseConnected = false;
    console.warn('Database connection failed. Starting in degraded mode.', error);
  }

  app.listen(envConfig.PORT, () => {
    logger.info(`Lauki Connect server listening on port ${envConfig.PORT}`);
  });
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  process.exit(0);
});

startServer();
