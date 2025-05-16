import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { FolderTree } from "@/components/features/folders/FolderTree"; // Import FolderTree
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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-4 hidden md:block">
        {" "}
        {/* Hide on small screens */}
        <h2 className="text-lg font-semibold mb-4">Folders</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {" "}
          {/* Adjust height as needed */}
          <FolderTree
          // selectedFolderId={selectedFolderId}
          // onFolderSelect={setSelectedFolderId}
          />
        </ScrollArea>
        {/* Add other sidebar items here if needed, e.g., Tags, Collections */}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* TODO: Add a Header component here? */}
        <Outlet />
      </main>
    </div>
  );
}
