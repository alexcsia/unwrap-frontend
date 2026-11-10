<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import ExclusionSearchSection from "@/components/exclusions/ExclusionSearchSection.vue";
import ExclusionListSection from "@/components/exclusions/ExclusionListSection.vue";
import {
  useExclusions,
  useExclusionsActions,
} from "@/composables/exclusions/useExclusions";

const { exclusions, isPending } = useExclusions();
const { add, remove } = useExclusionsActions();

const handleAddExclusion = async (
  targetId: string,
  type: "track" | "artist",
) => {
  await add.mutateAsync({ targetId, type });
};

const handleDeletion = async (targetId: string, type: "artist" | "track") => {
  await remove.mutateAsync({ targetId, type });
};
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f5] text-[#f5f5f5] flex flex-col">
    <Navbar />

    <main
      class="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-8"
    >
      <ExclusionSearchSection :on-add="handleAddExclusion" />
      <ExclusionListSection
        :exclusions="exclusions"
        :is-pending="isPending"
        :on-delete="handleDeletion"
      />
    </main>
  </div>
</template>
