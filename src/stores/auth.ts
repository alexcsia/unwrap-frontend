import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getProfile,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const isInitialized = ref(false);

  async function fetchUser() {
    if (isInitialized.value) return;

    try {
      const res = await getProfile();
      isAuthenticated.value = true;
      return res;
    } catch {
      isAuthenticated.value = false;
    } finally {
      isInitialized.value = true;
    }
  }

  function setAuthenticated(value: boolean) {
    isAuthenticated.value = value;
    isInitialized.value = true;
  }

  function clearUser() {
    isAuthenticated.value = false;
    isInitialized.value = true;
  }

  async function login(email: string, pass: string) {
    const res = await apiLogin(email, pass);

    setAuthenticated(true);

    return res;
  }

  async function register(name: string, email: string, pass: string) {
    const res = await apiRegister(name, email, pass);
    setAuthenticated(true);

    return res;
  }

  async function logout() {
    try {
      await apiLogout();
    } finally {
      clearUser();
    }
  }
  return {
    isInitialized,
    isAuthenticated,
    fetchUser,
    clearUser,
    login,
    register,
    logout,
  };
});
