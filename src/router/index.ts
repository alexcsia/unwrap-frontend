import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import { getProfile } from "@/services/api";

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
  let authenticated = false;

  try {
    await getProfile();
    authenticated = true;
  } catch {
    authenticated = false;
  }

  if (to.meta.requiresAuth && !authenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && authenticated) {
    return { name: "dashboard" };
  }

  return true;
});

export default router;
