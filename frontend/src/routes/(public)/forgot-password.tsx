import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordComponent } from "@/components/features/auth/ForgotPasswordForm";

export const Route = createFileRoute("/(public)/forgot-password")({
  component: ForgotPasswordComponent,
});
