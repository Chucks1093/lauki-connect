import { BaseApiService, type APIResponse } from './api.service';

export interface HealthResponse {
	ok: boolean;
	service: string;
	timestamp: string;
	environment?: string;
}

class HealthService extends BaseApiService {
	async getHealth(): Promise<HealthResponse> {
		try {
			const response = await this.api.get<APIResponse<HealthResponse>>('/health');
			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}
}

export const healthService = new HealthService();
