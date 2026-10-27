export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
  nextOffset: number | null;
  previousOffset: number | null;
}

export interface TopArtist {
  rank: number;
  artistId: string;
  artistName: string;
  plays: number;
  durationMs: number;
}

export interface TopTrack {
  rank: number;
  trackId: string;
  trackName: string;
  artistNames: string;
  albumName: string;
  plays: number;
  durationMs: number;
}

export interface TopArtistsResponse {
  pagination: Pagination;
  topArtists: TopArtist[];
}

export interface TopTracksResponse {
  pagination: Pagination;
  topTracks: TopTrack[];
}

export interface TimeListenedResponse {
  period: { start: string; end: string };
  statistics: { totalMs: number; totalTracks: number };
}

export interface StatsParams {
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}
