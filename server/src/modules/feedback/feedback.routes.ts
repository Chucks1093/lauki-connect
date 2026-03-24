import { Router } from 'express';
import { httpCreateFeedback } from './feedback.controllers.js';

const feedbackRouter = Router();

feedbackRouter.post('/', httpCreateFeedback);

export { feedbackRouter };
