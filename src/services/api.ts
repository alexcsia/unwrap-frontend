import axios from "axios";
import type {
  TopArtistsResponse,
  TopTracksResponse,
  StatsParams,
  TimeListenedResponse,
} from "./types/statistics";
import type { UserProfile } from "./types/auth";
import { useAuthStore } from "@/stores/auth";
import type {
  SearchEntityParams,
  SearchEntityResponse,
  CreateExclusionResponse,
  Exclusions,
  ExclusionsPayload,
} from "./types/exclusions";
import type { PlatformName, PlatformSummary } from "./types/platforms";
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "./types/profile";
import type { RecentTracks } from "./types/recent";

import router from "@/router";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  public status: number;
  public code: string;
  constructor(status: number, message: string, code: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

export const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

let refreshPromise: Promise<unknown> | null = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as any;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true;

      refreshPromise ??= api.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });

      try {
        await refreshPromise;
        return api(original);
      } catch {
        const auth = useAuthStore();
        auth.clearUser();

        if (router.currentRoute.value.name !== "login") {
          await router.replace({ name: "login" });
        }

        return Promise.reject(
          new ApiError(401, "Your session has expired.", "SESSION_EXPIRED"),
        );
      }
    }

    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ??
      (error.response ? "Something went wrong." : "Network error.");

    return Promise.reject(
      new ApiError(status, message, error.response?.data?.code),
    );
  },
);

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

export const getProfile = () =>
  api.get<UserProfile>("/user/profile").then((r) => r.data);

export const getPlatforms = () =>
  api
    .get<{ platforms: PlatformSummary[] }>("/platforms/")
    .then((r) => r.data.platforms);

export const connectPlatform = (platform: PlatformName) =>
  api.get<{ url: string }>(`/auth/connect/${platform}`).then((r) => r.data.url);

export const disconnectPlatform = (platform: PlatformName) =>
  api.delete(`/platforms/${platform}`);

export const getTopArtists = (params?: StatsParams) =>
  api
    .get<TopArtistsResponse>("/api/top-artists", { params })
    .then((r) => r.data);

export const getTopTracks = (params?: StatsParams) =>
  api.get<TopTracksResponse>("/api/top-tracks", { params }).then((r) => r.data);

export const getTimeListened = (params?: StatsParams) =>
  api
    .get<TimeListenedResponse>("/api/time-listened", { params })
    .then((r) => r.data);

export const searchEntity = (params: SearchEntityParams) =>
  api
    .get<{ result: SearchEntityResponse }>("/api/history/search", { params })
    .then((r) => r.data.result);

export const fetchExclusions = () =>
  api
    .get<{ exclusions: Exclusions }>("/api/exclusions")
    .then((r) => r.data.exclusions);

export const createExclusion = (payload: ExclusionsPayload) =>
  api
    .post<CreateExclusionResponse>("/api/exclusions", payload)
    .then((r) => r.data);

export const deleteExclusion = (params: ExclusionsPayload) =>
  api
    .delete<{
      message: string;
    }>(`/api/exclusions/${params.type}/${params.targetId}`)
    .then((r) => r.data);

export const updateProfile = (payload: UpdateProfilePayload) =>
  api.patch<UserProfile>("/user/profile", payload).then((r) => r.data);

export const changePassword = (payload: ChangePasswordPayload) =>
  api
    .post<{ message: string }>("/auth/change-password", payload)
    .then((r) => r.data);

export const deleteAccount = () =>
  api.delete<{ message: string }>("/user/account").then((r) => r.data);

export const getRecentTracks = () =>
  api.get<RecentTracks[]>("/api/recent").then((r) => r.data);
