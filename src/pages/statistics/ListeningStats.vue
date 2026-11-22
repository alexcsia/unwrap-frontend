<script setup lang="ts">
import { computed } from "vue";
import StatCard from "@/components/statistics/StatCard.vue";
import RankedTable, {
  type RankedColumn,
} from "@/components/statistics/RankedTable.vue";
import type { TopArtist, TopTrack } from "@/services/types/statistics";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { MODES, MONTHS, years } from "@/composables/stats/useDate";
import "@vuepic/vue-datepicker/dist/main.css";
import { useDate } from "@/composables/stats/useDate";
import Navbar from "@/components/navbar/Navbar.vue";
import {
  useArtistsStats,
  useTimeListenedStats,
  useTracksStats,
} from "@/composables/stats/useStats";

const {
  selectedDay,
  selectedMonth,
  selectedRange,
  selectedYear,
  mode,
  formatDuration,
  fmtDate,
  buildParams,
} = useDate();

const params = computed(() => buildParams());

const {
  topArtists,
  isLoading: artistsLoading,
  error: artistsError,
  refetch: loadArtists,
} = useArtistsStats(params);

const {
  topTracks,
  isLoading: tracksLoading,
  error: tracksError,
  refetch: loadTracks,
} = useTracksStats(params);

const {
  timeListened,
  isLoading: timeLoading,
  error: timeError,
  refetch: loadTimeListened,
} = useTimeListenedStats(params);

const artistColumns: RankedColumn[] = [
  { key: "rank", label: "#" },
  { key: "artistName", label: "Artist" },
  { key: "playCount", label: "Plays" },
  {
    key: "durationMs",
    label: "Time",
    format: (r: TopArtist) => formatDuration(r.durationMs),
  },
];

const trackColumns: RankedColumn[] = [
  { key: "rank", label: "#" },
  { key: "trackName", label: "Track" },
  { key: "artistNames", label: "Artist" },
  { key: "albumName", label: "Album" },
  { key: "plays", label: "Plays" },
  {
    key: "durationMs",
    label: "Duration",
    format: (r: TopTrack) => formatDuration(r.durationMs),
  },
];

function loadAll() {
  loadArtists();
  loadTracks();
  loadTimeListened();
}
</script>

<template>
  <Navbar />
  <main class="flex flex-col gap-5 p-6 text-white">
    <header class="flex items-center mt-5 justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex gap-1 rounded-lg bg-neutral-200 p-1">
          <button
            v-for="m in MODES"
            :key="m.value"
            type="button"
            class="px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition"
            :class="
              mode === m.value
                ? 'bg-white text-surface shadow-sm'
                : 'text-neutral-600 hover:text-surface'
            "
            @click="mode = m.value"
          >
            {{ m.label }}
          </button>
        </div>
      </div>

      <template v-if="mode === 'year'">
        <select
          v-model.number="selectedYear"
          class="px-3 py-2 rounded-lg border border-neutral-700 bg-surface text-white"
        >
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </template>

      <template v-else-if="mode === 'month'">
        <select
          v-model.number="selectedMonth"
          class="px-3 py-2 rounded-lg border border-neutral-700 bg-surface text-white"
        >
          <option v-for="(name, i) in MONTHS" :key="i" :value="i + 1">
            {{ name }}
          </option>
        </select>
        <select
          v-model.number="selectedYear"
          class="px-3 py-2 rounded-lg border border-neutral-700 bg-surface text-white"
        >
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </template>

      <template v-else-if="mode === 'day'">
        <VueDatePicker
          v-model="selectedDay"
          :time-config="{ enableTimePicker: false }"
          auto-apply
          placeholder="Pick a day"
        />
      </template>

      <template v-else-if="mode === 'range'">
        <VueDatePicker
          v-model="selectedRange"
          range
          :time-config="{ enableTimePicker: false }"
          auto-apply
          placeholder="Select range"
        />
      </template>

      <h1 class="text-2xl font-bold m-0 text-surface">Listening stats</h1>

      <button
        type="button"
        class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-surface text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
        @click="loadAll"
      >
        Refresh all
      </button>
    </header>

    <section>
      <div class="flex items-center justify-between gap-3 mb-3">
        <h2 class="text-lg font-semibold m-0 text-surface">Time listened</h2>
        <button
          type="button"
          class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-surface text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
          :disabled="timeLoading"
          @click="() => loadTimeListened"
        >
          {{ timeLoading ? "Loading…" : "Load" }}
        </button>
      </div>

      <p v-if="timeError" class="text-red-300 mb-2" role="alert">
        {{ timeError }}
      </p>

      <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <StatCard
          label="Total listening time"
          :value="
            timeListened ? formatDuration(timeListened.statistics.totalMs) : '-'
          "
        />
        <StatCard
          label="Tracks played"
          :value="timeListened ? timeListened.statistics.totalTracks : '-'"
        />
        <StatCard
          label="Period"
          :value="
            timeListened
              ? `${fmtDate(timeListened.period.start)} – ${fmtDate(timeListened.period.end)}`
              : '-'
          "
        />
      </div>
    </section>

    <RankedTable
      title="Top artists"
      :columns="artistColumns"
      :rows="topArtists"
      :loading="artistsLoading"
      :error="artistsError?.message ?? null"
      empty-message="Load top artists to see results."
    >
      <template #actions>
        <button
          type="button"
          class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-surface text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
          :disabled="artistsLoading"
          @click="() => loadArtists"
        >
          {{ artistsLoading ? "Loading…" : "Load" }}
        </button>
      </template>
    </RankedTable>

    <RankedTable
      title="Top tracks"
      :columns="trackColumns"
      :rows="topTracks"
      :loading="tracksLoading"
      :error="tracksError?.message ?? null"
      empty-message="Load top tracks to see results."
    >
      <template #actions>
        <button
          type="button"
          class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-surface text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
          :disabled="tracksLoading"
          @click="() => loadTracks"
        >
          {{ tracksLoading ? "Loading…" : "Load" }}
        </button>
      </template>
    </RankedTable>
  </main>
</template>
