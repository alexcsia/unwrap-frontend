import {
  createExclusion,
  fetchExclusions,
  deleteExclusion,
  type Exclusions,
} from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { toast } from "vue-sonner";

const KEY = ["exclusions"];
export function useExclusions() {
  const query = useQuery({
    queryKey: KEY,
    queryFn: fetchExclusions,
    staleTime: 60_000,
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
    onError: () => {
      toast.error("Could not create exclusion");
    },
  });

  const remove = useMutation({
    mutationFn: deleteExclusion,
    onSuccess: async () => {
      toast.success("Exclusion deleted!");
      await qc.refetchQueries({ queryKey: KEY });
    },
    onError: () => toast.error("Could not delete exclusion"),
  });

  return { add, remove };
}
