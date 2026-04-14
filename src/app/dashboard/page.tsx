import { Suspense } from "react";

import { DashboardPageClient } from "./dashboard-page-client";
import { DashboardSkeleton } from "./dashboard-skeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPageClient />
    </Suspense>
  );
}
