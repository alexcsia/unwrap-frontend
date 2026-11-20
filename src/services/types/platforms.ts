export type PlatformName = "spotify" | "lastfm";

export interface PlatformSummary {
  platformName: PlatformName;
  connectedAt: string;
}
