import { Tspec } from 'tspec';
import {
  httpCreateConnectRequest,
  httpListConnectRequests,
} from './connect-requests.controllers.js';

export type ConnectRequestsApiSpec = Tspec.DefineApiSpec<{
  tags: ['Connect Requests'];
  paths: {
    '/api/connect-requests': {
      get: {
        summary: 'List saved connect requests';
        handler: typeof httpListConnectRequests;
      };
      post: {
        summary: 'Create a connect request';
        handler: typeof httpCreateConnectRequest;
      };
    };
  };
}>;
