import { http, HttpResponse, delay } from "msw";
import { db } from "../db";
import { SEARCH_ARTISTS, SEARCH_TRACKS } from "../fixtures";

const API = import.meta.env.API_URL;

export const exclusionHandlers = [
  http.get(`${API}/api/exclusions`, async () => {
    await delay(80);
    return HttpResponse.json({ exclusions: db.exclusions });
  }),

  http.post(`${API}/api/exclusions`, async ({ request }) => {
    await delay(80);
    const { type, targetId } = (await request.json()) as {
      type: "track" | "artist";
      targetId: string;
    };
    const now = new Date();

    if (type === "artist") {
      const found = SEARCH_ARTISTS.find((a) => a.id === targetId);
      const entry = {
        type: "artist" as const,
        artistId: targetId,
        artistName: found?.name ?? targetId,
        excludedAt: now,
      };
      db.exclusions.artists.push(entry);
      return HttpResponse.json({
        id: targetId,
        name: entry.artistName,
        excludedAt: now,
      });
    }

    const found = SEARCH_TRACKS.find((t) => t.id === targetId);
    const entry = {
      type: "track" as const,
      trackId: targetId,
      trackName: found?.name ?? targetId,
      artistName: "Unknown Artist",
      albumName: "Unknown Album",
      excludedAt: now,
    };
    db.exclusions.tracks.push(entry);
    return HttpResponse.json({
      id: targetId,
      name: entry.trackName,
      excludedAt: now,
    });
  }),

  http.delete(`${API}/api/exclusions/:type/:targetId`, async ({ params }) => {
    await delay(80);
    const { type, targetId } = params;
    if (type === "artist") {
      db.exclusions.artists = db.exclusions.artists.filter(
        (a) => a.artistId !== targetId,
      );
    } else {
      db.exclusions.tracks = db.exclusions.tracks.filter(
        (t) => t.trackId !== targetId,
      );
    }
    return HttpResponse.json({ message: "Exclusion removed" });
  }),
];
