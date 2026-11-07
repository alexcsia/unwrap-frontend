import { computed } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  getPlatforms,
  connectPlatform,
  disconnectPlatform,
  type PlatformName,
} from "@/services/api";

const KEY = ["platforms"];

export function usePlatforms() {
  const query = useQuery({
    queryKey: KEY,
    queryFn: getPlatforms,
    staleTime: 60_000,
  });

  const platforms = computed(() => query.data.value ?? []) as any;
  console.log("computed paltforms", platforms);
  const hasPlatform = computed(() => platforms.value.length > 0);
  const get = (name: PlatformName) =>
    platforms.value.find((p: any) => p.platformName === name);

  return { ...query, platforms, hasPlatform, get };
}

export function usePlatformActions() {
  const qc = useQueryClient();

  const connect = useMutation({
    mutationFn: connectPlatform,
    onSuccess: (url) => {
      console.log("received url", url);
      window.location.href = url;
    },
  });

  const disconnect = useMutation({
    mutationFn: disconnectPlatform,
    onSuccess: () => {
      console.log("success");
      qc.invalidateQueries({ queryKey: KEY });
    },
  });

  return { connect, disconnect };
}
