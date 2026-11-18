import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ConnectionCard from "../ConnectionCard.vue";

describe("ConnectionCard", () => {
  it("renders the platform label and connected status", () => {
    const wrapper = mount(ConnectionCard, {
      props: {
        label: "Spotify",
      },
    });

    expect(wrapper.text()).toContain("Spotify");
    expect(wrapper.text()).toContain("Connected");
  });

  it("emits disconnect when the button is clicked", async () => {
    const wrapper = mount(ConnectionCard, {
      props: {
        label: "Spotify",
      },
    });

    await wrapper.get("button").trigger("click");

    expect(wrapper.emitted("disconnect")).toHaveLength(1);
  });

  it("disables the button and displays a loading label when busy", () => {
    const wrapper = mount(ConnectionCard, {
      props: {
        label: "Spotify",
        busy: true,
      },
    });

    const button = wrapper.get("button");

    expect(button.text()).toBe("Disconnecting...");
    expect(button.attributes("disabled")).toBeDefined();
  });

  it("renders content passed through its slot", () => {
    const wrapper = mount(ConnectionCard, {
      props: {
        label: "Spotify",
      },
      slots: {
        default: "<p>Additional Spotify instructions</p>",
      },
    });

    expect(wrapper.text()).toContain("Additional Spotify instructions");
  });
});
