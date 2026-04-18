import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  AuthTokens,
  User,
  Poll,
  PollDraft,
  PollResults,
  VotePayload,
  PaginatedResponse,
} from '../types';

// Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post<AuthTokens>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`,
          { refresh },
        );
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const authApi = {
  register: (data: {
    email: string;
    username: string;
    display_name: string;
    password: string;
    password_confirm: string;
  }) => api.post<User>('/auth/register/', data),

  login: async (email: string, password: string): Promise<AuthTokens> => {
    const { data } = await api.post<AuthTokens>('/auth/login/', {
      email,
      password,
    });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  me: () => api.get<User>('/auth/me/'),

  updateMe: (data: Partial<User>) => api.patch<User>('/auth/me/', data),
};

// Polls
export const pollsApi = {
  list: (params?: {
    status?: string;
    tag?: string;
    search?: string;
    page?: number;
  }) => api.get<PaginatedResponse<Poll>>('/polls/', { params }),

  mine: () => api.get<PaginatedResponse<Poll>>('/polls/mine/'),

  get: (shortId: string) => api.get<Poll>(`/polls/${shortId}/`),

  create: (data: PollDraft) => api.post<Poll>('/polls/', data),

  update: (shortId: string, data: Partial<PollDraft>) =>
    api.patch<Poll>(`/polls/${shortId}/`, data),

  delete: (shortId: string) => api.delete(`/polls/${shortId}/`),

  activate: (shortId: string) => api.post<Poll>(`/polls/${shortId}/activate/`),

  close: (shortId: string) => api.post<Poll>(`/polls/${shortId}/close/`),

  // Voting
  vote: (shortId: string, payload: VotePayload) =>
    api.post<{ detail: string; voter_id: string }>(
      `/polls/${shortId}/vote/`,
      payload,
    ),

  // Results
  results: (shortId: string, voterId?: string) =>
    api.get<PollResults>(`/polls/${shortId}/results/`, {
      params: voterId ? { voter_id: voterId } : undefined,
    }),

  // Export
  exportCSV: (shortId: string) =>
    api.get(`/polls/${shortId}/export/csv/`, { responseType: 'blob' }),

  exportPNG: (shortId: string) =>
    api.get(`/polls/${shortId}/export/png/`, { responseType: 'blob' }),
};

// Helpers
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return data.detail;
    const firstKey = Object.keys(data || {})[0];
    if (firstKey) return `${firstKey}: ${data[firstKey]}`;
  }
  return 'Something went wrong. Please try again.';
}
