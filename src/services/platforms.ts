import { api } from "./api";
import type { PlatformSummary, PlatformName } from "./types";

export const getPlatforms = () =>
  api
    .get<{ platforms: PlatformSummary[] }>("/platforms/")
    .then((r) => r.data.platforms);

export const connectPlatform = (platform: PlatformName) =>
  api.get<{ url: string }>(`/auth/connect/${platform}`).then((r) => r.data.url);

export const disconnectPlatform = (platform: PlatformName) =>
  api.delete(`/platforms/${platform}`);
