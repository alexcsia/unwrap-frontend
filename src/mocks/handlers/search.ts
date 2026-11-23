import { http, HttpResponse, delay } from "msw";
import { SEARCH_ARTISTS, SEARCH_TRACKS } from "../fixtures";

const API = import.meta.env.VITE_API_URL;

export const searchHandlers = [
  http.get(`${API}/api/history/search`, async ({ request }) => {
    await delay(80);
    const url = new URL(request.url);
    const type = url.searchParams.get("type") as "track" | "artist";
    const name = url.searchParams.get("name") ?? "";
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const cursor = url.searchParams.get("cursor");

    const pool = type === "artist" ? SEARCH_ARTISTS : SEARCH_TRACKS;
    const filtered = pool.filter((e) =>
      e.name.toLowerCase().includes(name.toLowerCase()),
    );

    const startIndex = cursor
      ? filtered.findIndex((e) => e.id === cursor) + 1
      : 0;
    const page = filtered.slice(startIndex, startIndex + limit);

    return HttpResponse.json({ result: page });
  }),
];
