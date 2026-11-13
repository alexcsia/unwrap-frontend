<script setup lang="ts">
import type { Exclusions } from "@/services/api";

defineProps<{
  exclusions: Exclusions;
  isPending: boolean;
  onDelete: (targetId: string, type: "artist" | "track") => void;
}>();
</script>

<template>
  <section
    class="w-full p-8 border border-[#303030] rounded-[18px] bg-[#191919] shadow-xl"
  >
    <h3 class="text-xl font-bold mb-6 text-[#f5f5f5]">
      Your Current Exclusions
    </h3>

    <div
      v-if="isPending"
      class="p-4 rounded-lg bg-[#303030]/50 text-neutral-300 animate-pulse"
    >
      <p>Loading your exclusions...</p>
    </div>

    <div
      v-else-if="exclusions.artists.length > 0 || exclusions.tracks.length > 0"
      class="flex flex-col gap-6"
    >
      <div v-if="exclusions.artists.length > 0">
        <h4
          class="text-[#a8e66b] font-semibold text-sm uppercase tracking-wider mb-3"
        >
          Artists
        </h4>
        <ul class="flex flex-col gap-2">
          <li
            v-for="artist in exclusions.artists"
            :key="artist.artistId"
            class="flex justify-between items-center p-3 rounded-lg border border-[#303030] bg-[#191919]"
          >
            <span class="font-medium text-[#f5f5f5]">{{
              artist.artistName
            }}</span>
            <button
              @click="onDelete(artist.artistId, artist.type)"
              class="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded transition-colors"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>

      <div v-if="exclusions.tracks.length > 0">
        <h4
          class="text-[#a8e66b] font-semibold text-sm uppercase tracking-wider mb-3"
        >
          Tracks
        </h4>
        <ul class="flex flex-col gap-2">
          <li
            v-for="track in exclusions.tracks"
            :key="track.trackId"
            class="flex justify-between items-center p-3 rounded-lg border border-[#303030] bg-[#191919]"
          >
            <div class="flex flex-col">
              <span class="font-medium text-[#f5f5f5]">{{
                track.trackName
              }}</span>
              <span class="text-xs text-neutral-400"
                >{{ track.artistName }} &bull; {{ track.albumName }}</span
              >
            </div>
            <button
              @click="onDelete(track.trackId, track.type)"
              class="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded transition-colors"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-else
      class="text-neutral-400 text-sm py-8 text-center border border-dashed border-[#303030] rounded-lg"
    >
      <p>No active exclusions found.</p>
    </div>
  </section>
</template>
