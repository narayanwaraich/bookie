import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

interface VerifyEmailTokenStatusProps {
  token: string;
}

export default function VerifyEmailTokenStatus({
  token,
}: VerifyEmailTokenStatusProps) {
  const navigate = useNavigate();
  const verifyMutation = useMutation(
    trpc.auth.verifyEmail.queryOptions({ token }), // Assuming verifyEmail is a query, adjust if it's a mutation
  );

  useEffect(() => {
    if (token) {
      // verifyMutation.mutate({ token }); // If verifyEmail was a mutation
      // For a query, it will trigger automatically based on queryOptions if `enabled` is true
    }
  }, [token, verifyMutation]);

  if (verifyMutation.isPending) {
    // or .isLoading if it's a query
    return (
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Verifying with token: {token}</p>
      </div>
    );
  }

  if (verifyMutation.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Verification Failed</AlertTitle>
        <AlertDescription>
          {verifyMutation.error.message ||
            "Could not verify email with this token. It may be invalid or expired."}
        </AlertDescription>
        <Button
          onClick={() => navigate({ to: "/login" })}
          className="mt-4 w-full"
        >
          Go to Login
        </Button>
      </Alert>
    );
  }

  if (verifyMutation.isSuccess) {
    return (
      <Alert variant="default">
        <AlertTitle>Email Verified!</AlertTitle>
        <AlertDescription>
          {verifyMutation.data?.message ||
            "Your email has been successfully verified."}
        </AlertDescription>
        <Button
          onClick={() => navigate({ to: "/login" })}
          className="mt-4 w-full"
        >
          Proceed to Login
        </Button>
      </Alert>
    );
  }

  return <p>Initializing verification...</p>; // Initial state before mutation/query runs
}
