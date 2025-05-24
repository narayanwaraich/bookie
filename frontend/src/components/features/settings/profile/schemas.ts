import { z } from "zod";

// Schema for the update profile form
export const profileFormSchema = z.object({
  name: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .optional(),
  profileImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Schema for the change password form
export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

// Schema for the delete account confirmation form
export const deleteAccountFormSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required to confirm deletion" }),
});
export type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>;

// User profile type based on API response
export interface UserProfile {
  id?: string;
  name?: string | null;
  username?: string;
  email: string;
  profileImage?: string | null;
  createdAt?: string;
}
