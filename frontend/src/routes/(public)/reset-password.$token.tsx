import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordComponent } from "@/components/features/auth/forms/ResetPasswordForm";
import { AuthPageLayout } from "@/components/features/auth/ui/AuthPageLayout";

export const Route = createFileRoute("/(public)/reset-password/$token")({
  component: () => (
    <AuthPageLayout title="Reset Password">
      <ResetPasswordComponent />
    </AuthPageLayout>
  ), // loader: ({ params }) => { /* Validate params.token */ },
});
