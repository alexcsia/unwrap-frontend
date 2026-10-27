<script setup lang="ts">
function linkSpotify() {
  window.location.href = "/api/auth/spotify";
}

function linkLastFm() {
  window.location.href = "/api/auth/lastfm";
}
</script>

<template>
  <main
    class="flex min-h-screen w-full flex-col bg-black text-white md:flex-row"
  >
    <section
      class="flex min-h-[50vh] flex-1 cursor-pointer items-center justify-center border-b border-neutral-800 p-8 hover:bg-neutral-900 md:min-h-screen md:border-b-0 md:border-r"
      role="link"
      tabindex="0"
      @click="linkSpotify"
      @keydown.enter="linkSpotify"
      @keydown.space.prevent="linkSpotify"
    >
      <div class="mx-auto max-w-md text-center">
        <h1 class="mb-4 text-5xl font-bold md:text-6xl">Spotify</h1>

        <p class="mx-auto mb-8 max-w-sm text-neutral-400">
          Bring your listening history together. Connect your Spotify account to
          get started.
        </p>

        <button
          type="button"
          class="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-500"
          @click.stop="linkSpotify"
        >
          Link Spotify ↗
        </button>
      </div>
    </section>

    <section
      class="flex min-h-[50vh] flex-1 cursor-pointer items-center justify-center p-8 hover:bg-neutral-900 md:min-h-screen"
      role="link"
      tabindex="0"
      @click="linkLastFm"
      @keydown.enter="linkLastFm"
      @keydown.space.prevent="linkLastFm"
    >
      <div class="mx-auto max-w-md text-center">
        <h1 class="mb-4 text-5xl font-bold md:text-6xl">Last.fm</h1>

        <p class="mx-auto mb-8 max-w-sm text-neutral-400">
          Sync your scrobbles and discover your listening patterns. Connect your
          Last.fm account.
        </p>

        <button
          type="button"
          class="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-500"
          @click.stop="linkLastFm"
        >
          Link Last.fm ↗
        </button>
      </div>
    </section>
  </main>
</template>
