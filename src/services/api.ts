import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  public status: number;
  public code: string;
  constructor(status: number, message: string, code: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

export const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

let refreshPromise: Promise<unknown> | null = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as any;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true;

      refreshPromise ??= api.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });

      try {
        await refreshPromise;
        return api(original);
      } catch {
        const auth = useAuthStore();
        auth.clearUser();

        if (router.currentRoute.value.name !== "login") {
          await router.replace({ name: "login" });
        }

        return Promise.reject(
          new ApiError(401, "Your session has expired.", "SESSION_EXPIRED"),
        );
      }
    }

    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ??
      (error.response ? "Something went wrong." : "Network error.");

    return Promise.reject(
      new ApiError(status, message, error.response?.data?.code),
    );
  },
);
