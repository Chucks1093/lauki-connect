import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import router from './modules/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { envConfig } from './config.js';

const app = express();

app.use(
  cors({
    origin: envConfig.FRONTEND_URL
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300
  })
);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Lauki Connect API'
  });
});

app.use('/api', router);
app.use(errorHandler);

export default app;
