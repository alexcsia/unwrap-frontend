import { http, HttpResponse, delay } from "msw";
import { RECENT_TRACKS } from "../fixtures";

const API = import.meta.env.VITE_API_URL;

export const recentTracksHandlers = [
  http.get(`${API}/api/recent`, async () => {
    await delay(80);
    return HttpResponse.json(RECENT_TRACKS);
  }),
];
