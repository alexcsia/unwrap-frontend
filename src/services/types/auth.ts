export interface AuthResponse {
  user: UserProfile;
}

export interface UserProfile {
  email: string;
  username: string;
}
