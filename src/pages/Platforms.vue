<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlatforms, usePlatformActions } from "@/composables/usePlatforms";
import type { PlatformName } from "@/services/api";
import PlatformCard from "@/components/platforms/PlatformCard.vue";
import ConnectionCard from "@/components/platforms/ConnectionCard.vue";

const route = useRoute();
const router = useRouter();
const { get, isPending, isError, refetch } = usePlatforms();
const { connect, disconnect } = usePlatformActions();

const notice = ref<string | null>(null);

const PLATFORMS: {
  name: PlatformName;
  label: string;
  description: string;
  buttonText: string;
  theme: "emerald" | "red";
}[] = [
  {
    name: "spotify",
    label: "Spotify",
    description:
      "Bring your listening history together. Connect your Spotify account to get started.",
    buttonText: "Link Spotify",
    theme: "emerald",
  },
  {
    name: "lastfm",
    label: "Last.fm",
    description:
      "Sync your scrobbles and discover your listening patterns. Connect your Last.fm account.",
    buttonText: "Link Last.fm",
    theme: "red",
  },
];

onMounted(() => {
  if (route.query.connected) {
    notice.value = `Platform connected, ${route.query.connected} `;
  }
  if (route.query.error) notice.value = "Could not connect. Please try again.";
  if (route.query.connected || route.query.error) {
    refetch();

    router.replace({ query: {} });
  }
});

function onDisconnect(name: PlatformName, label: string) {
  if (confirm(`Disconnect ${label}?`)) {
    disconnect.mutate(name);
  }
}
</script>

<template>
  <main class="flex min-h-screen w-full flex-col bg-neutral-950 text-white">
    <h1 class="text-2xl font-bold">Your platforms</h1>

    <p v-if="notice" role="status">{{ notice }}</p>
    <p v-if="connect.isError.value" role="alert">
      Could not start the connection.
    </p>
    <p v-if="isError" role="alert" class="">Could not load your platforms.</p>

    <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      <template v-for="p in PLATFORMS" :key="p.name">
        <ConnectionCard
          v-if="get(p.name)"
          :label="p.label"
          :busy="disconnect.isPending.value"
          @disconnect="onDisconnect(p.name, p.label)"
        >
          <details v-if="p.name === 'spotify'">
            <summary>How to upload your extended history</summary>
          </details>
        </ConnectionCard>

        <div
          v-else-if="isPending"
          class="h-48 animate-pulse rounded-lg bg-neutral-800"
        />

        <PlatformCard
          v-else
          :title="p.label"
          :description="p.description"
          :button-text="p.buttonText"
          :theme="p.theme"
          @link="connect.mutate(p.name)"
        />
      </template>
    </div>
  </main>
</template>
