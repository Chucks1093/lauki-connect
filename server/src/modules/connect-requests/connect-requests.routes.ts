import { Router } from 'express';
import {
  httpCreateConnectRequest,
  httpGetDeferredMatches,
  httpListConnectRequests,
} from './connect-requests.controllers.js';

const connectRequestsRouter = Router();

connectRequestsRouter.post('/', httpCreateConnectRequest);
connectRequestsRouter.get('/', httpListConnectRequests);
connectRequestsRouter.get('/:id/matches', httpGetDeferredMatches);

export default connectRequestsRouter;
