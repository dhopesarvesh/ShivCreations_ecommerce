import { fetchFromApi } from '../../services/api';
import type { AuthUser, LoginRequest, RegisterRequest } from './auth.types';

interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export const authApi = {
  login: (payload: LoginRequest) =>
    fetchFromApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: RegisterRequest) =>
    fetchFromApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCurrentUser: (token: string) => fetchFromApi<AuthUser>('/users/me', {}, token),
};
