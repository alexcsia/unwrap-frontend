<script setup lang="ts">
import { connectSpotifyUrl, connectLastfmUrl } from "@/services/api";

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
    <section
      class="group relative flex min-h-[50vh] flex-1 cursor-pointer items-center justify-center overflow-hidden border-b border-white/10 bg-neutral-950 p-8 transition-colors duration-500 hover:bg-emerald-500/15 md:min-h-screen md:border-b-0 md:border-r"
      role="link"
      tabindex="0"
      @click="linkSpotify"
      @keydown.enter="linkSpotify"
      @keydown.space.prevent="linkSpotify"
    >
      <div class="relative z-10 mx-auto max-w-md text-center">
        <h1 class="mb-5 text-5xl font-bold tracking-tight md:text-7xl">
          Spotify
        </h1>

        <p
          class="mx-auto mb-10 max-w-sm text-base leading-7 text-neutral-400 md:text-lg"
        >
          Bring your listening history together. Connect your Spotify account to
          get started.
        </p>

        <button
          type="button"
          class="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3.5 font-medium transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 group-hover:border-emerald-400/60"
          @click.stop="linkSpotify"
        >
          Link Spotify
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>

    <section
      class="group relative flex min-h-[50vh] flex-1 cursor-pointer items-center justify-center overflow-hidden bg-neutral-950 p-8 transition-colors duration-500 hover:bg-red-500/15 md:min-h-screen"
      role="link"
      tabindex="0"
      @click="linkLastFm"
      @keydown.enter="linkLastFm"
      @keydown.space.prevent="linkLastFm"
    >
      <div class="relative z-10 mx-auto max-w-md text-center">
        <h1 class="mb-5 text-5xl font-bold tracking-tight md:text-7xl">
          Last.fm
        </h1>

        <p
          class="mx-auto mb-10 max-w-sm text-base leading-7 text-neutral-400 md:text-lg"
        >
          Sync your scrobbles and discover your listening patterns. Connect your
          Last.fm account.
        </p>

        <button
          type="button"
          class="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3.5 font-medium transition-all duration-300 hover:border-red-400 hover:bg-red-500 hover:text-white group-hover:border-red-400/60"
          @click.stop="linkLastFm"
        >
          Link Last.fm
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  </main>
</template>
