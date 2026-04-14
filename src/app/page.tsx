"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { FinanceSnapshot } from "@/components/modules/finance-snapshot";
import { NDISBudget } from "@/components/modules/ndis-budget";
import { AppointmentList } from "@/components/modules/appointment-list";
import { ActionList } from "@/components/modules/action-list";
import { TopBar } from "@/components/layout/top-bar";
import { useLocalStore } from "@/lib/store/useLocalStore";
import seedData from "@/data/seed.json";

export default function OverviewPage() {
  const [data, setData] = useLocalStore('parris-life-data', seedData);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Overview" />
      <div className="flex-1 overflow-auto p-6">
        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Josh Net Monthly" value={`$${data.financeSummary.joshNetMonthly}`} />
          <MetricCard label="Rental Income" value={`$${data.financeSummary.rentalIncome}`} />
          <MetricCard label="Re-draw Available" value={`$${data.financeSummary.reDrawAvailable}`} />
          <MetricCard label="NDIS Total Budget" value={`$${data.ndisPlan.totalBudget}`} />
        </div>

        {/* Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Finances Summary">
            <FinanceSnapshot data={data.financeSummary} />
          </SectionCard>
          <SectionCard title="Upcoming Appointments">
            <AppointmentList appointments={data.appointments} />
          </SectionCard>
          <SectionCard title="NDIS Budget by Category">
            <NDISBudget data={data.ndisPlan} />
          </SectionCard>
          <SectionCard title="Actions Due">
            <ActionList actions={data.actionItems} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
