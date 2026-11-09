<script setup lang="ts">
import { ref, toRaw } from "vue";
import {
  useExclusions,
  useExclusionsActions,
} from "@/composables/exclusions/useExclusions";
import { searchEntity, type SearchEntityResponse } from "@/services/api";
import { toast } from "vue-sonner";

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
  <main
    class="flex min-h-screen w-full flex-col items-center justify-center bg-amber-200"
  >
    <section
      class="w-full max-w-400 h-full max-h-500 p-9 border border-[#303030] rounded-[18px] bg-[#191919]"
    >
      <h3 class="text-white">Look for an artist or track to exclude</h3>
      <button
        v-for="entity in entityTypes"
        :key="entity.label"
        :value="entity.label"
        class="bg-amber-200 p-2 m-2"
        @click="setType(entity.label)"
      >
        {{ entity.label }}
      </button>

      <input v-model="entityName" class="bg-amber-500 p-2" />

      <button class="bg-white" @click="handleSearch">SEARCH</button>
      <ul v-if="entities?.length">
        <li v-for="e in entities" :key="e.id" class="text-white">
          {{ e.name }}
          <button @click="handleAddExclusion(e.id, typeToExclude!)">
            Exclude
          </button>
        </li>
      </ul>
    </section>

    <section
      class="w-full max-w-400 h-full max-h-500 p-9 border border-[#303030] rounded-[18px] bg-[#191919]"
    >
      <h3 class="text-white font-bold mb-4">Your current exclusions</h3>

      <div v-if="isPending" class="bg-amber-950 p-4 rounded text-white">
        <p>pending...</p>
      </div>

      <div
        v-else-if="
          exclusions.artists.length > 0 || exclusions.tracks.length > 0
        "
      >
        <div v-if="exclusions.artists.length > 0">
          <h4 class="text-amber-400 font-semibold mb-2">Artists</h4>
          <ul>
            <li
              v-for="artist in exclusions.artists"
              :key="artist.artistId"
              class="text-white flex justify-between items-center py-2 border-b border-neutral-800"
            >
              <span>{{ artist.artistName }}</span>
              <button
                @click="handleDeletion(artist.artistId, artist.type)"
                class="text-red-400 text-sm"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>

        <div v-if="exclusions.tracks.length > 0" class="mt-4">
          <h4 class="text-amber-400 font-semibold mb-2">Tracks</h4>
          <ul>
            <li
              v-for="track in exclusions.tracks"
              :key="track.trackId"
              class="text-white flex justify-between items-center py-2 border-b border-neutral-800"
            >
              <div>
                <p class="font-medium">{{ track.trackName }}</p>
                <p class="text-xs text-neutral-400">
                  {{ track.artistName }} - {{ track.albumName }}
                </p>
              </div>
              <button
                @click="handleDeletion(track.trackId, track.type)"
                class="text-red-400 text-sm"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="text-neutral-400 text-sm">
        <p>No exclusions found.</p>
      </div>
    </section>
  </main>
</template>
