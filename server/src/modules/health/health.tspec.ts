import { Tspec } from 'tspec';
import { httpGetHealth } from './health.controllers.js';

export type HealthApiSpec = Tspec.DefineApiSpec<{
  tags: ['Health'];
  paths: {
    '/api/health': {
      get: {
        summary: 'Get service health status';
        handler: typeof httpGetHealth;
      };
    };
  };
}>;
