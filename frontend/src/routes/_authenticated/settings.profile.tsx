import { createFileRoute } from "@tanstack/react-router";
import UserProfilePage from "@/components/features/settings/profile/UserProfilePage";

export const Route = createFileRoute("/_authenticated/settings/profile")({
  component: UserProfilePage,
});
