import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { ref } from "vue";

import Platforms from "../Platforms.vue";
import {
  usePlatforms,
  usePlatformActions,
} from "@/composables/platforms/usePlatforms";

vi.mock("@/composables/platforms/usePlatforms", () => ({
  usePlatforms: vi.fn(),
  usePlatformActions: vi.fn(),
}));

vi.mock("@/composables/platforms/usePlatformCallback", () => ({
  usePlatformCallback: vi.fn(),
}));

const usePlatformsMock = vi.mocked(usePlatforms);
const usePlatformActionsMock = vi.mocked(usePlatformActions);

describe("Platforms page", () => {
  const connectMutate = vi.fn();
  const disconnectMutate = vi.fn();

  const getPlatform = vi.fn((name: string) => {
    if (name === "spotify") {
      return {
        platformName: "spotify",
        connectedAt: "2026-11-08T12:00:00.000Z",
      };
    }

    return undefined;
  });

  const mountPlatforms = () => {
    const router = createRouter({
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

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return mount(Platforms, {
      global: {
        plugins: [createPinia(), router, [VueQueryPlugin, { queryClient }]],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    usePlatformsMock.mockReturnValue({
      get: getPlatform,
      isPending: ref(false),
      isError: ref(false),
    } as unknown as ReturnType<typeof usePlatforms>);

    usePlatformActionsMock.mockReturnValue({
      connect: {
        mutate: connectMutate,
        isError: ref(false),
      },
      disconnect: {
        mutate: disconnectMutate,
        isPending: ref(false),
      },
    } as unknown as ReturnType<typeof usePlatformActions>);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders connected and disconnected platforms", () => {
    const wrapper = mountPlatforms();

    expect(wrapper.text()).toContain("Spotify");
    expect(wrapper.text()).toContain("Connected");
    expect(wrapper.text()).toContain("Disconnect");

    expect(wrapper.text()).toContain("Last.fm");
    expect(wrapper.text()).toContain("Link Last.fm");
  });

  it("starts connecting when a disconnected platform is selected", async () => {
    const wrapper = mountPlatforms();

    const lastFmButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Link Last.fm");

    expect(lastFmButton).toBeDefined();

    await lastFmButton!.trigger("click");

    expect(connectMutate).toHaveBeenCalledWith("lastfm");
  });

  it("disconnects a platform after confirmation", async () => {
    const confirmMock = vi.fn().mockReturnValue(true);
    vi.stubGlobal("confirm", confirmMock);

    const wrapper = mountPlatforms();

    const disconnectButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Disconnect");

    expect(disconnectButton).toBeDefined();

    await disconnectButton!.trigger("click");

    expect(confirmMock).toHaveBeenCalledWith("Disconnect Spotify?");
    expect(disconnectMutate).toHaveBeenCalledWith("spotify");
  });

  it("does not disconnect when confirmation is cancelled", async () => {
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));

    const wrapper = mountPlatforms();

    const disconnectButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Disconnect");

    await disconnectButton!.trigger("click");

    expect(disconnectMutate).not.toHaveBeenCalled();
  });

  it("shows loading placeholders while platforms are loading", () => {
    usePlatformsMock.mockReturnValue({
      get: vi.fn(() => undefined),
      isPending: ref(true),
      isError: ref(false),
    } as unknown as ReturnType<typeof usePlatforms>);

    const wrapper = mountPlatforms();

    expect(wrapper.findAll(".animate-pulse")).toHaveLength(2);
  });

  it("shows an error when platforms fail to load", () => {
    usePlatformsMock.mockReturnValue({
      get: vi.fn(() => undefined),
      isPending: ref(false),
      isError: ref(true),
    } as unknown as ReturnType<typeof usePlatforms>);

    const wrapper = mountPlatforms();

    expect(wrapper.text()).toContain("Could not load your platforms.");
  });

  it("shows an error when connecting fails", () => {
    usePlatformActionsMock.mockReturnValue({
      connect: {
        mutate: connectMutate,
        isError: ref(true),
      },
      disconnect: {
        mutate: disconnectMutate,
        isPending: ref(false),
      },
    } as unknown as ReturnType<typeof usePlatformActions>);

    const wrapper = mountPlatforms();

    expect(wrapper.text()).toContain("Could not start the connection.");
  });
});
