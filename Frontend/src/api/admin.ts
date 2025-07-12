import apiClient from './client';
import { Item } from './items';
import { User } from './auth';

export interface AdminStats {
  total_items: number;
  pending_items: number;
  approved_items: number;
  rejected_items: number;
  total_users: number;
  admin_users: number;
}

export const adminApi = {
  async getStats() {
    const result = await apiClient.get<AdminStats>('/api/admin/stats');
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async getAllItems() {
    const result = await apiClient.get<Item[]>('/api/admin/items');
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async getPendingItems() {
    const result = await apiClient.get<Item[]>('/api/admin/items/pending');
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async getItemsByStatus(status: string) {
    const result = await apiClient.get<Item[]>(`/api/admin/items/status/${status}`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async approveItem(itemId: number) {
    const result = await apiClient.put<Item>(`/api/admin/items/${itemId}/approve`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async rejectItem(itemId: number) {
    const result = await apiClient.put<Item>(`/api/admin/items/${itemId}/reject`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async deleteItem(itemId: number) {
    const result = await apiClient.delete(`/api/admin/items/${itemId}`);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data;
  },

  async getAllUsers() {
    const result = await apiClient.get<User[]>('/api/admin/users');
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },
}; 