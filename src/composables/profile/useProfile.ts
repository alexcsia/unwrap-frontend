import { useQuery } from "@tanstack/vue-query";
import { getProfile } from "@/services/api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}
