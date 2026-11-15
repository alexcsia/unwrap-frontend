<script setup lang="ts">
import FileUploader from "@/components/FileUploader.vue";
import axios from "axios";

const uploadHistory = async ({
  file,
  platform,
}: {
  file: File;
  platform: "spotify" | "lastfm";
}) => {
  const formData = new FormData();

  formData.append("file", file);

  await axios.post(`/api/history/${platform}`, formData);
};
</script>

<template>
  <FileUploader @upload="uploadHistory" />
</template>
