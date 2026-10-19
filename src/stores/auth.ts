import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getProfile,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  type UserProfile,
} from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserProfile | null>(null);
  const isInitialized = ref(false); // Prevents duplicate initial fetches

  const isAuthenticated = computed(() => !!user.value);

  // Fetch profile once (cached for the session)
  async function fetchUser() {
    if (isInitialized.value) return;
    try {
      const profile = await getProfile();
      user.value = profile;
    } catch {
      user.value = null;
    } finally {
      isInitialized.value = true;
    }
  }

  function clearUser() {
    user.value = null;
    isInitialized.value = false;
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
    await apiLogout();
    clearUser();
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
