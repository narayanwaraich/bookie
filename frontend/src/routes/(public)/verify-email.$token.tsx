// src/routes/(public)/verify-email.$token.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import VerifyEmailTokenStatusComponent from "@/components/features/auth/ui/VerifyEmailTokenStatus";
import { AuthPageLayout } from "@/components/features/auth/ui/AuthPageLayout";

export const Route = createFileRoute("/(public)/verify-email/$token")({
  component: VerifyEmailTokenPage,
  // Optional: Loader to call the verification API endpoint (if you prefer server-side verification first)
  // loader: async ({ params, context }) => {
  //   try {
  //     const result = await context.trpc.auth.verifyEmail.query({ token: params.token });
  //     return { verificationResult: result, error: null };
  //   } catch (error: any) {
  //     return { verificationResult: null, error: error.message || "Verification failed" };
  //   }
  // },
  errorComponent: (
    { error }, // Only if loader has errors
  ) => (
    <AuthPageLayout title="Verification Error">
      <div>Verification failed: {error.message}</div>
      <Link to="/login">Go to Login</Link>
    </AuthPageLayout>
  ),
});

function VerifyEmailTokenPage() {
  const { token } = Route.useParams();
  // const loaderData = Route.useLoaderData(); // If using loader

  // if (loaderData?.error) {
  //   return (
  //     <AuthPageLayout title="Verification Failed">
  //       <Alert variant="destructive">
  //         <AlertTitle>Verification Failed</AlertTitle>
  //         <AlertDescription>{loaderData.error}</AlertDescription>
  //          <Link to="/login" className="mt-4 inline-block underline">Go to Login</Link>
  //       </Alert>
  //     </AuthPageLayout>
  //   );
  // }
  // if (loaderData?.verificationResult?.success) {
  //    return (
  //     <AuthPageLayout title="Email Verified">
  //       <Alert variant="default">
  //         <AlertTitle>Email Verified!</AlertTitle>
  //         <AlertDescription>{loaderData.verificationResult.message}</AlertDescription>
  //          <Link to="/login" className="mt-4 inline-block underline">Proceed to Login</Link>
  //       </Alert>
  //     </AuthPageLayout>
  //   );
  // }

  return (
    <AuthPageLayout
      title="Verifying Email"
      description="Please wait while we verify your email address."
    >
      <VerifyEmailTokenStatusComponent token={token} />
    </AuthPageLayout>
  );
}
