import apiClient from './client';

export interface LoginRequest {
  username: string; // Email in the backend
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  location?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  is_admin: boolean;
  points: number;
  rating: number;
  swaps_completed: number;
  items_listed: number;
  impact_score: number;
  join_date: string;
  location?: string;
}

export const authApi = {
  async login(credentials: LoginRequest) {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    apiClient.setToken(data.access_token);
    return data;
  },

  async register(userData: RegisterRequest) {
    const result = await apiClient.post<User>('/api/auth/register', userData);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  async getCurrentUser() {
    const result = await apiClient.get<User>('/api/auth/me');
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data!;
  },

  logout() {
    apiClient.clearToken();
  },

  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },
}; 