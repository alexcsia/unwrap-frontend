export interface AuthResponse {
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
}
