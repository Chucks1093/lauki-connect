import express, { type RequestHandler } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { TspecDocsMiddleware } from 'tspec';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import { appRateLimit } from './middlewares/rate.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import router from './modules/index.js';
import tspecOptions from './tspec.config.js';
import { envConfig } from './config.js';

const app = express();

app.set('trust proxy', 1);
app.use(corsMiddleware());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(appRateLimit);

let docsReady = false;

try {
  const middlewares = await TspecDocsMiddleware(tspecOptions);
  app.use('/api-docs', ...(middlewares as unknown as RequestHandler[]));
  docsReady = true;
  console.log('[info] API docs available at /api-docs');
} catch (error) {
  console.error('Failed to setup API docs:', error);
}

if (!docsReady) {
  app.get('/api-docs', (_request, response) => {
    response.status(503).json({
      message: 'API docs are unavailable during startup.',
    });
  });
}

app.get('/', (_request, response) => {
  response.redirect(docsReady ? '/api-docs' : '/api/health');
});

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
