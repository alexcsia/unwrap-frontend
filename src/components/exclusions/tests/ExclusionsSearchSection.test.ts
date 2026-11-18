import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import ExclusionSearchSection from "../ExclusionSearchSection.vue";
import { searchEntity } from "@/services/api";
import { toast } from "vue-sonner";

vi.mock("@/services/api", () => ({
  searchEntity: vi.fn(),
}));

vi.mock("vue-sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const searchEntityMock = vi.mocked(searchEntity);

describe("ExclusionSearchSection", () => {
  const onAdd = vi.fn().mockResolvedValue(undefined);
  const defaultExclusions = { artists: [], tracks: [] };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search controls", () => {
    const wrapper = mount(ExclusionSearchSection, {
      props: {
        onAdd,
        exclusions: defaultExclusions,
      },
    });

    expect(wrapper.text()).toContain("Manage Exclusions");
    expect(wrapper.text()).toContain("TRACK");
    expect(wrapper.text()).toContain("ARTIST");
    expect(wrapper.text()).toContain("Search");
  });

  it("shows an error if no entity type is selected", async () => {
    const wrapper = mount(ExclusionSearchSection, {
      props: {
        onAdd,
        exclusions: defaultExclusions,
      },
    });

    await wrapper.get("input").setValue("Example Artist");

    const searchButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Search");

    await searchButton!.trigger("click");

    expect(toast.error).toHaveBeenCalledWith(
      "Please select whether you are looking for a track or an artist.",
    );

    expect(searchEntityMock).not.toHaveBeenCalled();
  });

  it("shows an error if the search input is empty", async () => {
    const wrapper = mount(ExclusionSearchSection, {
      props: {
        onAdd,
        exclusions: defaultExclusions,
      },
    });

    const artistButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "ARTIST");

    await artistButton!.trigger("click");

    await wrapper.get("input").setValue("   ");

    const searchButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Search");

    await searchButton!.trigger("click");

    expect(toast.error).toHaveBeenCalledWith("Please enter a search name.");

    expect(searchEntityMock).not.toHaveBeenCalled();
  });

  it("searches for artists and displays the results", async () => {
    searchEntityMock.mockResolvedValue([
      {
        id: "artist-1",
        name: "Artist",
        entityType: "artist",
      },
    ]);

    const wrapper = mount(ExclusionSearchSection, {
      props: {
        onAdd,
        exclusions: defaultExclusions,
      },
    });

    const artistButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "ARTIST");

    const searchButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Search");

    await artistButton!.trigger("click");
    await wrapper.get("input").setValue("Artist");
    await searchButton!.trigger("click");

    expect(searchEntityMock).toHaveBeenCalledWith({
      type: "artist",
      name: "Artist",
      limit: 10,
      cursor: null,
    });

    expect(wrapper.text()).toContain("Search Results");
    expect(wrapper.text()).toContain("Artist");
  });

  it("calls onAdd with the selected result ID and type", async () => {
    searchEntityMock.mockResolvedValue([
      {
        id: "artist-1",
        name: "Artist",
        entityType: "artist",
      },
    ]);

    const wrapper = mount(ExclusionSearchSection, {
      props: {
        onAdd,
        exclusions: defaultExclusions,
      },
    });

    const artistButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "ARTIST");

    await artistButton!.trigger("click");

    await wrapper.get("input").setValue("Artist");

    const searchButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Search");

    await searchButton!.trigger("click");

    const excludeButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Exclude");

    expect(excludeButton).toBeDefined();

    await excludeButton!.trigger("click");

    expect(onAdd).toHaveBeenCalledWith("artist-1", "artist");
  });
});
