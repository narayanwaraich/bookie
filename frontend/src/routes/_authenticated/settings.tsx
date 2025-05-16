import { createFileRoute } from "@tanstack/react-router";

interface UserSettings {
  id: string;
  email: string;
  username: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  // const { settings } = Route.useLoaderData()

  return <></>;
}
