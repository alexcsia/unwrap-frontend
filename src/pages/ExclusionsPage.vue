<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import ExclusionSearchSection from "@/components/exclusions/ExclusionSearchSection.vue";
import ExclusionListSection from "@/components/exclusions/ExclusionListSection.vue";
import {
  useExclusions,
  useExclusionsActions,
} from "@/composables/exclusions/useExclusions";
import { ApiError } from "@/services/api";
import { toast } from "vue-sonner";

const { exclusions, isPending } = useExclusions();
const { add, remove } = useExclusionsActions();

const handleAddExclusion = async (
  targetId: string,
  type: "track" | "artist",
) => {
  try {
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
  } catch (err) {
    console.error(err);
    if (err instanceof ApiError) {
      toast.error(err.message);
    } else {
      toast.error("Could not add exclusion.");
    }
  }
};

const handleDeletion = async (targetId: string, type: "artist" | "track") => {
  try {
    await remove.mutateAsync({ targetId, type });
  } catch (err) {
    console.error(err);
    if (err instanceof ApiError) {
      toast.error(err.message);
    } else {
      toast.error("Could not remove exclusion.");
    }
  }
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
