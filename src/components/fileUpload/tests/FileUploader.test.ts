import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import FileUploader from "../FileUploader.vue";

function makeFile(
  name: string,
  sizeBytes: number,
  type = "application/zip",
): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", {
    value: sizeBytes,
    configurable: true,
  });
  return file;
}

function setInputFile(input: HTMLInputElement, file: File | null) {
  const files = file ? [file] : [];
  Object.defineProperty(input, "files", {
    value: files,
    configurable: true,
  });
}

describe("FileUploader", () => {
  it("renders initial state with upload button disabled and no file selected", () => {
    const wrapper = mount(FileUploader);

    const button = wrapper.find("button");
    expect(wrapper.text()).toContain("Upload listening history");
    expect(wrapper.text()).toContain("spotify");
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.text()).toBe("Upload history");
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it("rejects an empty file", async () => {
    const wrapper = mount(FileUploader);
    const input = wrapper.find('input[type="file"]');
    const el = input.element as HTMLInputElement;

    setInputFile(el, makeFile("history.zip", 0));
    await input.trigger("change");

    expect(wrapper.find('[role="alert"]').text()).toBe("File is empty.");
    expect(el.value).toBe("");
    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
  });

  it("rejects a file larger than 50 MB", async () => {
    const wrapper = mount(FileUploader);
    const input = wrapper.find('input[type="file"]');
    const el = input.element as HTMLInputElement;
    const overLimit = 50 * 1024 * 1024 + 1;

    setInputFile(el, makeFile("history.zip", overLimit));
    await input.trigger("change");

    expect(wrapper.find('[role="alert"]').text()).toBe(
      "File must be smaller than 50 MB.",
    );
    expect(el.value).toBe("");
  });

  it("rejects non-ZIP MIME types", async () => {
    const wrapper = mount(FileUploader);
    const input = wrapper.find('input[type="file"]');
    const el = input.element as HTMLInputElement;

    setInputFile(el, makeFile("history.zip", 1024, "application/json"));
    await input.trigger("change");

    expect(wrapper.find('[role="alert"]').text()).toBe(
      "Please select a ZIP archive.",
    );
    expect(el.value).toBe("");
  });

  it("rejects ZIP MIME type if filename does not end with .zip", async () => {
    const wrapper = mount(FileUploader);
    const input = wrapper.find('input[type="file"]');
    const el = input.element as HTMLInputElement;

    setInputFile(el, makeFile("history.tar.gz", 1024, "application/zip"));
    await input.trigger("change");

    expect(wrapper.find('[role="alert"]').text()).toBe(
      "File name must end with .zip.",
    );
    expect(el.value).toBe("");
  });

  it("accepts a valid ZIP file, displays details, and emits upload payload", async () => {
    const wrapper = mount(FileUploader);
    const input = wrapper.find('input[type="file"]');
    const el = input.element as HTMLInputElement;
    const twoMb = 2 * 1024 * 1024;
    const validFile = makeFile(
      "my_spotify_data.zip",
      twoMb,
      "application/x-zip-compressed",
    );

    setInputFile(el, validFile);
    await input.trigger("change");

    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.text()).toContain("my_spotify_data.zip");
    expect(wrapper.text()).toContain("2.00 MB");

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeUndefined();

    await button.trigger("click");

    expect(wrapper.emitted("upload")).toEqual([
      [{ file: validFile, platform: "spotify" }],
    ]);
  });

  it("clears previous error when a valid file is selected", async () => {
    const wrapper = mount(FileUploader);
    const input = wrapper.find('input[type="file"]');
    const el = input.element as HTMLInputElement;

    setInputFile(el, makeFile("bad.txt", 100, "text/plain"));
    await input.trigger("change");
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);

    setInputFile(el, makeFile("good.zip", 1024 * 1024, "application/zip"));
    await input.trigger("change");

    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.text()).toContain("good.zip");
  });
});
