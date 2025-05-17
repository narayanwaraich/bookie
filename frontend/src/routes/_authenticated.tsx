import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable sidebar

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
          sessionExpired: "true",
        },
        // replace: true,
      });
    }
  },
  component: AuthenticatedLayoutComponent,
});

function AuthenticatedLayoutComponent() {
  // TODO: Add state/logic to handle selected folder if needed globally
  // const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();

  return (
    <main className="flex-1 overflow-y-auto">
      {/* TODO: Add a Header component here? */}
      <Outlet />
    </main>
  );
}
