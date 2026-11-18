<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logout } from "@/services/api";
import { useQueryClient } from "@tanstack/vue-query";

const isOpen = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const router = useRouter();
const queryClient = useQueryClient();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const openProfile = async () => {
  isOpen.value = false;
  try {
    await router.push({ name: "profile" });
  } catch (err) {
    console.error(err);
    error.value = "Could not load your profile.";
  }
};

const openPlatforms = async () => {
  try {
    await router.replace("/platforms");
  } catch (err) {
    console.error(err);
    error.value = "Could not open platforms.";
  }
};

const signOut = async () => {
  loading.value = true;
  error.value = null;

  try {
    await logout();
    queryClient.clear();
    isOpen.value = false;
    await router.replace("/login");
  } catch (err) {
    console.error(err);
    error.value = "Could not log out. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="relative">
    <button
      class="px-3.5 py-2.5 border border-[#444] rounded-lg bg-surface text-white cursor-pointer"
      type="button"
      @click="toggleMenu"
      aria-label="Open profile menu"
      :aria-expanded="isOpen"
    >
      ☰
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 top-[calc(100%+8px)] right-0 min-w-[180px] p-2 border border-[#333] rounded-[10px] bg-surface shadow-[0_8px_24px_#0005]"
    >
      <button
        type="button"
        class="block w-full p-[11px] border-0 rounded-md bg-transparent text-white text-left cursor-pointer hover:bg-[#303030] disabled:opacity-50"
        :disabled="loading"
        @click="openProfile"
      >
        Profile
      </button>

      <button
        type="button"
        class="block w-full p-[11px] border-0 rounded-md bg-transparent text-white text-left cursor-pointer hover:bg-[#303030] disabled:opacity-50"
        :disabled="loading"
        @click="openPlatforms"
      >
        Platforms
      </button>

      <button
        type="button"
        class="block w-full p-[11px] border-0 rounded-md bg-transparent text-white text-left cursor-pointer hover:bg-[#303030] disabled:opacity-50"
        :disabled="loading"
        @click="signOut"
      >
        Log out
      </button>

      <p v-if="error" class="px-[10px] text-error text-[0.85rem]" role="alert">
        {{ error }}
      </p>
    </div>
  </div>
</template>
