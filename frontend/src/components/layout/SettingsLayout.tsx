import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "./PageHeader";
import { Button } from "@/components/ui/button"; // Assuming Button is in ui

// Define navigation items for settings
const settingsNavItems = [
  { to: "/settings/profile", label: "Profile" },
  { to: "/settings/preferences", label: "Preferences" }, // Example future item
  { to: "/settings/account", label: "Account" }, // Example future item
  { to: "/settings/data", label: "Data Management" }, // Example future item
  // Add more settings sections here
];

export function SettingsLayout() {
  const router = useRouterState();

  const isActive = (path: string) => {
    return router.location.pathname.startsWith(path);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and application preferences."
      />
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex flex-col gap-1 md:w-1/4 lg:w-1/5">
          {settingsNavItems.map((item) => (
            <Button
              key={item.to}
              variant={isActive(item.to) ? "secondary" : "ghost"}
              className="justify-start"
              asChild
            >
              <Link to={item.to} params={{}} search={{}}>
                {" "}
                {/* Ensure params/search are provided if Link expects them */}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex-1 md:w-3/4 lg:w-4/5">
          {/* Outlet will render the specific settings page (profile, preferences, etc.) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
