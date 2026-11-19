import type { Exclusions, PlatformSummary } from "@/services/api";
import type { UserProfile } from "@/services/types/auth";

export interface MockDb {
  user: UserProfile;
  password: string;
  platforms: PlatformSummary[];
  exclusions: Exclusions;
}

const STORAGE_KEY = "__mock_db_v1__";

const defaults = (): MockDb => ({
  user: { username: "Demo User", email: "demo@example.com" },
  password: "password123",
  platforms: [],
  exclusions: { artists: [], tracks: [] },
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
