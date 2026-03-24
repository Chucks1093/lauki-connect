import { env } from '@/utils/env.utils';
import axios, { type AxiosError, type AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export interface APIResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface APIErrorResponse {
	success: false;
	message: string;
	code?: string;
	errors?: Array<{
		field?: string;
		message: string;
	}>;
}

export class ApiError extends Error {
	public status: number;
	public response?: APIErrorResponse;

	constructor(
		message: string,
		status: number = 500,
		response?: APIErrorResponse
	) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.response = response;
	}
}

// BASE CLASS - All services inherit from this
export class BaseApiService {
	protected api: AxiosInstance;
	protected API_URL: string;
	private ACCESS_TOKEN = 'lauki_connect_access_token';
	private REFRESH_TOKEN = 'lauki_connect_refresh_token';

	constructor() {
		this.API_URL = env.VITE_BACKEND_URL;

		this.api = axios.create({
			baseURL: this.API_URL,
			withCredentials: true,
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		this.api.interceptors.response.use(
			response => response,
			async error => {
				const originalRequest = error.config;

				if (
					error.response?.status === 401 &&
					error.response?.data?.code === 'TOKEN_EXPIRED' &&
					!originalRequest._retry
				) {
					originalRequest._retry = true;

					try {
						await this.api.post('/auth/refresh');
						return this.api(originalRequest);
					} catch (refreshError) {
						this.clearAuth();
						window.location.href = '/';
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			}
		);
	}

	public setAuthToken(token: string): void {
		Cookies.set(this.ACCESS_TOKEN, token, {
			expires: 7,
		});
	}

	protected handleError(error: unknown): ApiError {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<APIErrorResponse>;

			if (axiosError.response) {
				const status = axiosError.response.status;
				const data = axiosError.response.data;
				const message = data?.message || 'An error occurred';

				return new ApiError(message, status, data);
			} else if (axiosError.request) {
				return new ApiError('Network error - check your connection', 0);
			}
		}

		if (error instanceof Error) {
			return new ApiError(error.message, 500);
		}

		return new ApiError('Something went wrong', 500);
	}

	protected clearAuth(): void {
		Cookies.remove(this.ACCESS_TOKEN);
		Cookies.remove(this.REFRESH_TOKEN);
	}
}
