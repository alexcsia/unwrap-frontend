<script setup lang="ts">
import { usePlatforms } from "@/composables/platforms/usePlatforms";
import RecentTracksCard from "./RecentTracksCard.vue";
import { useRecentTracks } from "@/composables/dashboard/useRecentTracks.ts";

const { hasPlatform, isPending, isError } = usePlatforms();
const { data: recentTracks } = useRecentTracks();
</script>

<template>
  <main class="max-w-6xl mx-auto px-6 py-16 md:py-24">
    <section
      class="bg-surface border border-white/10 rounded-2xl p-8 md:p-14 shadow-xl"
    >
      <div class="max-w-2xl">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Discover your
          <span class="text-brand">music story.</span>
        </h1>

        <p class="mt-6 text-base md:text-lg leading-relaxed text-white/60">
          Unwrap brings your listening history together and helps you understand
          your music activity. Explore your favorite artists, tracks and
          listening habits in one place.
        </p>
      </div>

      <template v-if="!isPending && !isError">
        <div
          v-if="hasPlatform"
          class="mt-8 flex flex-col items-center justify-center gap-2.5"
        >
          <RecentTracksCard
            v-for="track in recentTracks ?? []"
            :key="`${track.playedAt}-${track.trackName}`"
            :artists-names="track.artistsNames"
            :track-name="track.trackName"
            :played-at="track.playedAt"
          />
        </div>

        <div v-else class="mt-8 flex">
          <RouterLink
            to="/platforms"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-surface font-bold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            Get started
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </template>
    </section>

    <section class="mt-16">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-surface">
          Everything about your listening
        </h2>
        <p class="mt-2 text-sm text-surface/60">
          Your music history, organized and ready to explore.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <article
          class="rounded-xl border border-black/10 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            class="flex items-center justify-center w-11 h-11 rounded-lg bg-brand/20 text-surface text-xl"
            aria-hidden="true"
          >
            ♪
          </div>

          <h3 class="mt-5 text-lg font-semibold text-surface">
            Listening history
          </h3>

          <p class="mt-2 text-sm leading-relaxed text-surface/60">
            Import and manage your listening history from supported platforms.
          </p>
        </article>

        <article
          class="rounded-xl border border-black/10 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            class="flex items-center justify-center w-11 h-11 rounded-lg bg-brand/20 text-surface text-xl"
            aria-hidden="true"
          >
            ↗
          </div>

          <h3 class="mt-5 text-lg font-semibold text-surface">
            Music analytics
          </h3>

          <p class="mt-2 text-sm leading-relaxed text-surface/60">
            Discover your listening habits through statistics and different time
            periods.
          </p>
        </article>

        <article
          class="rounded-xl border border-black/10 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            class="flex items-center justify-center w-11 h-11 rounded-lg bg-brand/20 text-surface text-xl"
            aria-hidden="true"
          >
            ♫
          </div>

          <h3 class="mt-5 text-lg font-semibold text-surface">
            Multiple platforms
          </h3>

          <p class="mt-2 text-sm leading-relaxed text-surface/60">
            Bring your music data together and explore your listening across
            services.
          </p>
        </article>
      </div>
    </section>
  </main>
</template>
