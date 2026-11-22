import { computed, type MaybeRefOrGetter, toValue } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getTimeListened,
  getTopArtists,
  getTopTracks,
} from "@/services/statistics";
import type { StatsParams } from "@/services/types/statistics";

export function useArtistsStats(params: MaybeRefOrGetter<StatsParams>) {
  const query = useQuery({
    queryKey: computed(() => ["artists", toValue(params)]),
    queryFn: () => getTopArtists(toValue(params)),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const topArtists = computed(() => query.data.value?.topArtists ?? []);

  return { ...query, topArtists };
}

export function useTracksStats(params: MaybeRefOrGetter<StatsParams>) {
  const query = useQuery({
    queryKey: computed(() => ["tracks", toValue(params)]),
    queryFn: () => getTopTracks(toValue(params)),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const topTracks = computed(() => query.data.value?.topTracks ?? []);

  return { ...query, topTracks };
}

export function useTimeListenedStats(params: MaybeRefOrGetter<StatsParams>) {
  const query = useQuery({
    queryKey: computed(() => ["timeListened", toValue(params)]),
    queryFn: () => getTimeListened(toValue(params)),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const timeListened = computed(() => query.data.value);

  return { ...query, timeListened };
}
