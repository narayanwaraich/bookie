// src/routes/(public)/forgot-password.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ForgotPasswordFormComponent from "@/components/features/auth/forms/ForgotPasswordForm";
import { AuthPageLayout } from "@/components/features/auth/ui/AuthPageLayout";
import { trpc } from "@/lib/api";
import { useState } from "react";

export const Route = createFileRoute("/(public)/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const requestResetMutation = useMutation(
    trpc.auth.requestPasswordReset.mutationOptions(), // Error/Success handled in component
  );

  const handleFormSuccess = (email: string) => {
    setSubmittedEmail(email);
  };

  if (submittedEmail) {
    return (
      // This "Check Your Email" part can remain in the route component, or be its own component
      // For simplicity, keeping it here.
      <AuthPageLayout
        title="Check Your Email"
        description='A password reset link has been sent to ${submittedEmail} if an account with that email exists. Please check your inbox (and spam folder).';
      >
        <Button onClick={() => navigate({ to: "/login" })} className="w-full">
          Back to Login
        </Button>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      title="Forgot Password"
      description="Enter your email address below and we'll send you a link to reset your password."
      footerContent={
        <>
          Remember your password?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordFormComponent
        onSubmitSuccess={handleFormSuccess}
        requestResetMutation={requestResetMutation}
      />
    </AuthPageLayout>
  );
}
