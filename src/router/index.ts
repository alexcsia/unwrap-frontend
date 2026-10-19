import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
// import { getProfile } from "@/services/api";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
      meta: { guestOnly: true },
    },
    {
      path: "/",
      name: "dashboard",
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    await authStore.fetchUser();
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: "dashboard" };
  }
  return true;
});

export default router;
