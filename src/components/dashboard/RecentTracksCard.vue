<script setup lang="ts">
defineProps<{
  artistsNames: string[];
  trackName: string;
  playedAt: Date | string;
}>();
</script>

<template>
  <div
    class="w-full max-w-md px-4 py-3 border border-[#303030] rounded-lg bg-surface text-white text-left"
  >
    <div class="text-xs text-neutral-400 truncate">
      {{ artistsNames.join(", ") }}
    </div>
    <div class="text-base font-semibold leading-snug truncate">
      {{ trackName }}
    </div>
    <div class="text-xs text-neutral-400 mt-0.5">
      Played at: {{ new Date(playedAt).toLocaleString() }}
    </div>
  </div>
</template>
