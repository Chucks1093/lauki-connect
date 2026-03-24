import { BaseApiService, type APIResponse } from './api.service';

export interface Match {
	id: string;
	name: string;
	role: string;
	company: string;
	location: string;
	score: number;
	reason: string;
	introDraft: string;
}

class MatchesService extends BaseApiService {
	async getMatches(requestId: string): Promise<Match[]> {
		try {
			const response = await this.api.get<APIResponse<Match[]>>(
				`/connect-requests/${requestId}/matches`
			);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}
}

export const matchesService = new MatchesService();
