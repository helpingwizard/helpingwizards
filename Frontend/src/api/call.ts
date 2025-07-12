import { apiClient } from './client';

interface CallResponse {
  success: boolean;
  message: string;
  call_sid?: string;
}

export const callApi = {
  async makeCall(): Promise<CallResponse> {
    const response = await apiClient.post<CallResponse>('/api/call/make-call');
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get<{ status: string }>('/api/call/health');
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  }
}; 