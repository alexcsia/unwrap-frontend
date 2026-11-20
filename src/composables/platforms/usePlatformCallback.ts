import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ApiError } from "@/services/api";
import { useQueryClient } from "@tanstack/vue-query";
import type { PlatformName } from "@/services/types";
import { toast } from "vue-sonner";

const VALID_PLATFORMS: PlatformName[] = ["spotify", "lastfm"];

export function usePlatformCallback() {
  const route = useRoute();
  const router = useRouter();
  const qc = useQueryClient();

  onMounted(async () => {
    const connected = route.query.connected;
    const error = route.query.error;

    try {
      if (
        typeof connected === "string" &&
        VALID_PLATFORMS.includes(connected as PlatformName)
      ) {
        toast.success(`${connected} connected successfully!`);
        await qc.invalidateQueries({ queryKey: ["platforms"] });
      } else if (error) {
        toast.error(
          typeof error === "string"
            ? error
            : "Could not connect. Please try again.",
        );
      }

      if (connected || error) {
        await router.replace({ query: {} });
      }
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Could not connect. Please try again.");
      }
    }
  });
}
