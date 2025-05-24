import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { toast } from "sonner";
import type {
  ProfileFormValues,
  ChangePasswordFormValues,
  DeleteAccountFormValues,
  UserProfile,
} from "./schemas";

export function useProfileMutations() {
  const queryClient = useQueryClient();

  // Update profile mutation
  const updateProfileMutation = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: async () => {
        toast.success("Profile Updated", {
          description: "Your profile has been successfully updated.",
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.user.getProfile.queryKey(),
        });
        return true;
      },
      onError: (err: any) => {
        let description = "An unexpected error occurred. Please try again.";
        if (err.data?.httpStatus === 429 || err.code === "TOO_MANY_REQUESTS") {
          description = "Too many attempts. Please try again in a few minutes.";
        } else if (err.message) {
          description = err.message;
        }
        toast.error("Update Failed", { description });
        return false;
      },
    }),
  );

  // Change password mutation
  const changePasswordMutation = useMutation(
    trpc.user.changePassword.mutationOptions({
      onSuccess: () => {
        toast.success("Password Changed", {
          description: "Your password has been successfully updated.",
        });
      },
      onError: (err: any) => {
        let description = "An unexpected error occurred. Please try again.";
        if (err.data?.httpStatus === 429 || err.code === "TOO_MANY_REQUESTS") {
          description = "Too many attempts. Please try again in a few minutes.";
        } else if (err.message) {
          description = err.message;
        }
        toast.error("Change Password Failed", { description });
      },
    }),
  );

  // Delete account mutation
  const deleteAccountMutation = useMutation(
    trpc.user.deleteAccount.mutationOptions({
      onError: (err: any) => {
        let description = "An unexpected error occurred. Please try again.";
        if (err.data?.httpStatus === 429 || err.code === "TOO_MANY_REQUESTS") {
          description = "Too many attempts. Please try again in a few minutes.";
        } else if (err.message) {
          description = err.message;
        }
        toast.error("Account Deletion Failed", { description });
        return description;
      },
    }),
  );

  return {
    updateProfile: (data: Partial<ProfileFormValues>) =>
      updateProfileMutation.mutate(data),
    changePassword: (
      data: Omit<ChangePasswordFormValues, "confirmNewPassword">,
    ) => changePasswordMutation.mutate(data),
    deleteAccount: (data: DeleteAccountFormValues) =>
      deleteAccountMutation.mutate({ password: data.password }),
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
}

export function useProfileData() {
  const {
    data: userProfile,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery(trpc.user.getProfile.queryOptions());

  return {
    userProfile: userProfile as UserProfile | undefined,
    isLoading,
    error,
    isError,
    refetch,
  };
}
