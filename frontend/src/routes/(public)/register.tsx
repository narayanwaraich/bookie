import { createFileRoute, Link } from "@tanstack/react-router";
import { RegisterComponent } from "@/components/features/auth/forms/RegisterForm";
import { AuthPageLayout } from "@/components/features/auth/ui/AuthPageLayout";

export const Route = createFileRoute("/(public)/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthPageLayout
      title="Create an account"
      description="Enter your information below to create your account."
      footerContent={
        <>
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterComponent />
    </AuthPageLayout>
  );
}
