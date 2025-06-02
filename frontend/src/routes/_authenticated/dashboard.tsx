import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { DashboardView } from "@/components/features/dashboard/DashboardView";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { FolderTree } from "@/components/features/folders/ui/FolderTree";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardRouteComponent,
});

function DashboardRouteComponent() {
  const router = useRouterState();
  const navigate = useNavigate();

  const handleFolderSelection = (folderId: string) => {
    navigate({ to: "/folders/$folderId", params: { folderId } });
  };

  return (
    <AuthenticatedLayout
      sidebarContent={
        <FolderTree
          selectedFolderId={
            router.location.pathname.startsWith("/folders/")
              ? router.location.pathname.split("/").pop()
              : undefined
          }
          onFolderSelect={handleFolderSelection}
        />
      }
    >
      <DashboardView />
    </AuthenticatedLayout>
  );
}
