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

export const connectSpotifyUrl = `${API_URL}/auth/connect/spotify`;
export const connectLastfmUrl = `${API_URL}/auth/connect/lastfm`;

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
