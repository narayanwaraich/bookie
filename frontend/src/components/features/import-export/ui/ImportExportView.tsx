import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
// import ImportForm from '../forms/ImportForm'; // Future
// import ExportForm from '../forms/ExportForm'; // Future
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ImportExportView() {
  return (
    <div>
      <PageHeader
        title="Import / Export Data"
        description="Manage your bookmarks data by importing or exporting files."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Import bookmarks from HTML, CSV, or JSON files.
            </p>
            {/* <ImportForm /> */}
            <p className="text-center text-muted-foreground py-4">
              Import form coming soon.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Export Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Export your bookmarks to HTML, CSV, or JSON format.
            </p>
            {/* <ExportForm /> */}
            <p className="text-center text-muted-foreground py-4">
              Export form coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
