import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/components/layout/SettingsLayout";

interface UserSettings {
  id: string;
  email: string;
  username: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}
//  Acts as a layout for settings children
export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsLayout,
});
