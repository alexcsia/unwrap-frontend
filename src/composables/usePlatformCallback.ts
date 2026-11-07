import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { PlatformName } from "@/services/api";
import { useQueryClient } from "@tanstack/vue-query";

const VALID_PLATFORMS: PlatformName[] = ["spotify", "lastfm"];

export function usePlatformCallback() {
  const route = useRoute();
  const router = useRouter();
  const qc = useQueryClient();

  const notice = ref<string | null>(null);

  onMounted(async () => {
    const connected = route.query.connected;
    const error = route.query.error;

    if (
      typeof connected === "string" &&
      VALID_PLATFORMS.includes(connected as PlatformName)
    ) {
      notice.value = `${connected} connected successfully!`;
      await qc.invalidateQueries({ queryKey: ["platforms"] });
    } else if (error) {
      notice.value = "Could not connect. Please try again.";
    }

    if (connected || error) {
      await router.replace({ query: {} });
    }
  });

  return { notice };
}
