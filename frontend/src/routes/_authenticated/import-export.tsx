import { createFileRoute } from "@tanstack/react-router";
import ImportExportComponent from "@/components/features/import-export/ImportExportView";

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
