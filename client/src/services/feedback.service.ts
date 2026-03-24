import { BaseApiService, type APIResponse } from './api.service';

export interface CreateFeedbackInput {
	connectRequestId: string;
	candidateMatchId?: string;
	sentiment: 'positive' | 'negative';
	note?: string;
}

export interface FeedbackEvent {
	connectRequestId: string;
	candidateMatchId?: string;
	sentiment: 'positive' | 'negative';
	note?: string;
	createdAt: string;
}

class FeedbackService extends BaseApiService {
	async createFeedback(input: CreateFeedbackInput): Promise<FeedbackEvent> {
		try {
			const response = await this.api.post<APIResponse<FeedbackEvent>>('/feedback', input);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}
}

export const feedbackService = new FeedbackService();
