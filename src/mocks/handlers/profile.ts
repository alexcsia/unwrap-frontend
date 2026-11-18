import { http, HttpResponse, delay } from "msw";
import { db } from "../db";
import type { UserProfile } from "@/services/types/auth";

const API = import.meta.env.VITE_API_URL;

export const profileHandlers = [
  http.get(`${API}/user/profile`, async () => {
    await delay(80);
    return HttpResponse.json(db.user);
  }),

  http.patch(`${API}/user/profile`, async ({ request }) => {
    await delay(80);
    const patch = (await request.json()) as Partial<UserProfile>;
    db.user = { ...db.user, ...patch };
    return HttpResponse.json(db.user);
  }),

  http.delete(`${API}/user/account`, async () => {
    await delay(80);
    return HttpResponse.json({ message: "Account deleted" });
  }),
];
