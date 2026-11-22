import {
  createExclusion,
  fetchExclusions,
  deleteExclusion,
} from "@/services/exclusions";
import type { Exclusions } from "@/services/types";
import { ApiError } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { toast } from "vue-sonner";

const KEY = ["exclusions"];
export function useExclusions() {
  const query = useQuery({
    queryKey: KEY,
    queryFn: fetchExclusions,
    staleTime: 1000 * 60 * 5,
  });

  const exclusions = computed(() => {
    const raw = query.data.value as Exclusions;

    return {
      artists: raw?.artists ?? [],
      tracks: raw?.tracks ?? [],
    };
  });

  return { ...query, exclusions };
}
export function useExclusionsActions() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: createExclusion,
    onSuccess: async () => {
      toast.success("Exclusion created!");

      await qc.refetchQueries({ queryKey: KEY });
    },
    onError: (err) => {
      console.error(err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Could not create exclusion");
      }
    },
  });

  const remove = useMutation({
    mutationFn: deleteExclusion,
    onSuccess: async () => {
      toast.success("Exclusion deleted!");
      await qc.refetchQueries({ queryKey: KEY });
    },
    onError: (err) => {
      console.error(err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Could not delete exclusion");
      }
    },
  });

  return { add, remove };
}
