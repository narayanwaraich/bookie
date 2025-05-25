// src/components/features/dashboard/DashboardView.tsx
import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RecentBookmarksWidget } from "./RecentBookmarksWidget";
import { StatisticsWidget } from "./StatisticsWidget";
import { QuickActionsWidget } from "./QuickActionsWidget";

export function DashboardView() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your bookmarks."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentBookmarksWidget />
        <StatisticsWidget />
        <QuickActionsWidget />
        {/* You can add more widgets or larger components here */}
        {/* Example: A larger component spanning more columns */}
        {/* <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Activity Feed</CardTitle></CardHeader>
          <CardContent><p>Activity placeholder</p></CardContent>
        </Card> */}
      </div>
    </div>
  );
}
