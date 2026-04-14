"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStore } from "@/lib/store/useLocalStore";

interface ShiftEntry {
  id: string;
  date: string;
  shifts: number;
  hours: number;
  estimatedPay: number;
}

interface CarerPaymentStatus {
  allowanceStatus: "not applied" | "applied" | "approved" | "receiving";
  allowanceApplicationDate?: string;
  paymentStatus: "not applied" | "applied" | "approved" | "receiving";
}

interface KristyNotes {
  wellbeing: string;
  upcomingNeeds: string;
  marriageCheckIn: string;
  lastUpdated: string;
}

const seedShifts: ShiftEntry[] = [];

const seedCarerStatus: CarerPaymentStatus = {
  allowanceStatus: "applied",
  allowanceApplicationDate: "2026-04-07",
  paymentStatus: "not applied",
};

const seedNotes: KristyNotes = {
  wellbeing: "",
  upcomingNeeds: "",
  marriageCheckIn: "",
  lastUpdated: new Date().toISOString().split("T")[0],
};

export default function KristyPage() {
  // 1. All useLocalStore calls first
  const [shiftsLog, setShiftsLog] = useLocalStore<ShiftEntry[]>("kristyShifts", seedShifts);
  const [carerStatus, setCarerStatus] = useLocalStore<CarerPaymentStatus>("kristyCarerStatus", seedCarerStatus);
  const [kristyNotes, setKristyNotes] = useLocalStore<KristyNotes>("kristyNotes", seedNotes);

  // 2. All useState calls next
  const [mounted, setMounted] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<"not yet scheduled" | "scheduled" | "completed" | "offer received" | "started">("scheduled");
  const [interviewDate, setInterviewDate] = useState("2026-04-08");
  const [interviewNote, setInterviewNote] = useState("Dubbo Health Service — paediatric ward");
  const [startDate, setStartDate] = useState("");
  const [shiftsThisWeek, setShiftsThisWeek] = useState("0");
  const [shiftPreference, setShiftPreference] = useState("Ask about weekend shifts — worth $300-400/mo extra. Max 3 shifts/week to maintain Carer Payment eligibility (25hr limit)");
  const [newShiftDate, setNewShiftDate] = useState("");
  const [newShiftCount, setNewShiftCount] = useState("");
  const [newShiftHours, setNewShiftHours] = useState("");
  const [notesWellbeing, setNotesWellbeing] = useState(kristyNotes.wellbeing);
  const [notesNeeds, setNotesNeeds] = useState(kristyNotes.upcomingNeeds);
  const [notesMarriage, setNotesMarriage] = useState(kristyNotes.marriageCheckIn);

  // 3. All useEffect calls next
  useEffect(() => setMounted(true), []);

  // 4. Mounted guard after all hooks
  if (!mounted) return null;

  // 5. All other logic
  const shiftsWeekCount = parseInt(shiftsThisWeek) || 0;
  const estimatedMonthlyFromShifts = shiftsWeekCount * 1080 * 4; // 4 weeks per month
  const carerAllowanceMonthly = 351;
  const carerPaymentMonthly = carerStatus.paymentStatus === "receiving" ? 1926 : 0;

  const incomeScenarios = [
    { scenario: "No nursing, no Centrelink", josh: 4853, kristy: 0, carerAllow: 0, total: 4853, vsCosts: -1042 },
    { scenario: "No nursing + Carer Allow", josh: 4853, kristy: 0, carerAllow: 351, total: 5204, vsCosts: -691 },
    { scenario: "1 shift/wk + Carer Allow", josh: 4853, kristy: 1080, carerAllow: 351, total: 6284, vsCosts: 0 },
    { scenario: "2 shifts/wk + Carer Allow", josh: 4853, kristy: 2160, carerAllow: 351, total: 7364, vsCosts: 1034 },
    { scenario: "3 shifts/wk + Carer Allow", josh: 4853, kristy: 3240, carerAllow: 351, total: 8444, vsCosts: 2114 },
    { scenario: "3 shifts + Both payments", josh: 4853, kristy: 3240, carerAllow: 2277, total: 10370, vsCosts: 4040 },
  ];

  const currentScenarioIndex = shiftsWeekCount === 0 
    ? (carerStatus.allowanceStatus === "receiving" ? 1 : 0)
    : shiftsWeekCount === 1
    ? 2
    : shiftsWeekCount === 2
    ? 3
    : shiftsWeekCount >= 3
    ? (carerStatus.paymentStatus === "receiving" ? 5 : 4)
    : 0;

  const addShiftEntry = () => {
    if (newShiftDate && newShiftCount && newShiftHours) {
      const estimatedPay = parseFloat(newShiftCount) * 270; // ~$270 per shift
      const newEntry: ShiftEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: newShiftDate,
        shifts: parseFloat(newShiftCount),
        hours: parseFloat(newShiftHours),
        estimatedPay,
      };
      setShiftsLog([...shiftsLog, newEntry]);
      setNewShiftDate("");
      setNewShiftCount("");
      setNewShiftHours("");
    }
  };

  const deleteShiftEntry = (id: string) => {
    setShiftsLog(shiftsLog.filter(s => s.id !== id));
  };

  const saveNotes = () => {
    setKristyNotes({
      wellbeing: notesWellbeing,
      upcomingNeeds: notesNeeds,
      marriageCheckIn: notesMarriage,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
  };

  const cycleAllowanceStatus = () => {
    const statuses: CarerPaymentStatus["allowanceStatus"][] = ["not applied", "applied", "approved", "receiving"];
    const currentIndex = statuses.indexOf(carerStatus.allowanceStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setCarerStatus({ ...carerStatus, allowanceStatus: statuses[nextIndex] });
  };

  const cyclePaymentStatus = () => {
    const statuses: CarerPaymentStatus["paymentStatus"][] = ["not applied", "applied", "approved", "receiving"];
    const currentIndex = statuses.indexOf(carerStatus.paymentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setCarerStatus({ ...carerStatus, paymentStatus: statuses[nextIndex] });
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Kristy — Support & Career" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* SECTION 1: Status Snapshot */}
        <SectionCard title="Status Snapshot">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Current Role" value="Primary Carer + RN" />
            <div className="flex flex-col justify-center">
              <MetricCard
                label="Carer Allowance"
                value="$351/mo"
                subtitle={carerStatus.allowanceStatus === "applied" ? "Applied — appt 21 Apr" : carerStatus.allowanceStatus === "receiving" ? "Approved" : "Apply now"}
              />
            </div>
            <MetricCard label="Shifts This Week" value={shiftsThisWeek} subtitle="(editable)" />
            <MetricCard
              label="Est. Monthly Income (Shifts)"
              value={`$${estimatedMonthlyFromShifts.toLocaleString()}`}
              subtitle="from nursing"
            />
          </div>
        </SectionCard>
        {/* REMINDER: Centrelink Appointment */}
        <Card className="border-l-4 border-l-amber-500 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              📅 Centrelink Appointment — 21 April 2026
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-900 space-y-2">
            <p><strong>Action:</strong> Kristy to formally apply as Sylvie's carer at this appointment.</p>
            <p><strong>Bring:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Sylvie's diagnosis reports (ASD + ADHD)</li>
              <li>NDIS plan documents</li>
              <li>GP evidence of care needs</li>
            </ul>
            <p className="text-xs text-amber-800 mt-3">Once approved, Carer Allowance will add $351/month + $1,600 annual bonus. Carer Payment ($1,926/mo) possible if work under 25h/week.</p>
          </CardContent>
        </Card>
        {/* SECTION 2: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: Nursing Career Tracker */}
          <SectionCard title="Nursing Career Tracker">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Employer Target</label>
                <div className="text-base mt-1">Dubbo Health Service (Dubbo Base Hospital)</div>
              </div>
              <div>
                <label className="text-sm font-semibold">Ward</label>
                <div className="text-base mt-1">Paediatric (kids' ward)</div>
              </div>
              <div>
                <label className="text-sm font-semibold">Interview Status</label>
                <select
                  value={interviewStatus}
                  onChange={(e) => setInterviewStatus(e.target.value as any)}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="not yet scheduled">Not yet scheduled</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="offer received">Offer received</option>
                  <option value="started">Started</option>
                </select>
              </div>
              {interviewStatus === "scheduled" && (
                <div>
                  <label className="text-sm font-semibold">Interview Date</label>
                  <Input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              {interviewStatus === "scheduled" && (
                <div>
                  <label className="text-sm font-semibold">Interview Notes</label>
                  <Input
                    value={interviewNote}
                    onChange={(e) => setInterviewNote(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold">Start Date (if offered)</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Shift Preference Notes</label>
                <Textarea
                  value={shiftPreference}
                  onChange={(e) => setShiftPreference(e.target.value)}
                  className="mt-1 text-sm"
                  rows={3}
                />
              </div>

              {/* Shift Log */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Shift Log</h4>
                <div className="max-h-48 overflow-y-auto space-y-1 mb-3">
                  {shiftsLog.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No shifts logged yet</p>
                  ) : (
                    shiftsLog.map(entry => (
                      <div key={entry.id} className="flex justify-between items-center text-sm p-2 border rounded hover:bg-gray-50">
                        <div>
                          <div className="font-medium">{new Date(entry.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-600">{entry.shifts} shift(s) • {entry.hours}h • ${entry.estimatedPay}</div>
                        </div>
                        <Button
                          onClick={() => deleteShiftEntry(entry.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 h-6 px-2"
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Shift Entry */}
                <div className="border-t pt-2 space-y-2">
                  <Input type="date" value={newShiftDate} onChange={(e) => setNewShiftDate(e.target.value)} placeholder="Date" className="text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" value={newShiftCount} onChange={(e) => setNewShiftCount(e.target.value)} placeholder="Shifts" className="text-sm" />
                    <Input type="number" value={newShiftHours} onChange={(e) => setNewShiftHours(e.target.value)} placeholder="Hours" className="text-sm" />
                  </div>
                  <Button onClick={addShiftEntry} className="w-full text-sm">
                    Add Shift
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* RIGHT: Carer Payment Status */}
          <SectionCard title="Carer Payment Status">
            <div className="space-y-6">
              
              {/* Carer Allowance */}
              <div className="p-4 border rounded bg-pink-50">
                <h4 className="font-semibold text-pink-900 mb-3">Carer Allowance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Rate:</span>
                    <span className="font-semibold">$162.60/fortnight ($351/mo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Income test:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">Under $250k ✓</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Hours test:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">None ✓</Badge>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-700">Status:</span>
                    <button
                      onClick={cycleAllowanceStatus}
                      className="px-3 py-1 rounded font-medium bg-pink-200 text-pink-800 hover:bg-pink-300 transition cursor-pointer"
                    >
                      {carerStatus.allowanceStatus}
                    </button>
                  </div>
                  {carerStatus.allowanceApplicationDate && (
                    <div className="text-xs text-gray-600 mt-2 p-2 bg-white rounded">
                      <strong>Application date:</strong> {new Date(carerStatus.allowanceApplicationDate).toLocaleDateString()}
                      <div className="mt-1">Centrelink appt: 21 April 2026 — Kristy to formally apply</div>
                    </div>
                  )}
                  <div className="bg-white p-2 rounded text-xs text-gray-600 mt-2">
                    <strong>Annual bonuses:</strong> Child Disability Assistance $1,000 + Carer Supplement $600 = $1,600/year (paid 1 July)
                  </div>
                </div>
              </div>

              {/* Carer Payment */}
              <div className="p-4 border rounded bg-pink-50">
                <h4 className="font-semibold text-pink-900 mb-3">Carer Payment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Rate:</span>
                    <span className="font-semibold">$888.50/fortnight ($1,926/mo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Work hours limit:</span>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">Under 25h/week</Badge>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-700">Status:</span>
                    <button
                      onClick={cyclePaymentStatus}
                      className="px-3 py-1 rounded font-medium bg-pink-200 text-pink-800 hover:bg-pink-300 transition cursor-pointer"
                    >
                      {carerStatus.paymentStatus}
                    </button>
                  </div>
                  <div className="bg-white p-2 rounded text-xs text-gray-600 mt-2">
                    <strong>Note:</strong> 3 nursing shifts = ~24–25hrs. 4+ shifts = loses eligibility
                  </div>
                </div>
              </div>

              {/* MyGov Action Button */}
              <a
                href="https://my.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  Apply on MyGov →
                </Button>
              </a>
            </div>
          </SectionCard>
        </div>

        {/* SECTION 3: Income Scenarios */}
        <SectionCard title="Income Scenarios (Monthly)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 font-semibold">
                  <th className="text-left p-2">Scenario</th>
                  <th className="text-right p-2">Josh</th>
                  <th className="text-right p-2">Kristy</th>
                  <th className="text-right p-2">Carer Allow</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-right p-2">vs Costs</th>
                </tr>
              </thead>
              <tbody>
                {incomeScenarios.map((scenario, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${
                      idx === currentScenarioIndex
                        ? "bg-pink-100 font-semibold"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-2">{scenario.scenario}</td>
                    <td className="text-right p-2">${scenario.josh.toLocaleString()}</td>
                    <td className="text-right p-2">${scenario.kristy.toLocaleString()}</td>
                    <td className="text-right p-2">${scenario.carerAllow.toLocaleString()}</td>
                    <td className="text-right p-2 font-semibold">${scenario.total.toLocaleString()}</td>
                    <td className={`text-right p-2 font-semibold ${scenario.vsCosts >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {scenario.vsCosts >= 0 ? "+" : ""}{scenario.vsCosts.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-600 mt-3 p-2 bg-gray-50 rounded">
              <strong>Monthly costs:</strong> ~$5,895 (mortgage $1,300 + rent $2,427 + living expenses ~$2,168)
            </div>
          </div>
        </SectionCard>

        {/* SECTION 4: Private Notes */}
        <SectionCard title="Support & Wellbeing Notes">
          <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-100 rounded">
            <strong>Private notes</strong> — visible only on this device
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">How Kristy is going</label>
              <Textarea
                value={notesWellbeing}
                onChange={(e) => setNotesWellbeing(e.target.value)}
                placeholder="Health, energy, mood, any concerns..."
                className="mt-1 text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Upcoming needs or support ideas</label>
              <Textarea
                value={notesNeeds}
                onChange={(e) => setNotesNeeds(e.target.value)}
                placeholder="What could help Kristy? Upcoming appointments? Support plans..."
                className="mt-1 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Marriage check-in notes</label>
              <Textarea
                value={notesMarriage}
                onChange={(e) => setNotesMarriage(e.target.value)}
                placeholder="Brief check-in — connection, any issues, plans..."
                className="mt-1 text-sm"
                rows={2}
              />
            </div>
            <Button onClick={saveNotes} className="w-full bg-pink-600 hover:bg-pink-700">
              Save Notes (Last updated: {kristyNotes.lastUpdated})
            </Button>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}