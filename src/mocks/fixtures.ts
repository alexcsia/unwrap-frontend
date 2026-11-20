export const SEARCH_ARTISTS = [
  { entityType: "artist", id: "artist_1", name: "Radiohead" },
  { entityType: "artist", id: "artist_2", name: "Aphex Twin" },
];

export const SEARCH_TRACKS = [
  { entityType: "track", id: "track_1", name: "Everything In Its Right Place" },
  { entityType: "track", id: "track_2", name: "Windowlicker" },
];

export const RECENT_TRACKS = [
  {
    trackName: "Cruel Summer",
    artistsNames: ["Taylor Swift"],
    playedAt: new Date("2026-11-19T21:14:00Z"),
  },
  {
    trackName: "La Tortura (feat. Alejandro Sanz)",
    artistsNames: ["Shakira", "Alejandro Sanz"],
    playedAt: new Date("2026-11-19T21:09:00Z"),
  },
  {
    trackName: "Can't Remember to Forget You (feat. Rihanna)",
    artistsNames: ["Shakira", "Rihanna"],
    playedAt: new Date("2026-11-19T21:05:00Z"),
  },
  {
    trackName: "Meet Me Halfway",
    artistsNames: ["Black Eyed Peas"],
    playedAt: new Date("2026-11-19T20:59:00Z"),
  },
  {
    trackName: "Don't Stop the Music",
    artistsNames: ["Rihanna"],
    playedAt: new Date("2026-11-19T20:55:00Z"),
  },
];

export function generateTopArtists() {
  return [
    {
      rank: 1,
      artistId: "artist_1",
      artistName: "Radiohead",
      playCount: 100,
      durationMs: 100000,
    },
    {
      rank: 2,
      artistId: "artist_2",
      artistName: "Aphex Twin",
      playCount: 50,
      durationMs: 200000,
    },
  ];
}

export function generateTopTracks() {
  return [
    {
      rank: 1,
      trackId: "track_1",
      trackName: "Everything In Its Right Place",
      artistNames: "Radiohead",
      albumName: "Kid A",
      plays: 100,
      durationMs: 1000,
    },
    {
      rank: 2,
      trackId: "track_2",
      trackName: "Windowlicker",
      artistNames: "Aphex Twin",
      albumName: "Windowlicker",
      plays: 50,
      durationMs: 500,
    },
  ];
}
export function paginate(items: any[], limit: number, offset: number) {
  return {
    pagination: {
      limit: limit,
      offset: offset,
      total: items.length,
      hasMore: false,
      nextOffset: null,
      previousOffset: null,
    },
    items: items,
  };
}
