<script setup lang="ts">
import { ref, computed, watch } from "vue";
import StatCard from "@/components/statistics/StatCard.vue";
import RankedTable, {
  type RankedColumn,
} from "@/components/statistics/RankedTable.vue";
import { getTopArtists, getTopTracks, getTimeListened } from "@/services/api";
import type {
  TopArtist,
  TopTrack,
  TimeListenedResponse,
} from "@/services/types/statistics";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { MODES, MONTHS, years } from "@/composables/stats/useDate";
import "@vuepic/vue-datepicker/dist/main.css";
import { useDate } from "@/composables/stats/useDate";

const artists = ref<TopArtist[]>([]);
const artistsLoading = ref(false);
const artistsError = ref<string | null>(null);

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

async function loadArtists() {
  artistsLoading.value = true;
  artistsError.value = null;
  try {
    const res = await getTopArtists(buildParams());
    artists.value = res.topArtists;
  } catch (e) {
    console.error(e);
    artistsError.value = "Could not load top artists.";
  } finally {
    artistsLoading.value = false;
  }
}

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

const tracks = ref<TopTrack[]>([]);
const tracksLoading = ref(false);
const tracksError = ref<string | null>(null);

async function loadTracks() {
  tracksLoading.value = true;
  tracksError.value = null;
  try {
    const res = await getTopTracks(buildParams());
    tracks.value = res.topTracks;
  } catch (e) {
    console.error(e);
    tracksError.value = "Could not load top tracks.";
  } finally {
    tracksLoading.value = false;
  }
}

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

const time = ref<TimeListenedResponse | null>(null);
const timeLoading = ref(false);
const timeError = ref<string | null>(null);

async function loadTimeListened() {
  timeLoading.value = true;
  timeError.value = null;
  try {
    time.value = await getTimeListened(buildParams());
  } catch (e) {
    console.error(e);
    timeError.value = "Could not load listening time.";
  } finally {
    timeLoading.value = false;
  }
}

function loadAll() {
  loadArtists();
  loadTracks();
  loadTimeListened();
}

const filterKey = computed(() => JSON.stringify(buildParams()));
watch(filterKey, () => loadAll());
</script>

<template>
  <main class="flex flex-col gap-5 p-6 text-white">
    <header class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex gap-1 rounded-lg bg-neutral-200 p-1">
          <button
            v-for="m in MODES"
            :key="m.value"
            type="button"
            class="px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition"
            :class="
              mode === m.value
                ? 'bg-white text-[#191919] shadow-sm'
                : 'text-neutral-600 hover:text-[#191919]'
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
          class="px-3 py-2 rounded-lg border border-neutral-700 bg-[#191919] text-white"
        >
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </template>

      <template v-else-if="mode === 'month'">
        <select
          v-model.number="selectedMonth"
          class="px-3 py-2 rounded-lg border border-neutral-700 bg-[#191919] text-white"
        >
          <option v-for="(name, i) in MONTHS" :key="i" :value="i + 1">
            {{ name }}
          </option>
        </select>
        <select
          v-model.number="selectedYear"
          class="px-3 py-2 rounded-lg border border-neutral-700 bg-[#191919] text-white"
        >
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </template>

      <template v-else-if="mode === 'day'">
        <VueDatePicker
          v-model="selectedDay"
          :enable-time-picker="false"
          auto-apply
          placeholder="Pick a day"
        />
      </template>

      <template v-else-if="mode === 'range'">
        <VueDatePicker
          v-model="selectedRange"
          range
          :enable-time-picker="false"
          auto-apply
          placeholder="Select range"
        />
      </template>

      <h1 class="text-2xl font-bold m-0 text-[#191919]">Listening stats</h1>

      <button
        type="button"
        class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-[#191919] text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
        @click="loadAll"
      >
        Refresh all
      </button>
    </header>

    <section>
      <div class="flex items-center justify-between gap-3 mb-3">
        <h2 class="text-lg font-semibold m-0 text-[#191919]">Time listened</h2>
        <button
          type="button"
          class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-[#191919] text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
          :disabled="timeLoading"
          @click="loadTimeListened"
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
          :value="time ? formatDuration(time.statistics.totalMs) : '-'"
        />
        <StatCard
          label="Tracks played"
          :value="time ? time.statistics.totalTracks : '-'"
        />
        <StatCard
          label="Period"
          :value="
            time
              ? `${fmtDate(time.period.start)} – ${fmtDate(time.period.end)}`
              : '-'
          "
        />
      </div>
    </section>

    <RankedTable
      title="Top artists"
      :columns="artistColumns"
      :rows="artists"
      :loading="artistsLoading"
      :error="artistsError"
      empty-message="Load top artists to see results."
    >
      <template #actions>
        <button
          type="button"
          class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-[#191919] text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
          :disabled="artistsLoading"
          @click="loadArtists"
        >
          {{ artistsLoading ? "Loading…" : "Load" }}
        </button>
      </template>
    </RankedTable>

    <RankedTable
      title="Top tracks"
      :columns="trackColumns"
      :rows="tracks"
      :loading="tracksLoading"
      :error="tracksError"
      empty-message="Load top tracks to see results."
    >
      <template #actions>
        <button
          type="button"
          class="px-3.5 py-2 border border-neutral-700 rounded-lg bg-[#191919] text-white cursor-pointer hover:bg-[#303030] disabled:opacity-50 disabled:cursor-default"
          :disabled="tracksLoading"
          @click="loadTracks"
        >
          {{ tracksLoading ? "Loading…" : "Load" }}
        </button>
      </template>
    </RankedTable>
  </main>
</template>
