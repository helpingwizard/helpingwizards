import apiClient from './client';

export interface Item {
  id: number;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  size?: string;
  condition?: string;
  tags?: string;
  images?: string[];
  location?: string;
  points?: number;
  status: 'available' | 'pending' | 'swapped' | 'rejected';
  owner_id: number;
  date_added: string;
}

export interface ItemCreate {
  title: string;
  description?: string;
  category?: string;
  type?: string;
  size?: string;
  condition?: string;
  tags?: string;
  images?: string[];
  location?: string;
  points?: number;
}

export interface ItemUpdate {
  title?: string;
  description?: string;
  category?: string;
  type?: string;
  size?: string;
  condition?: string;
  tags?: string;
  images?: string[];
  location?: string;
  points?: number;
  status?: 'available' | 'pending' | 'swapped' | 'rejected';
}

export const itemsApi = {
  async getAll(skip = 0, limit = 10) {
    const result = await apiClient.get<Item[]>(`/api/items?skip=${skip}&limit=${limit}`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async getById(id: number) {
    const result = await apiClient.get<Item>(`/api/items/${id}`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async create(item: ItemCreate) {
    const result = await apiClient.post<Item>('/api/items', item);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async update(id: number, updates: ItemUpdate) {
    const result = await apiClient.put<Item>(`/api/items/${id}`, updates);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async delete(id: number) {
    const result = await apiClient.delete(`/api/items/${id}`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data;
  },
}; 