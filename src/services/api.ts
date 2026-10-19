const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  user: UserProfile;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = await response.json();
      message = body.message ?? message;
    } catch {
      console.log(message);
    }

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const login = (email: string, password: string) =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (name: string, email: string, password: string) =>
  apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const logout = () =>
  apiRequest<void>("/auth/logout", {
    method: "POST",
  });

export const getProfile = () => apiRequest<UserProfile>("/user/profile");

export const linkPlatform = (platform: string) =>
  apiRequest<{ redirectUrl: string }>(
    `/auth/connect/${encodeURIComponent(platform)}`,
  );
