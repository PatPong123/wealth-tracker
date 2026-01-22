export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string | null;
  };
}
