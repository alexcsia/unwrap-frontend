import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ProfileField from "@/components/profile/ProfileField.vue";

describe("ProfileField", () => {
  it("renders the label and initial value in read mode", () => {
    const wrapper = mount(ProfileField, {
      props: {
        label: "Username",
        value: "user123",
      },
    });

    expect(wrapper.text()).toContain("Username");
    expect(wrapper.text()).toContain("user123");
    expect(wrapper.find("input").exists()).toBe(false);
    expect(wrapper.find("button").text()).toBe("Change");
  });

  it("enters edit mode with prefilled input and default text type", async () => {
    const wrapper = mount(ProfileField, {
      props: {
        label: "Username",
        value: "user123",
      },
    });

    await wrapper.find("button").trigger("click");

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect((input.element as HTMLInputElement).value).toBe("user123");
    expect(input.attributes("type")).toBe("text");
  });

  it("uses the provided input type such as email", async () => {
    const wrapper = mount(ProfileField, {
      props: {
        label: "Email",
        value: "user@example.com",
        type: "email",
      },
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.find("input").attributes("type")).toBe("email");
  });

  it("emits save with trimmed value and exits edit mode", async () => {
    const wrapper = mount(ProfileField, {
      props: {
        label: "Username",
        value: "user123",
      },
    });

    await wrapper.find("button").trigger("click");
    await wrapper.find("input").setValue("  newuser456  ");

    const saveButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Save");
    await saveButton!.trigger("click");

    expect(wrapper.emitted("save")).toEqual([["newuser456"]]);
    expect(wrapper.find("input").exists()).toBe(false);
  });

  it("cancels without emitting save when value is empty or unchanged", async () => {
    const wrapper = mount(ProfileField, {
      props: {
        label: "Username",
        value: "user123",
      },
    });

    await wrapper.find("button").trigger("click");
    await wrapper.find("input").setValue("   ");

    const saveButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Save");
    await saveButton!.trigger("click");

    expect(wrapper.emitted("save")).toBeUndefined();
    expect(wrapper.find("input").exists()).toBe(false);

    await wrapper.find("button").trigger("click");
    await wrapper.find("input").setValue("user123");
    await saveButton!.trigger("click");

    expect(wrapper.emitted("save")).toBeUndefined();
  });

  it("resets draft value and exits edit mode on cancel", async () => {
    const wrapper = mount(ProfileField, {
      props: {
        label: "Username",
        value: "user123",
      },
    });

    await wrapper.find("button").trigger("click");
    await wrapper.find("input").setValue("changed_draft");

    const cancelButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Cancel");
    await cancelButton!.trigger("click");

    expect(wrapper.emitted("save")).toBeUndefined();
    expect(wrapper.find("input").exists()).toBe(false);

    await wrapper.find("button").trigger("click");
    expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
      "user123",
    );
  });

  it("updates inputValue when props.value changes", async () => {
    const wrapper = mount(ProfileField, {
      props: {
        label: "Username",
        value: "oldname",
      },
    });

    await wrapper.setProps({ value: "updatedname" });
    await wrapper.find("button").trigger("click");

    expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
      "updatedname",
    );
  });
});
