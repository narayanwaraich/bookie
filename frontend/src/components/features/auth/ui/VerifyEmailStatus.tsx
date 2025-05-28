import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface VerifyEmailStatusProps {
  token?: string;
}

export default function VerifyEmailStatus({ token }: VerifyEmailStatusProps) {
  const navigate = useNavigate();

  const { data, isLoading, error, isSuccess, isError } = useQuery(
    trpc.auth.verifyEmail.queryOptions(
      // This needs to be a tRPC query
      { token: token || "" },
      {
        enabled: !!token,
        retry: false,
      },
    ),
  );

  useEffect(() => {
    // If there's no token passed via props (e.g. direct navigation to /verify-email without query param)
    // this component won't do much, but the route itself handles the !token case.
  }, [token, navigate]);

  if (isLoading && token) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    );
  } else if (isSuccess && data) {
    return (
      <Alert variant="default">
        <AlertTitle>Email Verified!</AlertTitle>
        <AlertDescription>
          {data.message || "Your email has been successfully verified."}
        </AlertDescription>
        <Button
          onClick={() => navigate({ to: "/login" })}
          className="mt-4 w-full"
        >
          Proceed to Login
        </Button>
      </Alert>
    );
  } else if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Verification Failed</AlertTitle>
        <AlertDescription>
          {error?.message ||
            "An unexpected error occurred. The link may be invalid or expired."}
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
  // Fallback if no token and not loading/erroring (should be handled by route mostly)
  return null;
}
