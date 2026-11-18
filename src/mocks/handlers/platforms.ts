import { http, HttpResponse, delay } from "msw";
import { db } from "../db";

const API = import.meta.env.API_URL;

export const platformHandlers = [
  http.get(`${API}/platforms/`, async () => {
    await delay(80);
    return HttpResponse.json({ platforms: db.platforms });
  }),

  http.delete(`${API}/platforms/:platform`, async ({ params }) => {
    await delay(80);
    const platform = params.platform as string;
    db.platforms = db.platforms.filter((p) => p.platformName !== platform);
    return new HttpResponse(null, { status: 204 });
  }),
];
