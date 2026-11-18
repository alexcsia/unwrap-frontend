import { http, HttpResponse, delay } from "msw";
import { SEARCH_ARTISTS, SEARCH_TRACKS } from "../fixtures";

const API = import.meta.env.API_URL;

export const searchHandlers = [
  http.get(`${API}/api/history/search`, async ({ request }) => {
    await delay(120);
    const url = new URL(request.url);
    const type = url.searchParams.get("type") as "track" | "artist" | null;
    const name = (url.searchParams.get("name") ?? "").toLowerCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const pool = type === "artist" ? SEARCH_ARTISTS : SEARCH_TRACKS;
    const result = pool
      .filter((e) => e.name.toLowerCase().includes(name))
      .slice(0, limit);

    return HttpResponse.json({ result });
  }),
];
