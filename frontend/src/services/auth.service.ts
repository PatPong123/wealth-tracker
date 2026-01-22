import api from '@/lib/api';
import Cookies from 'js-cookie';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_DAYS = 7;

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { accessToken } = response.data;
    
    // Store token in cookie
    Cookies.set(TOKEN_KEY, accessToken, { expires: TOKEN_EXPIRY_DAYS });
    
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    const { accessToken } = response.data;
    
    // Store token in cookie
    Cookies.set(TOKEN_KEY, accessToken, { expires: TOKEN_EXPIRY_DAYS });
    
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  logout(): void {
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
