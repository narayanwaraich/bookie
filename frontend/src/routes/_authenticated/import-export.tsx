import { createFileRoute } from "@tanstack/react-router";

interface ImportExportStatus {
  lastImportTime?: string;
  lastExportTime?: string;
  currentJob?: {
    type: "import" | "export";
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    error?: string;
  };
}

export const Route = createFileRoute("/_authenticated/import-export")({
  component: ImportExportComponent,
});

function ImportExportComponent() {
  // const { status } = Route.useLoaderData()

  return <></>;
}
