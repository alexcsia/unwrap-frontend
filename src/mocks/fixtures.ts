export const SEARCH_ARTISTS = Array.from({ length: 20 }, (_, i) => ({
  id: `artist-search-${i + 1}`,
  name: `artist ${i + 1}`,
  entityType: "artist" as const,
}));

export const SEARCH_TRACKS = Array.from({ length: 20 }, (_, i) => ({
  id: `track-search-${i + 1}`,
  name: `track ${i + 1}`,
  entityType: "track" as const,
}));

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
      durationMs: 10023000,
    },
    {
      rank: 2,
      artistId: "artist_2",
      artistName: "Aphex Twin",
      playCount: 50,
      durationMs: 2060000,
    },
    {
      rank: 3,
      artistId: "artist_3",
      artistName: "Boards of Canada",
      playCount: 42,
      durationMs: 1685000,
    },
    {
      rank: 4,
      artistId: "artist_4",
      artistName: "Björk",
      playCount: 38,
      durationMs: 1522000,
    },
    {
      rank: 5,
      artistId: "artist_5",
      artistName: "Massive Attack",
      playCount: 31,
      durationMs: 1244000,
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
      durationMs: 152000,
    },
    {
      rank: 2,
      trackId: "track_2",
      trackName: "Windowlicker",
      artistNames: "Aphex Twin",
      albumName: "Windowlicker",
      plays: 50,
      durationMs: 505800,
    },
    {
      rank: 3,
      trackId: "track_3",
      trackName: "Idioteque",
      artistNames: "Radiohead",
      albumName: "Kid A",
      plays: 45,
      durationMs: 933300,
    },
    {
      rank: 4,
      trackId: "track_4",
      trackName: "Xtal",
      artistNames: "Aphex Twin",
      albumName: "Selected Ambient Works 85-92",
      plays: 40,
      durationMs: 826100,
    },
    {
      rank: 5,
      trackId: "track_5",
      trackName: "Paranoid Android",
      artistNames: "Radiohead",
      albumName: "OK Computer",
      plays: 35,
      durationMs: 702130,
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
