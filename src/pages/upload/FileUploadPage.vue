<script setup lang="ts">
import FileUploader, {
  type Platform,
} from "@/components/fileUpload/FileUploader.vue";
import Navbar from "@/components/navbar/Navbar.vue";
import { useUploadHistory } from "@/composables/uploader/useUploadHistory";
import { toast } from "vue-sonner";
import { ApiError } from "@/services/api";

const { mutateAsync, isPending, isError, error } = useUploadHistory();

const handleUpload = async (payload: { file: File; platform: Platform }) => {
  try {
    await mutateAsync(payload);
    toast.success("Uploaded listening history successfully.");
  } catch (err) {
    if (err instanceof ApiError) {
      toast.error(err.message);
    } else {
      toast.error("Something went wrong. Try again later");
    }
  }
};
</script>

<template>
  <Navbar />
  <div
    class="w-full min-h-screen flex flex-col items-center justify-center gap-4"
  >
    <FileUploader
      :disabled="isPending"
      @upload="(payload) => handleUpload(payload)"
    />

    <p v-if="isPending" class="text-sm text-neutral-400">
      Uploading listening history...
    </p>
    <p v-if="isError" role="alert" class="text-sm text-red-400">
      {{ error?.message ?? "Failed to upload history archive." }}
    </p>
  </div>
</template>
