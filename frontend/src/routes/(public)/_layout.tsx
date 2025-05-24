import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/(public)/_layout")({
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});
