import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { uploadSpotifyHistory } from "@/services/upload";

const KEY = ["uploadHistory"];

export function useUploadHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadSpotifyHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentTracks"] });
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}
