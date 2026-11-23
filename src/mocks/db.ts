import type {
  Exclusions,
  PlatformSummary,
  RecentTracks,
} from "@/services/types";
import type { UserProfile } from "@/services/types/auth";

export interface MockDb {
  user: UserProfile;
  password: string;
  platforms: PlatformSummary[];
  exclusions: Exclusions;
  recentTracks: RecentTracks[];
}

const STORAGE_KEY = "__mock_db_v1__";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const seedExclusions = (): Exclusions => ({
  artists: [
    {
      type: "artist",
      artistId: "artist-seed-1",
      artistName: "Drake",
      excludedAt: daysAgo(3),
    },
    {
      type: "artist",
      artistId: "artist-seed-2",
      artistName: "Taylor Swift",
      excludedAt: daysAgo(7),
    },
  ],
  tracks: [
    {
      type: "track",
      trackId: "track-seed-1",
      trackName: "Cruel Summer",
      artistName: "Taylor Swift",
      albumName: "Lover",
      excludedAt: daysAgo(1),
    },
    {
      type: "track",
      trackId: "track-seed-2",
      trackName: "Tití Me Preguntó",
      artistName: "Bad Bunny",
      albumName: "Un Verano Sin Ti",
      excludedAt: daysAgo(4),
    },
  ],
});

const seedRecentTracks = (): RecentTracks[] => [
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
];

const defaults = (): MockDb => ({
  user: { username: "Demo User", email: "demo@example.com" },
  password: "password123",
  platforms: [],
  exclusions: seedExclusions(),
  recentTracks: seedRecentTracks(),
});

function load(): MockDb {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaults();
}

export const db: MockDb = load();

export function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {}
}

export function resetDb() {
  Object.assign(db, defaults());
  sessionStorage.removeItem(STORAGE_KEY);
}
