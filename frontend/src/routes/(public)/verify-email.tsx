// src/routes/(public)/verify-email.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AuthPageLayout } from "@/components/features/auth/ui/AuthPageLayout";
import VerifyEmailStatusComponent from "@/components/features/auth/ui/VerifyEmailStatus"; // Renamed import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const verifyEmailSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/(public)/verify-email")({
  validateSearch: (search) => verifyEmailSearchSchema.parse(search),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <AuthPageLayout
      title="Email Verification"
      description={
        token
          ? "Attempting to verify your email address."
          : "Email verification process."
      }
    >
      {token ? (
        <VerifyEmailStatusComponent token={token} />
      ) : (
        <Alert variant="destructive">
          <AlertTitle>No Verification Token</AlertTitle>
          <AlertDescription>
            No verification token was found. Please ensure you clicked the
            correct link from your email. If you need a new link, please try
            registering again or contact support.
          </AlertDescription>
          <Button
            onClick={() => navigate({ to: "/login" })}
            className="mt-4 w-full"
          >
            Go to Login
          </Button>
        </Alert>
      )}
    </AuthPageLayout>
  );
}
