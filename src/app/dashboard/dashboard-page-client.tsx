"use client";

import dynamic from "next/dynamic";

import { DashboardSkeleton } from "./dashboard-skeleton";

const DashboardClient = dynamic(() => import("./dashboard-client"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

export function DashboardPageClient() {
  return <DashboardClient />;
}
