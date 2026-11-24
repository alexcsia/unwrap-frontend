<script setup lang="ts">
import { ref, watch } from "vue";
import { useEntitySearch } from "@/composables/exclusions/useSearch";
import { ApiError } from "@/services/api";
import { toast } from "vue-sonner";
import type { Exclusions } from "@/services/types";

const props = defineProps<{
  onAdd: (targetId: string, type: "track" | "artist") => Promise<void>;
  exclusions: Exclusions;
}>();

const typeToExclude = ref<"track" | "artist" | null>(null);
const entityName = ref<string | null>(null);

const {
  entities,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  submit,
  reset,
  loadMore,
} = useEntitySearch();

const entityTypes: { label: "track" | "artist" }[] = [
  { label: "track" },
  { label: "artist" },
];

watch(error, (err) => {
  if (err) {
    toast.error(
      err instanceof ApiError
        ? err.message
        : "Search failed, please try again.",
    );
  }
});

const handleAdd = (id: string, type: "track" | "artist") => {
  props.onAdd(id, type);
};

const setType = (type: "track" | "artist") => {
  if (typeToExclude.value === type) return;
  typeToExclude.value = type;
  reset();
};

const handleSearch = () => {
  if (!typeToExclude.value) {
    toast.error(
      "Please select whether you are looking for a track or an artist.",
    );
    return;
  }
  if (!entityName.value?.trim()) {
    toast.error("Please enter a search name.");
    return;
  }

  submit({
    type: typeToExclude.value,
    name: entityName.value.trim(),
  });
};

const handleLoadMore = () => {
  if (hasMore.value && !isLoadingMore.value) loadMore();
};
</script>

<template>
  <section
    class="w-full p-8 border border-[#303030] rounded-[18px] bg-surface shadow-xl flex flex-col gap-6"
  >
    <div>
      <h2 class="text-xl font-bold tracking-tight mb-2 text-background">
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
              ? 'bg-[#a8e66b] text-surface border-[#a8e66b]'
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
        class="flex-1 bg-surface border border-[#303030] rounded-lg px-4 py-3 text-background placeholder:text-neutral-500 focus:outline-none focus:border-[#a8e66b]"
        @keyup.enter="handleSearch"
      />
      <button :disabled="isLoading" class="..." @click="handleSearch">
        {{ isLoading ? "Searching…" : "Search" }}
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
          class="flex justify-between items-center p-3 rounded-lg border border-[#303030] bg-surface"
        >
          <span class="font-medium text-background">{{ e.name }}</span>
          <button
            class="bg-transparent cursor-pointer text-[#a8e66b] border border-[#a8e66b] px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#a8e66b] hover:text-surface transition-all"
            :disabled="
              typeToExclude === 'track'
                ? exclusions?.tracks?.some((t) => t.trackId === e.id)
                : exclusions?.artists?.some((a) => a.artistId === e.id)
            "
            @click="handleAdd(e.id, typeToExclude!)"
          >
            {{
              typeToExclude === "track"
                ? exclusions?.tracks?.some((t) => t.trackId === e.id)
                  ? "Already excluded"
                  : "Exclude"
                : exclusions?.artists?.some((a) => a.artistId === e.id)
                  ? "Already excluded"
                  : "Exclude"
            }}
          </button>
        </li>
      </ul>

      <button
        v-if="hasMore"
        type="button"
        :disabled="isLoadingMore"
        class="mt-3 w-full px-4 py-2.5 border border-[#303030] rounded-lg bg-surface text-[#a8e66b] text-sm font-semibold hover:border-[#a8e66b] transition-colors disabled:opacity-50 disabled:cursor-wait"
        @click="handleLoadMore"
      >
        {{ isLoadingMore ? "Loading…" : "Load more" }}
      </button>
    </div>

    <p
      v-else-if="entities && entities.length === 0"
      class="text-sm text-neutral-500 text-center py-4"
    >
      No results found.
    </p>
  </section>
</template>
