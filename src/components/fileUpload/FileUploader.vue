<script setup lang="ts">
import { ref } from "vue";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const SUPPORTED_PLATFORMS = ["spotify"] as const;

export type Platform = (typeof SUPPORTED_PLATFORMS)[number];

const emit = defineEmits<{
  upload: [payload: { file: File; platform: Platform }];
}>();

const selectedFile = ref<File | null>(null);
const selectedPlatform = ref<Platform>("spotify");
const error = ref<string | null>(null);
const isUploading = ref(false);

const validateFile = (file: File): string | null => {
  if (file.size === 0) {
    return "File is empty.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File must be smaller than 50 MB.";
  }

  if (
    file.type !== "application/zip" &&
    file.type !== "application/x-zip-compressed"
  ) {
    console.log(file.type);
    return "Please select a ZIP archive.";
  }

  if (!file.name.endsWith(".zip")) {
    return "File name must end with .zip.";
  }

  return null;
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  error.value = null;
  selectedFile.value = null;

  if (!file) return;

  const validationError = validateFile(file);

  if (validationError) {
    error.value = validationError;
    input.value = "";
    return;
  }

  selectedFile.value = file;
};

const handleUpload = () => {
  error.value = null;

  if (!selectedFile.value) {
    error.value = "Please select a ZIP file first.";
    return;
  }

  emit("upload", {
    file: selectedFile.value,
    platform: selectedPlatform.value,
  });
};

const formatFileSize = (bytes: number) => {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
</script>

<template>
  <section
    class="w-full max-w-xl rounded-xl border border-gray-200 bg-surface p-6"
  >
    <h2 class="text-lg font-semibold text-brand">Upload listening history</h2>

    <p class="mt-1 text-sm text-gray-200">
      Upload your Spotify history as a ZIP archive.
    </p>

    <div class="mt-5">
      <label
        for="platform"
        class="mb-2 block text-sm font-medium text-gray-200"
      >
        Platform
      </label>

      <select
        id="platform"
        v-model="selectedPlatform"
        class="w-full rounded-lg border cursor-pointer border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option
          v-for="platform in SUPPORTED_PLATFORMS"
          :key="platform"
          :value="platform"
        >
          {{ platform }}
        </option>
      </select>
    </div>

    <div class="mt-5">
      <label
        for="history-file"
        class="mb-2 block text-sm font-medium text-gray-200"
      >
        ZIP archive
      </label>

      <input
        id="history-file"
        type="file"
        accept=".zip,application/zip"
        @change="handleFileChange"
        class="block w-full cursor-pointer rounded-lg border border-gray-700 text-sm text-gray-200 file:mr-4 file:border-0 file:bg-brand file:px-4 file:py-3 file:text-sm file:font-medium file:text-gray-800"
      />

      <p class="mt-2 text-xs text-gray-300">
        ZIP files only. Maximum size: 50 MB.
      </p>
    </div>

    <div v-if="selectedFile" class="mt-4 rounded-lg bg-gray-50 p-3">
      <p class="text-sm font-medium text-gray-800">
        {{ selectedFile.name }}
      </p>
      <p class="mt-1 text-xs text-gray-500">
        {{ formatFileSize(selectedFile.size) }}
      </p>
    </div>

    <p v-if="error" role="alert" class="mt-3 text-sm text-error">
      {{ error }}
    </p>

    <button
      type="button"
      :disabled="!selectedFile || isUploading"
      @click="handleUpload"
      class="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {{ isUploading ? "Uploading..." : "Upload history" }}
    </button>
  </section>
</template>
