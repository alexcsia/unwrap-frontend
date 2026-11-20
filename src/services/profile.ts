import { api } from "./api";
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "./types";

export const getProfile = () =>
  api.get<UserProfile>("/user/profile").then((r) => r.data);

export const updateProfile = (payload: UpdateProfilePayload) =>
  api.patch<UserProfile>("/user/profile", payload).then((r) => r.data);

export const changePassword = (payload: ChangePasswordPayload) =>
  api
    .post<{ message: string }>("/auth/change-password", payload)
    .then((r) => r.data);

export const deleteAccount = () =>
  api.delete<{ message: string }>("/user/account").then((r) => r.data);
