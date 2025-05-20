import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/features/dashboard/DashboardView";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});
