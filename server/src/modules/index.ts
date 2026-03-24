import { Router } from 'express';
import connectRequestsRouter from './connect-requests/connect-requests.routes.js';
import { feedbackRouter } from './feedback/feedback.routes.js';
import { healthRouter } from './health/health.routes.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/connect-requests', connectRequestsRouter);
router.use('/feedback', feedbackRouter);

export default router;
