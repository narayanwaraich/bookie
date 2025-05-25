import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/components/features/dashboard/DashboardView";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardView,
});
