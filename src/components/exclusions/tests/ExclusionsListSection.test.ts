import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import ExclusionListSection from "../ExclusionListSection.vue";
import type { Exclusions } from "@/services/api";

describe("ExclusionListSection", () => {
  const exclusions: Exclusions = {
    artists: [
      {
        type: "artist",
        artistId: "artist-1",
        artistName: "The Kryptonite Sparks",
        excludedAt: new Date("2026-11-08T12:00:00.000Z"),
      },
    ],
    tracks: [
      {
        type: "track",
        trackId: "track-1",
        trackName: "Example Song",
        artistName: "Example Artist",
        albumName: "Example Album",
        excludedAt: new Date("2026-11-08T12:00:00.000Z"),
      },
    ],
  };

  it("renders the excluded artists and tracks", () => {
    const wrapper = mount(ExclusionListSection, {
      props: {
        exclusions,
        isPending: false,
        onDelete: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain("Your Current Exclusions");

    expect(wrapper.text()).toContain("Artists");
    expect(wrapper.text()).toContain("The Kryptonite Sparks");

    expect(wrapper.text()).toContain("Tracks");
    expect(wrapper.text()).toContain("Example Song");
    expect(wrapper.text()).toContain("Example Artist");
    expect(wrapper.text()).toContain("Example Album");
  });

  it("shows a loading state when pending", () => {
    const wrapper = mount(ExclusionListSection, {
      props: {
        exclusions: { artists: [], tracks: [] },
        isPending: true,
        onDelete: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain("Loading your exclusions...");
    expect(wrapper.text()).not.toContain("No active exclusions found.");
  });

  it("shows an empty state when there are no exclusions", () => {
    const wrapper = mount(ExclusionListSection, {
      props: {
        exclusions: { artists: [], tracks: [] },
        isPending: false,
        onDelete: vi.fn(),
      },
    });

    expect(wrapper.text()).toContain("No active exclusions found.");
  });

  it("calls onDelete with the artist ID and type", async () => {
    const onDelete = vi.fn();

    const wrapper = mount(ExclusionListSection, {
      props: {
        exclusions,
        isPending: false,
        onDelete,
      },
    });

    const deleteButtons = wrapper.findAll("button");

    await deleteButtons[0].trigger("click");

    expect(onDelete).toHaveBeenCalledWith("artist-1", "artist");
  });

  it("calls onDelete with the track ID and type", async () => {
    const onDelete = vi.fn();

    const wrapper = mount(ExclusionListSection, {
      props: {
        exclusions,
        isPending: false,
        onDelete,
      },
    });

    const deleteButtons = wrapper.findAll("button");

    await deleteButtons[1].trigger("click");

    expect(onDelete).toHaveBeenCalledWith("track-1", "track");
  });
});
