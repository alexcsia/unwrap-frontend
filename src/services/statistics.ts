import { api } from "./api";
import type {
  TopArtistsResponse,
  TopTracksResponse,
  TimeListenedResponse,
  StatsParams,
  RecentTracks,
} from "./types";

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

export const getRecentTracks = () =>
  api.get<RecentTracks[]>("/api/recent").then((r) => r.data);
