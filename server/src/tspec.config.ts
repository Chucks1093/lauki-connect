import { Tspec } from 'tspec';
import { envConfig } from './config.js';

const tspecOptions: Tspec.GenerateParams = {
  specPathGlobs: ['src/modules/**/*.tspec.ts'],
  tsconfigPath: './tsconfig.json',
  specVersion: 3,
  openapi: {
    title: 'Lauki Connect API',
    version: '0.1.0',
    description:
      'API documentation for Lauki Connect, a relationship-aware intro engine for requests, matches, and feedback.',
    servers: [
      {
        url: `http://localhost:${envConfig.PORT}`,
        description: 'Development server',
      },
      {
        url: envConfig.BACKEND_URL,
        description: 'Configured backend URL',
      },
    ],
  },
};

export default tspecOptions;

