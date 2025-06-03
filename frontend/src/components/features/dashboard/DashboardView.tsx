// src/components/features/dashboard/DashboardView.tsx
// import { PageHeader } from "@/components/layout/PageHeader";
import { RecentBookmarksWidget } from "./RecentBookmarksWidget";
import { StatisticsWidget } from "./StatisticsWidget";
import { QuickActionsWidget } from "./QuickActionsWidget";

export function DashboardView() {
  return (
    
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your bookmarks."
      /> */}
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
    </div>
  );
}
