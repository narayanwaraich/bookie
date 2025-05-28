// src/routes/(public)/reset-password.$token.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import ResetPasswordForm from "@/components/features/auth/forms/ResetPasswordForm";
import { AuthPageLayout } from "@/components/features/auth/ui/AuthPageLayout";

export const Route = createFileRoute("/(public)/reset-password/$token")({
  component: ResetPasswordPage,
  // loader: ({ params }) => { /* Validate params.token - or handle in component/service */ },
});

function ResetPasswordPage() {
  const { token } = Route.useParams();

  return (
    <AuthPageLayout
      title="Reset Your Password"
      description="Enter and confirm your new password below."
      footerContent={
        <Link to="/login" className="underline">
          Back to Login
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground mb-4">
        Resetting password with token:{" "}
        <span className="font-mono break-all">{token}</span>
      </p>
      <ResetPasswordForm token={token} />
    </AuthPageLayout>
  );
}
