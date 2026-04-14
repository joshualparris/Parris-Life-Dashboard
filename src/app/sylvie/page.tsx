"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NDISBudget } from "@/components/modules/ndis-budget";
import { AppointmentList } from "@/components/modules/appointment-list";
import { useLocalStore } from "@/lib/store/useLocalStore";
import { NDISPlan, Appointment } from "@/lib/store/types";
import seedData from "@/data/seed.json";

interface Provider {
  name: string;
  organisation: string;
  serviceType: string;
  location: string;
}

interface SpendingEntry {
  date: string;
  provider: string;
  category: string;
  amount: number;
  notes?: string;
}

export default function SylviePage() {
  // 1. All useLocalStore calls first
  const [data, setData] = useLocalStore('parris-life-data', seedData);
  const [spendingLog, setSpendingLog] = useLocalStore<SpendingEntry[]>('ndisSpendingLog', []);

  // 2. All useState calls next
  const [mounted, setMounted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(data.appointments || []);
  const [newApptProvider, setNewApptProvider] = useState("");
  const [newApptType, setNewApptType] = useState("");
  const [newApptDate, setNewApptDate] = useState("");
  const [newApptTime, setNewApptTime] = useState("");
  const [newApptLocation, setNewApptLocation] = useState("");
  const [newApptNotes, setNewApptNotes] = useState("");
  const [newSpendDate, setNewSpendDate] = useState("");
  const [newSpendProvider, setNewSpendProvider] = useState("");
  const [newSpendCategory, setNewSpendCategory] = useState("");
  const [newSpendAmount, setNewSpendAmount] = useState("");
  const [newSpendNotes, setNewSpendNotes] = useState("");

  // 3. All useEffect calls next
  useEffect(() => setMounted(true), []);

  // 4. Mounted guard after all hooks
  if (!mounted) return null;

  // 5. All other logic
  const ndisPlan: NDISPlan = data.ndisPlan;
  const totalSpent = ndisPlan.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = ndisPlan.totalBudget - totalSpent;
  
  const planEndDate = new Date("2027-02-17");
  const today = new Date();
  const daysUntilReview = Math.max(0, Math.ceil((planEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const providers: Provider[] = [
    { name: "Renae Matheson", organisation: "PsychSolutions", serviceType: "Psychology", location: "Orange" },
    { name: "Ruby", organisation: "Z&L Corporations", serviceType: "Occupational Therapy", location: "Dubbo" },
    { name: "Gidgee Health Collective", organisation: "Gidgee Health", serviceType: "Speech Pathology", location: "Orange" },
    { name: "Bec", organisation: "The Village Therapy", serviceType: "Play Therapy", location: "Dubbo" },
    { name: "RR Allied Health", organisation: "RR Allied Health", serviceType: "Allied Health", location: "Dubbo" },
    { name: "Dr Anne Dawson", organisation: "CVCG", serviceType: "Specialist Assessment", location: "Orange" },
  ];

  const sylvieAppointments = appointments.filter(appt => appt.person === 'Sylvie').slice(0, 8);

  const getSpendingColor = (spent: number, allocated: number): 'green' | 'amber' | 'red' => {
    const percentage = (spent / allocated) * 100;
    if (percentage < 60) return 'green';
    if (percentage < 85) return 'amber';
    return 'red';
  };

  const addAppointment = () => {
    if (newApptProvider && newApptType && newApptDate && newApptLocation) {
      const newAppt: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        person: 'Sylvie',
        provider: newApptProvider,
        type: newApptType,
        date: new Date(`${newApptDate}T${newApptTime || '00:00'}`).toISOString(),
        location: newApptLocation,
        notes: newApptNotes || undefined,
      };
      const updatedAppts = [...appointments, newAppt];
      setAppointments(updatedAppts);
      setData({ ...data, appointments: updatedAppts });
      setNewApptProvider("");
      setNewApptType("");
      setNewApptDate("");
      setNewApptTime("");
      setNewApptLocation("");
      setNewApptNotes("");
    }
  };

  const addSpendingEntry = () => {
    if (newSpendDate && newSpendProvider && newSpendCategory && newSpendAmount) {
      const entry: SpendingEntry = {
        date: newSpendDate,
        provider: newSpendProvider,
        category: newSpendCategory,
        amount: parseFloat(newSpendAmount),
        notes: newSpendNotes || undefined,
      };
      setSpendingLog([...spendingLog, entry]);
      setNewSpendDate("");
      setNewSpendProvider("");
      setNewSpendCategory("");
      setNewSpendAmount("");
      setNewSpendNotes("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Sylvie — NDIS & Support" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* SECTION 1: NDIS Plan Overview (Metric Cards) */}
        <SectionCard title="NDIS Plan Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Total Budget" value={`$${ndisPlan.totalBudget}`} subtitle={ndisPlan.planYear} />
            <MetricCard label="Total Spent" value={`$${totalSpent}`} color="amber" />
            <MetricCard label="Remaining" value={`$${totalRemaining}`} color={totalRemaining > 2000 ? "green" : "red"} />
            <MetricCard label="Plan Review" value={`${daysUntilReview} days`} subtitle="until 17 Feb 2027" />
          </div>
        </SectionCard>

        {/* SECTION 2: Budget by Category */}
        <SectionCard title="Budget by Category">
          <NDISBudget data={ndisPlan} />
          <div className="mt-6 space-y-3">
            {ndisPlan.categories.map((category) => {
              const spentPercent = (category.spent / category.allocated) * 100;
              const spendColor = getSpendingColor(category.spent, category.allocated);
              const colorMap = {
                green: "bg-green-100 text-green-800",
                amber: "bg-yellow-100 text-yellow-800",
                red: "bg-red-100 text-red-800",
              };
              return (
                <div key={category.name} className="p-3 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-semibold">{category.name}</div>
                      <div className="text-sm text-gray-600">{category.provider}</div>
                    </div>
                    <Badge className={colorMap[spendColor]}>
                      {Math.round(spentPercent)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    ${category.spent} of ${category.allocated} spent
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* SECTION 3: Appointments (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Upcoming Appointments */}
          <SectionCard title="Upcoming Appointments">
            <AppointmentList appointments={sylvieAppointments} />
          </SectionCard>

          {/* Right: Add Appointment Form */}
          <SectionCard title="Add New Appointment">
            <div className="space-y-3">
              <Input
                placeholder="Provider name"
                value={newApptProvider}
                onChange={(e) => setNewApptProvider(e.target.value)}
              />
              <Input
                placeholder="Type (e.g., Psychology, OT)"
                value={newApptType}
                onChange={(e) => setNewApptType(e.target.value)}
              />
              <Input
                type="date"
                value={newApptDate}
                onChange={(e) => setNewApptDate(e.target.value)}
              />
              <Input
                type="time"
                value={newApptTime}
                onChange={(e) => setNewApptTime(e.target.value)}
              />
              <Input
                placeholder="Location"
                value={newApptLocation}
                onChange={(e) => setNewApptLocation(e.target.value)}
              />
              <Textarea
                placeholder="Notes (optional)"
                value={newApptNotes}
                onChange={(e) => setNewApptNotes(e.target.value)}
              />
              <Button onClick={addAppointment} className="w-full">
                Save Appointment
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* SECTION 4: Therapy Team */}
        <SectionCard title="Therapy Team">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <Card key={provider.name} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="font-semibold text-lg">{provider.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{provider.organisation}</div>
                  <div className="text-sm mt-2">
                    <strong>Service:</strong> {provider.serviceType}
                  </div>
                  <div className="text-sm">
                    <strong>Location:</strong> {provider.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionCard>

        {/* SECTION 5: Spending Log */}
        <SectionCard title="Spending Log">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-2 font-semibold text-sm p-2 bg-gray-100 rounded">
              <div>Date</div>
              <div>Provider</div>
              <div>Category</div>
              <div>Amount</div>
              <div>Notes</div>
            </div>

            {/* Spending Entries */}
            {spendingLog.map((entry, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 text-sm p-2 border rounded">
                <div>{new Date(entry.date).toLocaleDateString()}</div>
                <div>{entry.provider}</div>
                <div>{entry.category}</div>
                <div className="font-semibold">${entry.amount}</div>
                <div className="text-gray-600">{entry.notes || "—"}</div>
              </div>
            ))}

            {/* Add Entry Form */}
            <div className="grid grid-cols-5 gap-2 p-2 border-t border-dashed pt-4">
              <Input
                type="date"
                value={newSpendDate}
                onChange={(e) => setNewSpendDate(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Provider"
                value={newSpendProvider}
                onChange={(e) => setNewSpendProvider(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Category"
                value={newSpendCategory}
                onChange={(e) => setNewSpendCategory(e.target.value)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newSpendAmount}
                onChange={(e) => setNewSpendAmount(e.target.value)}
                className="text-sm"
              />
              <Button onClick={addSpendingEntry} size="sm">
                Add
              </Button>
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}