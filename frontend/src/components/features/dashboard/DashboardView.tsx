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
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <StatisticsWidget />
            <QuickActionsWidget />
          </div>
          <div className="px-4 lg:px-6">
            <RecentBookmarksWidget />
          </div>

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
