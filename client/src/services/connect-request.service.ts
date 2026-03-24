import { BaseApiService, type APIResponse } from './api.service';

export interface ConnectRequest {
	id: string;
	goal: string;
	requester?: string | null;
	createdAt: string;
}

export interface CreateConnectRequestInput {
	goal: string;
	requester?: string;
}

class ConnectRequestService extends BaseApiService {
	async createConnectRequest(
		input: CreateConnectRequestInput
	): Promise<ConnectRequest> {
		try {
			const response = await this.api.post<APIResponse<ConnectRequest>>(
				'/connect-requests',
				input
			);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	async getConnectRequests(): Promise<ConnectRequest[]> {
		try {
			const response = await this.api.get<APIResponse<ConnectRequest[]>>(
				'/connect-requests'
			);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	async getConnectRequest(requestId: string): Promise<ConnectRequest | null> {
		const requests = await this.getConnectRequests();
		return requests.find((request) => request.id === requestId) ?? null;
	}
}

export const connectRequestService = new ConnectRequestService();
