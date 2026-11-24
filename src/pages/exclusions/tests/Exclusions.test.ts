import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { ref } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import ExclusionsPage from "../ExclusionsPage.vue";

import {
  useExclusions,
  useExclusionsActions,
} from "@/composables/exclusions/useExclusions";

import { searchEntity } from "@/services/exclusions.ts";

vi.mock("@/composables/exclusions/useExclusions", () => ({
  useExclusions: vi.fn(),
  useExclusionsActions: vi.fn(),
}));

vi.mock("@/services/exclusions.ts", () => ({
  searchEntity: vi.fn(),
}));

const useExclusionsMock = vi.mocked(useExclusions);
const useExclusionsActionsMock = vi.mocked(useExclusionsActions);
const searchEntityMock = vi.mocked(searchEntity);

const mountWithQuery = (component: typeof ExclusionsPage, options = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return mount(component, {
    ...options,
    global: {
      plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
      stubs: {
        Navbar: true,
        RouterLink: {
          template: "<a><slot /></a>",
        },
      },
    },
  });
};

describe("Exclusions page", () => {
  const addMutateAsync = vi.fn().mockResolvedValue(undefined);
  const removeMutateAsync = vi.fn().mockResolvedValue(undefined);

  const exclusions = {
    artists: [
      {
        type: "artist" as const,
        artistId: "artist-1",
        artistName: "Example Artist",
        excludedAt: new Date("2026-11-08T12:00:00.000Z"),
      },
    ],
    tracks: [
      {
        type: "track" as const,
        trackId: "track-1",
        trackName: "Example Track",
        artistName: "Example Artist",
        albumName: "Example Album",
        excludedAt: new Date("2026-11-08T12:00:00.000Z"),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    addMutateAsync.mockResolvedValue(undefined);
    removeMutateAsync.mockResolvedValue(undefined);

    useExclusionsMock.mockReturnValue({
      exclusions: ref(exclusions),
      isPending: ref(false),
    } as unknown as ReturnType<typeof useExclusions>);

    useExclusionsActionsMock.mockReturnValue({
      add: {
        mutateAsync: addMutateAsync,
      },
      remove: {
        mutateAsync: removeMutateAsync,
      },
    } as unknown as ReturnType<typeof useExclusionsActions>);
  });

  function mountPage() {
    return mountWithQuery(ExclusionsPage);
  }

  it("renders the search and exclusion sections", () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain("Manage Exclusions");
    expect(wrapper.text()).toContain("Your Current Exclusions");
    expect(wrapper.text()).toContain("Example Artist");
    expect(wrapper.text()).toContain("Example Track");
  });

  it("passes the loading state to the exclusion list", () => {
    useExclusionsMock.mockReturnValue({
      exclusions: ref({ artists: [], tracks: [] }),
      isPending: ref(true),
    } as unknown as ReturnType<typeof useExclusions>);

    const wrapper = mountPage();

    expect(wrapper.text()).toContain("Loading your exclusions...");
  });

  it("adds an exclusion through the mutation", async () => {
    searchEntityMock.mockResolvedValue([
      {
        id: "artist-2",
        name: "Another Artist",
        entityType: "artist",
      },
    ]);

    const wrapper = mountPage();

    const artistButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "ARTIST");

    await artistButton!.trigger("click");
    await wrapper.get("input").setValue("Another Artist");

    const searchButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Search");

    await searchButton!.trigger("click");
    await flushPromises();

    const excludeButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Exclude");

    expect(excludeButton).toBeDefined();

    await excludeButton!.trigger("click");
    await flushPromises();

    expect(addMutateAsync).toHaveBeenCalledWith({
      targetId: "artist-2",
      type: "artist",
    });
  });

  it("deletes an artist exclusion through the mutation", async () => {
    const wrapper = mountPage();

    const deleteButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Delete");

    expect(deleteButton).toBeDefined();

    await deleteButton!.trigger("click");
    await flushPromises();

    expect(removeMutateAsync).toHaveBeenCalledWith({
      targetId: "artist-1",
      type: "artist",
    });
  });

  it("deletes a track exclusion through the mutation", async () => {
    const wrapper = mountPage();

    const deleteButtons = wrapper
      .findAll("button")
      .filter((button) => button.text() === "Delete");

    expect(deleteButtons).toHaveLength(2);

    await deleteButtons[1].trigger("click");
    await flushPromises();

    expect(removeMutateAsync).toHaveBeenCalledWith({
      targetId: "track-1",
      type: "track",
    });
  });
});
