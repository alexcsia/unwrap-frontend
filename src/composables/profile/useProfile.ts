import { useQuery, useQueryClient, useMutation } from "@tanstack/vue-query";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "@/services/profile";
import { useAuthStore } from "@/stores/auth";

export function useProfile() {
  const queryClient = useQueryClient();

  const authStore = useAuthStore();
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      authStore.clearUser();
    },
  });

  return {
    ...profileQuery,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeleting: deleteAccountMutation.isPending,
  };
}
