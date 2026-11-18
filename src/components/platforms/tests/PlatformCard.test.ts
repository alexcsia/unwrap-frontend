import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PlatformCard from "../PlatformCard.vue";

describe("PlatformCard", () => {
  const defaultProps = {
    title: "Spotify",
    description: "Connect your Spotify account.",
    buttonText: "Link Spotify",
    theme: "emerald" as const,
  };

  it("renders the platform information", () => {
    const wrapper = mount(PlatformCard, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain("Spotify");
    expect(wrapper.text()).toContain("Connect your Spotify account.");
    expect(wrapper.text()).toContain("Link Spotify");
  });

  it("emits link when the button is clicked", async () => {
    const wrapper = mount(PlatformCard, {
      props: defaultProps,
    });

    await wrapper.get("button").trigger("click");

    expect(wrapper.emitted("link")).toHaveLength(1);
  });

  it("applies the correct theme classes", () => {
    const wrapper = mount(PlatformCard, {
      props: {
        ...defaultProps,
        theme: "red",
      },
    });

    expect(wrapper.get("section").classes()).toContain("hover:bg-red-500/15");
  });
});
