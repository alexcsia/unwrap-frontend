import { api } from "./api";
import type { UserProfile } from "./types";

export const login = (email: string, password: string) =>
  api.post<UserProfile>("/auth/login", { email, password }).then((r) => r.data);

export const register = (
  displayName: string,
  email: string,
  password: string,
) =>
  api
    .post<UserProfile>("/register", { displayName, email, password })
    .then((r) => r.data);

export const logout = () => api.get<void>("/auth/logout").then((r) => r.data);
