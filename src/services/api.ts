import axios from "axios";

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

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/")
    ) {
      original._retry = true;
      await api.post("/auth/refresh");
      return api(original);
    }

    return Promise.reject(error);
  },
);

export const login = (email: string, password: string) =>
  api
    .post<AuthResponse>("/auth/login", { email, password })
    .then((r) => r.data);

export const register = (name: string, email: string, password: string) =>
  api
    .post<AuthResponse>("/auth/register", { name, email, password })
    .then((r) => r.data);

export const logout = () => api.post<void>("/auth/logout").then((r) => r.data);

export const getProfile = () =>
  api.get<UserProfile>("/user/profile").then((r) => r.data);
