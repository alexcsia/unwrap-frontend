<script setup lang="ts">
import { ref } from "vue";
import { searchEntity, type SearchEntityResponse } from "@/services/api";
import { toast } from "vue-sonner";

const props = defineProps<{
  onAdd: (targetId: string, type: "track" | "artist") => Promise<void>;
}>();

const entities = ref<SearchEntityResponse | null>(null);
const typeToExclude = ref<"track" | "artist" | null>(null);
const entityName = ref<string | null>(null);

const entityTypes: { label: "track" | "artist" }[] = [
  { label: "track" },
  { label: "artist" },
];

const setType = (type: "track" | "artist") => {
  typeToExclude.value = type;
};

const handleSearch = async () => {
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

  try {
    entities.value = await searchEntity({
      type: typeToExclude.value,
      name: entityName.value,
      limit: 10,
      cursor: null,
    });
  } catch (err) {
    toast.error("Search failed, please try again.");
  }
};
</script>

<template>
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
          class="flex justify-between items-center p-3 rounded-lg border border-[#303030] bg-[#191919]"
        >
          <span class="font-medium text-[#f5f5f5]">{{ e.name }}</span>
          <button
            class="bg-transparent text-[#a8e66b] border border-[#a8e66b] px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#a8e66b] hover:text-[#191919] transition-all"
            @click="props.onAdd(e.id, typeToExclude!)"
          >
            Exclude
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>
