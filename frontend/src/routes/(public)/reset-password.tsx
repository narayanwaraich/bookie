import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(public)/reset-password"!</div>;
}
