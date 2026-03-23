import { Router } from 'express';
import healthRouter from './health/health.routes.js';
import connectRequestsRouter from './connect-requests/connect-requests.routes.js';
import matchesRouter from './matches/matches.routes.js';
import feedbackRouter from './feedback/feedback.routes.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/connect-requests', connectRequestsRouter);
router.use('/matches', matchesRouter);
router.use('/feedback', feedbackRouter);

export default router;
