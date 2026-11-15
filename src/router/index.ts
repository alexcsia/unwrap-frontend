import { createRouter, createWebHistory } from "vue-router";
import ExclusionsPage from "@/pages/ExclusionsPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import StatisticsPage from "@/pages/ListeningStats.vue";
import Platforms from "@/pages/Platforms.vue";
import { useAuthStore } from "@/stores/auth";
import FileUploadPage from "@/pages/FileUploadPage.vue";

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

    {
      path: "/statistics",
      name: "statistics",
      component: StatisticsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/platforms",
      name: "platforms",
      component: Platforms,
      meta: { requiresAuth: true },
    },
    {
      path: "/exclusions",
      name: "exclusions",
      component: ExclusionsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/history-upload",
      name: "upload",
      component: FileUploadPage,
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

  return true;
});

export default router;
