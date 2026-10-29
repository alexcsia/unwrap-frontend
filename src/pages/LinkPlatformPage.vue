<script setup lang="ts">
import { connectSpotifyUrl, connectLastfmUrl } from "@/services/api";
import PlatformCard from "@/components/platforms/PlatformCard.vue";

function linkSpotify() {
  window.location.href = connectSpotifyUrl;
}

function linkLastFm() {
  window.location.href = connectLastfmUrl;
}
</script>

<template>
  <main
    class="flex min-h-screen w-full flex-col bg-neutral-950 text-white md:flex-row"
  >
    <PlatformCard
      title="Spotify"
      description="Bring your listening history together. Connect your Spotify account to get started."
      button-text="Link Spotify"
      theme="emerald"
      @link="linkSpotify"
    />

    <PlatformCard
      title="Last.fm"
      description="Sync your scrobbles and discover your listening patterns. Connect your Last.fm account."
      button-text="Link Last.fm"
      theme="red"
      @link="linkLastFm"
    />
  </main>
</template>
