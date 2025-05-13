import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { trpc } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Assuming Alert component exists
import { Loader2 } from 'lucide-react'; // For loading spinner

// Define the expected search parameters for this route
const verifyEmailSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute('/(public)/verify-email')({
  validateSearch: (search) => verifyEmailSearchSchema.parse(search), // Validate search params
  component: VerifyEmailComponent,
});

function VerifyEmailComponent() {
  const navigate = useNavigate();
  const { token } = Route.useSearch(); // Get validated search params

  const { data, isLoading, error, isSuccess, isError } = useQuery(trpc.auth.verifyEmail.queryOptions(
    { token: token || '' }, // Pass the token to the query
    {
      enabled: !!token, // Only run the query if a token is present
      retry: false, // Don't retry on failure, as it's likely a one-time token
    }
  ))

  useEffect(() => {
    if (!token) {
      // Optional: Redirect or show message if no token is present
      // navigate({ to: '/login', replace: true });
    }
  }, [token, navigate]);

  let content;

  if (isLoading && token) {
    content = (
      <div className="flex flex-col items-center justify-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    );
  } else if (isSuccess && data) {
    content = (
      <Alert variant="default"> {/* Changed from success to default, assuming success is default styling */}
        <AlertTitle>Email Verified!</AlertTitle>
        <AlertDescription>{data.message || 'Your email has been successfully verified.'}</AlertDescription>
        <Button onClick={() => navigate({ to: '/login' })} className="mt-4">
          Proceed to Login
        </Button>
      </Alert>
    );
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Verification Failed</AlertTitle>
        <AlertDescription>
          {error?.message || 'An unexpected error occurred during verification. The link may be invalid, expired, or there might be a server issue. Please try again or contact support if the problem persists.'}
        </AlertDescription>
        <Button onClick={() => navigate({ to: '/login' })} className="mt-4">
          Go to Login
        </Button>
      </Alert>
    );
  } else if (!token) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>No Verification Token</AlertTitle>
        <AlertDescription>
          No verification token was found. Please ensure you clicked the correct link from your email.
        </AlertDescription>
        <Button onClick={() => navigate({ to: '/login' })} className="mt-4">
          Go to Login
        </Button>
      </Alert>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {token ? 'Attempting to verify your email address.' : 'Email verification process.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    </div>
  );
}
