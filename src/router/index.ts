import { createRouter, createWebHistory } from "vue-router";
import ExclusionsPage from "@/pages/exclusions/ExclusionsPage.vue";
import RegisterPage from "@/pages/register/RegisterPage.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import DashboardPage from "@/pages/dashboard/DashboardPage.vue";
import ListeningStats from "@/pages/statistics/ListeningStats.vue";
import Platforms from "@/pages/platforms/Platforms.vue";
import { useAuthStore } from "@/stores/auth";
import FileUploadPage from "@/pages/FileUploadPage.vue";
import ProfilePage from "@/pages/profile/ProfilePage.vue";

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
      meta: { requiresAuth: false },
    },

    {
      path: "/statistics",
      name: "statistics",
      component: ListeningStats,
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
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
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
