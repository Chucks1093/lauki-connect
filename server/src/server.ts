import app from './app.js';
import { envConfig } from './config.js';
import { logger } from './utils/logger.js';

app.listen(envConfig.PORT, () => {
  logger.info(`Lauki Connect server running on port ${envConfig.PORT}`);
});
