import { http, HttpResponse, delay } from "msw";
import type { PlatformName } from "@/services/types";
import { db, persist } from "../db";

const API = import.meta.env.VITE_API_URL;
const LATENCY = 120;

export const authHandlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    await delay(LATENCY);
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    if (email !== db.user.email || password !== db.password) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }
    return HttpResponse.json({ user: db.user });
  }),

  http.post(`${API}/register`, async ({ request }) => {
    await delay(LATENCY);
    const { displayName, email, password } = (await request.json()) as {
      displayName: string;
      email: string;
      password: string;
    };
    db.user = { email, username: displayName };
    db.password = password;
    return HttpResponse.json({ user: db.user });
  }),

  http.get(`${API}/auth/logout`, async () => {
    console.log("logging out");
    await delay(LATENCY);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API}/auth/refresh`, async () => {
    await delay(LATENCY);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API}/auth/change-password`, async ({ request }) => {
    await delay(LATENCY);
    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };
    if (currentPassword !== db.password) {
      return HttpResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 },
      );
    }
    db.password = newPassword;
    return HttpResponse.json({ message: "Password updated" });
  }),

  http.get(`${API}/auth/connect/:platform`, async ({ params }) => {
    await delay(LATENCY);
    const platform = params.platform as PlatformName;

    if (!db.platforms.some((p) => p.platformName === platform)) {
      db.platforms.push({
        platformName: platform,
        connectedAt: new Date().toISOString(),
      });
      persist();
    }
    return HttpResponse.json({
      url: window.location.href,
    });
  }),
];
