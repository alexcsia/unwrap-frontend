import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

const {
  useDateMock,
  useArtistsStatsMock,
  useTracksStatsMock,
  useTimeListenedStatsMock,
} = vi.hoisted(() => ({
  useDateMock: vi.fn(),
  useArtistsStatsMock: vi.fn(),
  useTracksStatsMock: vi.fn(),
  useTimeListenedStatsMock: vi.fn(),
}));

vi.mock("@/composables/stats/useDate", () => ({
  useDate: useDateMock,
  MODES: [
    { value: "year", label: "Year" },
    { value: "month", label: "Month" },
    { value: "day", label: "Day" },
    { value: "range", label: "Range" },
  ],
  MONTHS: ["January", "February", "March"],
  years: [2024, 2025, 2026],
}));

vi.mock("@/composables/stats/useStats", () => ({
  useArtistsStats: useArtistsStatsMock,
  useTracksStats: useTracksStatsMock,
  useTimeListenedStats: useTimeListenedStatsMock,
}));

import ListeningStats from "../ListeningStats.vue";

describe("StatisticsView", () => {
  let artistsRefetch: ReturnType<typeof vi.fn>;
  let tracksRefetch: ReturnType<typeof vi.fn>;
  let timeRefetch: ReturnType<typeof vi.fn>;

  let mode: ReturnType<typeof ref>;
  let selectedYear: ReturnType<typeof ref>;

  const artists = [
    { rank: 1, artistName: "Radiohead", playCount: 50, durationMs: 120000 },
  ];

  const tracks = [
    {
      rank: 1,
      trackName: "Everything In Its Right Place",
      artistNames: ["Radiohead"],
      albumName: "Kid A",
      plays: 20,
      durationMs: 240000,
    },
  ];

  const listeningTime = {
    statistics: {
      totalMs: 3600000,
      totalTracks: 25,
    },
    period: {
      start: "2026-01-01",
      end: "2026-01-31",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mode = ref("year");
    selectedYear = ref(2026);

    artistsRefetch = vi.fn();
    tracksRefetch = vi.fn();
    timeRefetch = vi.fn();

    useDateMock.mockReturnValue({
      selectedDay: ref(null),
      selectedMonth: ref(1),
      selectedRange: ref(null),
      selectedYear,
      mode,
      formatDuration: (ms: number) => `${ms}ms`,
      fmtDate: (date: string) => date,
      buildParams: vi.fn(() => ({
        year: selectedYear.value,
      })),
    });

    useArtistsStatsMock.mockReturnValue({
      topArtists: ref(artists),
      isLoading: ref(false),
      error: ref(null),
      refetch: artistsRefetch,
    });

    useTracksStatsMock.mockReturnValue({
      topTracks: ref(tracks),
      isLoading: ref(false),
      error: ref(null),
      refetch: tracksRefetch,
    });

    useTimeListenedStatsMock.mockReturnValue({
      timeListened: ref(listeningTime),
      isLoading: ref(false),
      error: ref(null),
      refetch: timeRefetch,
    });
  });

  function mountPage() {
    return mount(ListeningStats, {
      global: {
        stubs: {
          Navbar: true,

          StatCard: {
            props: ["label", "value"],
            template: `
              <div class="stat-card">
                <span>{{ label }}</span>
                <span>{{ value }}</span>
              </div>
            `,
          },

          RankedTable: {
            props: [
              "title",
              "columns",
              "rows",
              "loading",
              "error",
              "emptyMessage",
            ],
            template: `
              <section>
                <h2>{{ title }}</h2>
                <p v-if="error" role="alert">{{ error }}</p>
                <p v-else-if="!rows.length">{{ emptyMessage }}</p>
                <div v-for="row in rows" :key="row.rank">
                  {{ row.artistName || row.trackName }}
                </div>
                <slot name="actions" />
              </section>
            `,
          },

          VueDatePicker: {
            props: ["placeholder"],
            template: `<input :placeholder="placeholder" />`,
          },
        },
      },
    });
  }

  it("renders the statistics page", () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain("Listening stats");
    expect(wrapper.text()).toContain("Time listened");
    expect(wrapper.text()).toContain("Top artists");
    expect(wrapper.text()).toContain("Top tracks");
  });

  it("displays listening statistics", () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain("Total listening time");
    expect(wrapper.text()).toContain("3600000ms");
    expect(wrapper.text()).toContain("Tracks played");
    expect(wrapper.text()).toContain("25");
    expect(wrapper.text()).toContain("2026-01-01 – 2026-01-31");
  });

  it("displays top artists and tracks", () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain("Radiohead");
    expect(wrapper.text()).toContain("Everything In Its Right Place");
  });

  it("calls all queries when Refresh all is clicked", async () => {
    const wrapper = mountPage();

    const refreshBtn = wrapper
      .findAll("button")
      .find((b) => b.text() === "Refresh all");

    expect(refreshBtn).toBeDefined();
    await refreshBtn!.trigger("click");

    expect(artistsRefetch).toHaveBeenCalledOnce();
    expect(tracksRefetch).toHaveBeenCalledOnce();
    expect(timeRefetch).toHaveBeenCalledOnce();
  });

  it("refetches listening time when its Load button is clicked", async () => {
    const wrapper = mountPage();

    const buttons = wrapper.findAll("button");
    await buttons.find((button) => button.text() === "Load")!.trigger("click");

    expect(timeRefetch).toHaveBeenCalledOnce();
  });

  it("refetches artists when their Load button is clicked", async () => {
    const wrapper = mountPage();

    const artistSection = wrapper
      .findAll("section")
      .find((section) => section.text().includes("Top artists"))!;

    await artistSection.get("button").trigger("click");

    expect(artistsRefetch).toHaveBeenCalledOnce();
  });

  it("refetches tracks when their Load button is clicked", async () => {
    const wrapper = mountPage();

    const trackSection = wrapper
      .findAll("section")
      .find((section) => section.text().includes("Top tracks"))!;

    await trackSection.get("button").trigger("click");

    expect(tracksRefetch).toHaveBeenCalledOnce();
  });

  it("switches between date selection modes", async () => {
    const wrapper = mountPage();

    await wrapper.get("button").trigger("click"); // year

    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Month")!
      .trigger("click");

    expect(wrapper.findAll("select")).toHaveLength(2);

    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Day")!
      .trigger("click");

    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Range")!
      .trigger("click");
  });

  it("displays errors from the statistics queries", () => {
    useArtistsStatsMock.mockReturnValue({
      topArtists: ref([]),
      isLoading: ref(false),
      error: ref(new Error("Could not load artists")),
      refetch: artistsRefetch,
    });

    useTracksStatsMock.mockReturnValue({
      topTracks: ref([]),
      isLoading: ref(false),
      error: ref(new Error("Could not load tracks")),
      refetch: tracksRefetch,
    });

    useTimeListenedStatsMock.mockReturnValue({
      timeListened: ref(null),
      isLoading: ref(false),
      error: ref("Could not load listening time"),
      refetch: timeRefetch,
    });

    const wrapper = mountPage();

    expect(wrapper.text()).toContain("Could not load artists");
    expect(wrapper.text()).toContain("Could not load tracks");
    expect(wrapper.text()).toContain("Could not load listening time");
  });
});
