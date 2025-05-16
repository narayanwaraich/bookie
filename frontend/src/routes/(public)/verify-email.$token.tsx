import { createFileRoute } from "@tanstack/react-router";

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

function VerifyEmailComponent() {
  const { token } = Route.useParams();
  // Placeholder for the component displaying verification status
  return (
    <div>
      <h1>Verify Email</h1>
      <p>Verifying with token: {token}</p>
      {/* Display success/failure message based on loader/API call */}
    </div>
  );
}
