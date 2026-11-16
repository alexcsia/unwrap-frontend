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
  if (type === "track") {
    const ids = exclusions.value.tracks.map((t) => t.trackId);
    if (ids.includes(targetId)) {
      return;
    } else {
      await add.mutateAsync({ targetId, type });
      console.log("excluding");
    }
  }
  if (type === "artist") {
    const ids = exclusions.value.artists.map((t) => t.artistId);
    if (ids.includes(targetId)) {
      return;
    } else await add.mutateAsync({ targetId, type });
    console.log("excluding");
  }
};

const handleDeletion = async (targetId: string, type: "artist" | "track") => {
  await remove.mutateAsync({ targetId, type });
};
</script>

<template>
  <div class="min-h-screen bg-background text-background flex flex-col">
    <Navbar />

    <main
      class="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-8"
    >
      <ExclusionSearchSection
        :on-add="handleAddExclusion"
        :exclusions="exclusions"
      />
      <ExclusionListSection
        :exclusions="exclusions"
        :is-pending="isPending"
        :on-delete="handleDeletion"
      />
    </main>
  </div>
</template>
