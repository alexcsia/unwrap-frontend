import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getRecentTracks } from "@/services/statistics";

const KEY = ["recentTracks"];

export function useRecentTracks() {
  const query = useQuery({
    queryKey: KEY,
    queryFn: getRecentTracks,
    staleTime: 60_000 * 30,
  });

  const recentTracks = computed(() => query.data.value ?? []) as any;

  return { ...query, recentTracks };
}
