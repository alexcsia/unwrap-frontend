import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import RankedTable, {
  type RankedColumn,
} from "@/components/statistics/RankedTable.vue";

describe("RankedTable", () => {
  const columns: RankedColumn[] = [
    { key: "rank", label: "#" },
    { key: "name", label: "Name" },
    {
      key: "plays",
      label: "Plays",
      format: (row) => `${row.plays} plays`,
    },
  ];

  it("renders title, actions slot, column headers, and formatted/raw cell values", () => {
    const wrapper = mount(RankedTable, {
      props: {
        title: "Top tracks",
        columns,
        rows: [
          { rank: 1, name: "track1", plays: 120 },
          { rank: 2, name: "track2", plays: 95 },
        ],
      },
      slots: {
        actions: "<button type='button'>Refresh</button>",
      },
    });

    expect(wrapper.text()).toContain("Top tracks");
    expect(wrapper.find("button").text()).toBe("Refresh");

    const headers = wrapper.findAll("th").map((th) => th.text());
    expect(headers).toEqual(["#", "Name", "Plays"]);

    const cells = wrapper.findAll("td").map((td) => td.text());
    expect(cells).toEqual([
      "1",
      "track1",
      "120 plays",
      "2",
      "track2",
      "95 plays",
    ]);
  });

  it("renders '-' for null or undefined cell values when no formatter is provided", () => {
    const wrapper = mount(RankedTable, {
      props: {
        title: "Users",
        columns: [
          { key: "name", label: "Name" },
          { key: "bio", label: "Bio" },
        ],
        rows: [{ name: "user_one", bio: null }, { name: "user_two" }],
      },
    });

    const cells = wrapper.findAll("td").map((td) => td.text());
    expect(cells).toEqual(["user_one", "-", "user_two", "-"]);
  });

  it("shows error alert when not loading and error is provided", () => {
    const wrapper = mount(RankedTable, {
      props: {
        title: "Users",
        columns,
        rows: [],
        loading: false,
        error: "Could not load users.",
      },
    });

    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe("Could not load users.");
    expect(wrapper.find("table").exists()).toBe(false);
  });

  it("shows custom emptyMessage when rows array is empty", () => {
    const wrapper = mount(RankedTable, {
      props: {
        title: "Users",
        columns,
        rows: [],
        emptyMessage: "No users found.",
      },
    });

    expect(wrapper.text()).toContain("No users found.");
    expect(wrapper.find("table").exists()).toBe(false);
  });
});
