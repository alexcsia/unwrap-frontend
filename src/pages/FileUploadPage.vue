<script setup lang="ts">
import FileUploader from "@/components/fileUpload/FileUploader.vue";
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
};
</script>

<template>
  <Navbar />
  <div class="w-full min-h-screen flex items-center justify-center">
    <FileUploader @upload="uploadHistory" />
  </div>
</template>
