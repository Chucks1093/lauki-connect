import { Router } from 'express';
import { httpGetHealth } from './health.controllers.js';

const healthRouter = Router();

healthRouter.get('/', httpGetHealth);

export { healthRouter };
