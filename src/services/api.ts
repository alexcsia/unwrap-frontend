import axios from "axios";
import type {
  TopArtistsResponse,
  TopTracksResponse,
  StatsParams,
  TimeListenedResponse,
} from "./types/statistics";
import type { AuthResponse, UserProfile } from "./types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const api = axios.create({
  baseURL: API_URL,
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
      } catch {
        window.location.href = "/login";
        return Promise.reject(error);
      }
      return api(original);
    }

    return Promise.reject(error);
  },
);

export const login = (email: string, password: string) =>
  api
    .post<AuthResponse>("/auth/login", { email, password })
    .then((r) => r.data);

export const register = (
  displayName: string,
  email: string,
  password: string,
) =>
  api
    .post<AuthResponse>("/register", { displayName, email, password })
    .then((r) => r.data);

export const logout = () => api.post<void>("/auth/logout").then((r) => r.data);

export const getProfile = () =>
  api.get<UserProfile>("/user/profile").then((r) => r.data);

export type PlatformName = "spotify" | "lastfm";

export interface PlatformSummary {
  platformName: PlatformName;
  connectedAt: string;
}

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

export type SearchEntityResponse = Array<{
  id: string;
  name: string;
  entityType: "track" | "artist";
}>;

export type Entity = {
  entityType: "track" | "artist";
  name: string;
  id: string;
};

export type SearchEntityParams = {
  type: "track" | "artist";
  name: string;
  limit: number;
  cursor: string | undefined | null;
};
export const searchEntity = (params: SearchEntityParams) =>
  api
    .get<{ result: SearchEntityResponse }>("/api/history/search", { params })
    .then((r) => r.data.result);

export type Exclusions = {
  artists: {
    type: "artist";
    artistId: string;
    artistName: string;
    excludedAt: Date;
  }[];
  tracks: {
    type: "track";
    trackId: string;
    trackName: string;
    artistName: string;
    albumName: string;
    excludedAt: Date;
  }[];
};

export const fetchExclusions = () =>
  api
    .get<{ exclusions: Exclusions }>("/api/exclusions")
    .then((r) => r.data.exclusions);

export type createExclusionResponse = {
  id: string;
  name: string;
  excludedAt: Date;
};

export type exclusionsPayload = {
  type: "track" | "artist";
  targetId: string;
};

export const createExclusion = (payload: exclusionsPayload) =>
  api
    .post<createExclusionResponse>("/api/exclusions", payload)
    .then((r) => r.data);

export const deleteExclusion = (params: exclusionsPayload) =>
  api
    .delete<{
      message: string;
    }>(`/api/exclusions/${params.type}/${params.targetId}`)
    .then((r) => r.data);
