import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import NavbarMenu from "../NavbarMenu.vue";
import { useAuthStore } from "@/stores/auth";

describe("NavbarMenu", () => {
  let queryClient: QueryClient;
  let router: ReturnType<typeof createRouter>;

  const mountMenu = () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<div />" } },
        { path: "/login", component: { template: "<div />" } },
        { path: "/platforms", component: { template: "<div />" } },
        {
          path: "/profile",
          name: "profile",
          component: { template: "<div />" },
        },
      ],
    });

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const pinia = createPinia();
    setActivePinia(pinia);

    return {
      wrapper: mount(NavbarMenu, {
        global: {
          plugins: [pinia, router, [VueQueryPlugin, { queryClient }]],
        },
      }),
      authStore: useAuthStore(),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("toggles menu open and closed when clicking the menu button", async () => {
    const { wrapper } = mountMenu();

    const toggleButton = wrapper.find('button[aria-label="Open profile menu"]');
    expect(toggleButton.attributes("aria-expanded")).toBe("false");
    expect(wrapper.text()).not.toContain("Login");
    expect(wrapper.text()).not.toContain("Profile");

    await toggleButton.trigger("click");
    expect(toggleButton.attributes("aria-expanded")).toBe("true");
    expect(wrapper.text()).toContain("Login");

    await toggleButton.trigger("click");
    expect(toggleButton.attributes("aria-expanded")).toBe("false");
    expect(wrapper.text()).not.toContain("Login");
  });

  it("shows Login option when unauthenticated and navigates to /login", async () => {
    const { wrapper } = mountMenu();
    const replaceSpy = vi.spyOn(router, "replace");

    await wrapper
      .find('button[aria-label="Open profile menu"]')
      .trigger("click");

    expect(wrapper.text()).toContain("Login");
    expect(wrapper.text()).not.toContain("Profile");
    expect(wrapper.text()).not.toContain("Platforms");
    expect(wrapper.text()).not.toContain("Log out");

    const loginButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Login");
    await loginButton!.trigger("click");

    expect(replaceSpy).toHaveBeenCalledWith("/login");
    expect(
      wrapper
        .find('button[aria-label="Open profile menu"]')
        .attributes("aria-expanded"),
    ).toBe("false");
  });

  it("shows authenticated actions when authenticated", async () => {
    const { wrapper, authStore } = mountMenu();
    authStore.isAuthenticated = true;

    await wrapper
      .find('button[aria-label="Open profile menu"]')
      .trigger("click");

    expect(wrapper.text()).toContain("Profile");
    expect(wrapper.text()).toContain("Platforms");
    expect(wrapper.text()).toContain("Log out");
    expect(wrapper.text()).not.toContain("Login");
  });

  it("navigates to profile route when clicking Profile", async () => {
    const { wrapper, authStore } = mountMenu();
    authStore.isAuthenticated = true;
    const pushSpy = vi.spyOn(router, "push");

    await wrapper
      .find('button[aria-label="Open profile menu"]')
      .trigger("click");
    const profileButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Profile");
    await profileButton!.trigger("click");

    expect(pushSpy).toHaveBeenCalledWith({ name: "profile" });
  });

  it("navigates to /platforms when clicking Platforms", async () => {
    const { wrapper, authStore } = mountMenu();
    authStore.isAuthenticated = true;
    const replaceSpy = vi.spyOn(router, "replace");

    await wrapper
      .find('button[aria-label="Open profile menu"]')
      .trigger("click");
    const platformsButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Platforms");
    await platformsButton!.trigger("click");

    expect(replaceSpy).toHaveBeenCalledWith("/platforms");
  });

  it("logs out, clears query cache, and redirects to /login on signOut", async () => {
    const { wrapper, authStore } = mountMenu();
    authStore.isAuthenticated = true;

    const logoutSpy = vi
      .spyOn(authStore, "logout")
      .mockResolvedValue(undefined);
    const clearCacheSpy = vi.spyOn(queryClient, "clear");
    const replaceSpy = vi.spyOn(router, "replace");

    await wrapper
      .find('button[aria-label="Open profile menu"]')
      .trigger("click");
    const logoutButton = wrapper
      .findAll("button")
      .find((b) => b.text().startsWith("Log out"));
    await logoutButton!.trigger("click");

    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(clearCacheSpy).toHaveBeenCalledTimes(1);
    expect(replaceSpy).toHaveBeenCalledWith("/login");
  });

  it("displays fallback error when signOut fails with a non-ApiError", async () => {
    const { wrapper, authStore } = mountMenu();
    authStore.isAuthenticated = true;

    vi.spyOn(authStore, "logout").mockRejectedValue(new Error("Network down"));

    await wrapper
      .find('button[aria-label="Open profile menu"]')
      .trigger("click");
    const logoutButton = wrapper
      .findAll("button")
      .find((b) => b.text().startsWith("Log out"));
    await logoutButton!.trigger("click");

    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe("Could not log out. Please try again.");
  });
});
