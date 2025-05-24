import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
          sessionExpired: "true",
        },
      });
    }
  },
  component: () => (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ),
});
