import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordComponent } from "@/components/features/auth/ResetPasswordForm";

export const Route = createFileRoute("/(public)/reset-password/$token")({
  component: ResetPasswordComponent,
  // loader: ({ params }) => { /* Validate params.token */ },
});
