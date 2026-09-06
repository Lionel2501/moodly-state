import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});

export interface Category {
  id: number;
  slug: string;
  name: string;
}

export interface UserSummary {
  id: string;
  username: string;
}

export interface MoodStateDto {
  id: string;
  code: string;
  categoryId: number | null;
  categoryName: string;
  createdAt: string;
  url: string;
  aboutUser: UserSummary | null;
}

export interface PublicStateDto {
  username: string;
  categoryId: number | null;
  categoryName: string;
  createdAt: string;
}

export interface SharedStateDto {
  code: string;
  categoryId: number | null;
  categoryName: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
}

export async function register(username: string, email: string) {
  const { data } = await api.post<{ message: string }>('/auth/register', {
    username,
    email,
  });
  return data.message;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ user: AuthUser }>('/auth/login', { email, password });
  return data.user;
}

export async function setPassword(username: string, token: string, password: string) {
  const { data } = await api.post<{ user: AuthUser }>('/auth/set-password', {
    username,
    token,
    password,
  });
  return data.user;
}

export async function resetPassword(username: string, token: string, password: string) {
  const { data } = await api.post<{ user: AuthUser }>('/auth/reset-password', {
    username,
    token,
    password,
  });
  return data.user;
}

export async function forgotPassword(identifier: string) {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', { identifier });
  return data.message;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function fetchMe() {
  const { data } = await api.get<{ user: (AuthUser & { email: string }) | null }>('/auth/me');
  return data.user;
}

export async function fetchCategories() {
  const { data } = await api.get<{ categories: Category[] }>('/categories');
  return data.categories;
}

export async function fetchStates() {
  const { data } = await api.get<MoodStateDto[]>('/states');
  return data;
}

export async function createState(categoryId: number, aboutUserId?: string) {
  const { data } = await api.post<MoodStateDto>('/states', { categoryId, aboutUserId });
  return data;
}

export async function searchUsers(query: string) {
  const { data } = await api.get<UserSummary[]>('/users/search', { params: { q: query } });
  return data;
}

export async function fetchPublicState(username: string, code: string) {
  const { data } = await api.get<PublicStateDto>(`/public/${username}/${code}`);
  return data;
}

export async function createSharedState(categoryId: number) {
  const { data } = await api.post<SharedStateDto>('/shared-states', { categoryId });
  return data;
}

export async function discoverSharedState(code: string) {
  const { data } = await api.get<SharedStateDto>(`/shared-states/${encodeURIComponent(code)}`);
  return data;
}
