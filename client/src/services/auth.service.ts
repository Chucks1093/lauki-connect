import { BaseApiService, type APIResponse } from './api.service';

export interface AuthNonceResponse {
  nonce: string;
}

export interface VerifyAuthInput {
  address: string;
  message: string;
  signature: string;
}

export interface VerifyAuthResponse {
  address: string;
}

export interface AuthSessionResponse {
  authenticated: boolean;
  address?: string;
}

export interface AuthLogoutResponse {
  loggedOut: boolean;
}

class AuthService extends BaseApiService {
  async getNonce(): Promise<AuthNonceResponse> {
    try {
      const response = await this.api.get<APIResponse<AuthNonceResponse>>('/auth/nonce');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verify(input: VerifyAuthInput): Promise<VerifyAuthResponse> {
    try {
      const response = await this.api.post<APIResponse<VerifyAuthResponse>>('/auth/verify', input);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSession(): Promise<AuthSessionResponse> {
    try {
      const response = await this.api.get<APIResponse<AuthSessionResponse>>('/auth/session');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<AuthLogoutResponse> {
    try {
      const response = await this.api.post<APIResponse<AuthLogoutResponse>>('/auth/logout');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const authService = new AuthService();
