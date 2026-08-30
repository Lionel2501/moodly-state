import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface Step {
  id: number;
  name: string;
  feelings: string[];
}

export interface MoodStateDto {
  id: string;
  code: string;
  stepId: number;
  stepName: string;
  feeling: string;
  createdAt: string;
  url: string;
}

export interface PublicStateDto {
  username: string;
  stepId: number;
  stepName: string;
  feeling: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
}

export async function register(username: string, email: string, password: string) {
  const { data } = await api.post<{ user: AuthUser }>('/auth/register', {
    username,
    email,
    password,
  });
  return data.user;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ user: AuthUser }>('/auth/login', { email, password });
  return data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function fetchMe() {
  const { data } = await api.get<{ user: (AuthUser & { email: string }) | null }>('/auth/me');
  return data.user;
}

export async function fetchCategories() {
  const { data } = await api.get<{ steps: Step[] }>('/categories');
  return data.steps;
}

export async function fetchStates() {
  const { data } = await api.get<MoodStateDto[]>('/states');
  return data;
}

export async function createState(stepId: number, feeling: string) {
  const { data } = await api.post<MoodStateDto>('/states', { stepId, feeling });
  return data;
}

export async function fetchPublicState(username: string, code: string) {
  const { data } = await api.get<PublicStateDto>(`/public/${username}/${code}`);
  return data;
}
