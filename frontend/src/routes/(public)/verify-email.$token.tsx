import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailComponent } from "@/components/features/auth/VerifyEmailTokenStatus";

export const Route = createFileRoute("/(public)/verify-email/$token")({
  component: VerifyEmailComponent,
  // Optional: Loader to call the verification API endpoint
  // loader: async ({ params }) => {
  //   await verifyEmailApiCall(params.token);
  //   return {}; // Or return data needed by the component
  // },
  // Optional: Add error component for verification failures
  errorComponent: ({ error }) => (
    <div>Verification failed: {error.message}</div>
  ),
});
