<script setup lang="ts">
import { ref, toRaw } from "vue";
import {
  useExclusions,
  useExclusionsActions,
} from "@/composables/exclusions/useExclusions";
import { searchEntity, type SearchEntityResponse } from "@/services/api";
import { toast } from "vue-sonner";
import Navbar from "@/components/Navbar.vue";

const entities = ref<SearchEntityResponse | null>(null);
const typeToExclude = ref<"track" | "artist" | null>(null);

const { exclusions, isPending } = useExclusions();
const { add, remove } = useExclusionsActions();

const entityTypes: { label: "track" | "artist" }[] = [
  { label: "track" },
  { label: "artist" },
];

const entityName = ref<string | null>(null);

const setType = (type: "track" | "artist") => {
  typeToExclude.value = type;
  console.log("type set:", typeToExclude.value);
};

const handleSearch = async () => {
  if (!typeToExclude.value) {
    toast.error(
      "Please select whether you are looking for a track or an artist.",
    );
    return;
  }

  if (!entityName.value || !entityName.value.trim()) {
    toast.error("Please enter a search name.");
    return;
  }

  try {
    entities.value = await searchEntity({
      type: typeToExclude.value,
      name: entityName.value,
      limit: 10,
      cursor: null,
    });

    console.log(toRaw(entities.value));
    for (const entity of entities.value) console.log(toRaw(entity));
  } catch (err: any) {
    toast.error("Search failed, please try again.");
  }
};

const handleDeletion = async (targetId: string, type: "artist" | "track") => {
  await remove.mutateAsync({ targetId, type });
};

const handleAddExclusion = async (
  targetId: string,
  type: "track" | "artist",
) => {
  await add.mutateAsync({ targetId, type });
};
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f5] text-[#f5f5f5] flex flex-col">
    <Navbar />

    <main
      class="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-8"
    >
      <section
        class="w-full p-8 border border-[#303030] rounded-[18px] bg-[#191919] shadow-xl flex flex-col gap-6"
      >
        <div>
          <h2 class="text-xl font-bold tracking-tight mb-2 text-[#f5f5f5]">
            Manage Exclusions
          </h2>
          <p class="text-sm text-neutral-400">
            Search for artists or tracks you'd like to exclude from your data.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-neutral-300">Target Type:</span>
          <div class="flex gap-2">
            <button
              v-for="entity in entityTypes"
              :key="entity.label"
              type="button"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition-all border"
              :class="
                typeToExclude === entity.label
                  ? 'bg-[#a8e66b] text-[#191919] border-[#a8e66b]'
                  : 'bg-transparent text-neutral-300 border-[#303030] hover:border-neutral-500'
              "
              @click="setType(entity.label)"
            >
              {{ entity.label.toUpperCase() }}
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="entityName"
            type="text"
            placeholder="Enter artist or track name..."
            class="flex-1 bg-[#191919] border border-[#303030] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder:text-neutral-500 focus:outline-none focus:border-[#a8e66b]"
            @keyup.enter="handleSearch"
          />
          <button
            class="bg-[#a8e66b] text-[#191919] font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            @click="handleSearch"
          >
            Search
          </button>
        </div>

        <div
          v-if="entities && entities.length > 0"
          class="mt-2 border-t border-[#303030] pt-4"
        >
          <h4 class="text-sm font-semibold text-neutral-400 mb-3">
            Search Results
          </h4>
          <ul class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
            <li
              v-for="e in entities"
              :key="e.id"
              class="flex justify-between items-center p-3 rounded-lg border border-[#303030] bg-[#191919] hover:border-neutral-700 transition-colors"
            >
              <span class="font-medium text-[#f5f5f5]">{{ e.name }}</span>
              <button
                class="bg-transparent text-[#a8e66b] border border-[#a8e66b] px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#a8e66b] hover:text-[#191919] transition-all"
                @click="handleAddExclusion(e.id, typeToExclude!)"
              >
                Exclude
              </button>
            </li>
          </ul>
        </div>
      </section>

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
          v-else-if="
            exclusions.artists.length > 0 || exclusions.tracks.length > 0
          "
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
                  @click="handleDeletion(artist.artistId, artist.type)"
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
                  <span class="text-xs text-neutral-400">
                    {{ track.artistName }} &bull; {{ track.albumName }}
                  </span>
                </div>
                <button
                  @click="handleDeletion(track.trackId, track.type)"
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
    </main>
  </div>
</template>
