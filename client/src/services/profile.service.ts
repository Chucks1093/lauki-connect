import { BaseApiService, type APIResponse } from './api.service';

export interface ProfileMatch {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string | null;
  shortDescription?: string | null;
  ensName?: string | null;
  walletAddress?: string | null;
  walletAgeDays?: number | null;
  walletVolumeUsd?: number | null;
  baseTxCount?: number | null;
  onchainActivityGrade?: string | null;
  farcasterHandle?: string | null;
  farcasterUrl?: string | null;
  farcasterFollowerCount?: number | null;
  xHandle?: string | null;
  xUrl?: string | null;
  githubHandle?: string | null;
  githubUrl?: string | null;
  linkedinHandle?: string | null;
  linkedinUrl?: string | null;
  talentProtocolUrl?: string | null;
  talentScore?: number | null;
  contributionSummary: string;
  notableContracts: string[];
  score: number;
  reason: string;
  sourceUrl: string;
}

export interface SavedProfile {
  id: string;
  savedByAddress: string;
  profileId: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string | null;
  shortDescription?: string | null;
  ensName?: string | null;
  profileWalletAddress?: string | null;
  walletAgeDays?: number | null;
  walletVolumeUsd?: number | null;
  baseTxCount?: number | null;
  onchainActivityGrade?: string | null;
  farcasterHandle?: string | null;
  farcasterUrl?: string | null;
  farcasterFollowerCount?: number | null;
  xHandle?: string | null;
  xUrl?: string | null;
  githubHandle?: string | null;
  githubUrl?: string | null;
  linkedinHandle?: string | null;
  linkedinUrl?: string | null;
  talentProtocolUrl?: string | null;
  talentScore?: number | null;
  contributionSummary: string;
  notableContracts: string[];
  score?: number | null;
  reason?: string | null;
  sourceUrl: string;
  createdAt: string;
}

class ProfileService extends BaseApiService {
  async searchProfiles(query: string): Promise<ProfileMatch[]> {
    try {
      const response = await this.api.post<APIResponse<ProfileMatch[]>>('/profiles/search', {
        query,
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSavedProfiles(): Promise<SavedProfile[]> {
    try {
      const response = await this.api.get<APIResponse<SavedProfile[]>>('/profiles/saved');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async saveProfile(profile: ProfileMatch): Promise<SavedProfile> {
    try {
      const response = await this.api.post<APIResponse<SavedProfile>>('/profiles/saved', {
        profile,
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeSavedProfile(profileId: string): Promise<{ removed: boolean }> {
    try {
      const response = await this.api.delete<APIResponse<{ removed: boolean }>>(
        `/profiles/saved/${profileId}`,
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const profileService = new ProfileService();
