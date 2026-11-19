import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getProfile,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "@/services/api";
import type { UserProfile } from "@/services/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserProfile | null>(null);
  const isInitialized = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  async function fetchUser() {
    if (isInitialized.value) return;

    try {
      if (import.meta.env.DEV) {
        user.value = {
          email: "test@test.com",
          username: "test",
        };
      } else {
        user.value = await getProfile();
      }
    } catch {
      user.value = null;
    } finally {
      isInitialized.value = true;
    }
  }

  function clearUser() {
    user.value = null;
    isInitialized.value = true;
  }

  async function login(email: string, pass: string) {
    const res = await apiLogin(email, pass);
    user.value = res.user;
    isInitialized.value = true;
  }

  async function register(name: string, email: string, pass: string) {
    const res = await apiRegister(name, email, pass);
    user.value = res.user;
    isInitialized.value = true;
  }

  async function logout() {
    try {
      await apiLogout();
    } finally {
      clearUser();
    }
  }

  return {
    user,
    isInitialized,
    isAuthenticated,
    fetchUser,
    clearUser,
    login,
    register,
    logout,
  };
});
