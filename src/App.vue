<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchUser();
});
</script>

<template>
  <RouterView></RouterView>
  <Toaster position="bottom-right" richColors />
</template>
