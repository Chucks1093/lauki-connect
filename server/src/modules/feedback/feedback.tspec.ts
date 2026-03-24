import { Tspec } from 'tspec';
import { httpCreateFeedback } from './feedback.controllers.js';

export type FeedbackApiSpec = Tspec.DefineApiSpec<{
  tags: ['Feedback'];
  paths: {
    '/api/feedback': {
      post: {
        summary: 'Create a feedback event for a request or match';
        handler: typeof httpCreateFeedback;
      };
    };
  };
}>;
