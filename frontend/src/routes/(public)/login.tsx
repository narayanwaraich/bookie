import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import * as z from "zod";
import LoginFormComponent from "@/components/features/auth/forms/LoginFormComponent";
import { AuthPageLayout } from "@/components/features/auth/ui/AuthPageLayout";

// Define expected search params for the login route
const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(""), // Where to redirect after login
  sessionExpired: z.string().optional().catch(""), // To show session expired message
});

export const fallback = "/dashboard" as const;

export const Route = createFileRoute("/(public)/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthPageLayout
      title="Login"
      description="Enter your email below to login to your account."
      footerContent={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="underline">
            Sign up
          </Link>
          <div className="mt-2">
            <Link to="/forgot-password" className="underline">
              Forgot password?
            </Link>
          </div>
        </>
      }
    >
      <LoginFormComponent />
    </AuthPageLayout>
  );
}
