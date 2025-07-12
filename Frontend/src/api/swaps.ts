import apiClient from './client';

export interface SwapRequest {
  id: number;
  item_id: number;
  requester_id: number;
  owner_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  date_created: string;
}

export interface SwapCreate {
  item_id: number;
  requester_id: number;
  owner_id: number;
  message?: string;
}

export interface SwapUpdate {
  status?: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
}

export const swapsApi = {
  async getAll() {
    const result = await apiClient.get<SwapRequest[]>('/api/swaps');
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async getById(id: number) {
    const result = await apiClient.get<SwapRequest>(`/api/swaps/${id}`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async create(swap: SwapCreate) {
    const result = await apiClient.post<SwapRequest>('/api/swaps', swap);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async update(id: number, updates: SwapUpdate) {
    const result = await apiClient.put<SwapRequest>(`/api/swaps/${id}`, updates);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async getHistory() {
    const result = await apiClient.get<SwapRequest[]>('/api/swaps/history');
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async accept(id: number) {
    return this.update(id, { status: 'accepted' });
  },

  async reject(id: number) {
    return this.update(id, { status: 'rejected' });
  },

  async complete(id: number) {
    return this.update(id, { status: 'completed' });
  },
}; 