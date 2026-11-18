import { http, HttpResponse, delay } from "msw";
import { generateTopArtists, generateTopTracks, paginate } from "../fixtures";

const API = import.meta.env.API_URL;

export const statisticsHandlers = [
  http.get(`${API}/api/top-artists`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const { pagination, items } = paginate(generateTopArtists(), limit, offset);
    return HttpResponse.json({ pagination, topArtists: items });
  }),

  http.get(`${API}/api/top-tracks`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const { pagination, items } = paginate(generateTopTracks(), limit, offset);
    return HttpResponse.json({ pagination, topTracks: items });
  }),

  http.get(`${API}/api/time-listened`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const now = new Date();
    const start =
      url.searchParams.get("from") ??
      new Date(now.getFullYear(), 0, 1).toISOString();
    const end = url.searchParams.get("to") ?? now.toISOString();
    return HttpResponse.json({
      period: { start, end },
      statistics: { totalMs: 12_345_678, totalTracks: 4321 },
    });
  }),
];
