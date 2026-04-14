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
import { useLocalStore } from "@/lib/store/useLocalStore";
import { HealthLog } from "@/lib/store/types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const moodEmoji = {
  1: "😔",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

const seedHealthLog: HealthLog[] = [
  {
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sleepHours: 7,
    hrvScore: 68,
    steps: 8500,
    mood: 3,
    notes: "Decent day, bit tired",
  },
  {
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sleepHours: 7.5,
    hrvScore: 72,
    steps: 10200,
    mood: 4,
    notes: "Good walk in evening",
  },
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sleepHours: 6.5,
    hrvScore: 65,
    steps: 7800,
    mood: 2,
    notes: "Late night, didn't sleep well",
  },
  {
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sleepHours: 8,
    hrvScore: 75,
    steps: 11200,
    mood: 4,
    notes: "Great recovery sleep",
  },
  {
    date: new Date().toISOString().split('T')[0],
    sleepHours: 7.5,
    hrvScore: 70,
    steps: 6000,
    mood: 3,
    notes: "Still early in day",
  },
];

export default function HealthPage() {
  // 1. All useLocalStore calls first
  const [healthLog, setHealthLog] = useLocalStore<HealthLog[]>("healthLog", seedHealthLog);

  // 2. All useState calls next
  const [mounted, setMounted] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSleep, setNewSleep] = useState("");
  const [newHRV, setNewHRV] = useState("");
  const [newSteps, setNewSteps] = useState("");
  const [newMood, setNewMood] = useState<1 | 2 | 3 | 4 | 5 | "">();
  const [newNotes, setNewNotes] = useState("");

  // 3. All useEffect calls next
  useEffect(() => setMounted(true), []);

  // 4. Mounted guard after all hooks
  if (!mounted) return null;

  // 5. All other logic
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = healthLog.find(log => log.date === today);

  const lastEntry = healthLog[healthLog.length - 1];

  const chartData = healthLog.slice(-14).map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sleep: log.sleepHours || 0,
    hrv: log.hrvScore || 0,
    mood: log.mood || 0,
  }));

  const saveEntry = () => {
    if (newSleep && newHRV && newSteps && newMood && newDate) {
      const newEntry: HealthLog = {
        date: newDate,
        sleepHours: parseFloat(newSleep),
        hrvScore: parseInt(newHRV),
        steps: parseInt(newSteps),
        mood: newMood as 1 | 2 | 3 | 4 | 5,
        notes: newNotes || undefined,
      };

      const updated = healthLog.filter(log => log.date !== newDate);
      updated.push(newEntry);
      setHealthLog(updated);

      setNewDate(new Date().toISOString().split('T')[0]);
      setNewSleep("");
      setNewHRV("");
      setNewSteps("");
      setNewMood("");
      setNewNotes("");
    }
  };

  const deleteEntry = (date: string) => {
    setHealthLog(healthLog.filter(log => log.date !== date));
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Health & Wellbeing" />
        <div className="flex-1 overflow-auto p-6 space-y-6">
          
          {/* SECTION 1: Today's Snapshot */}
          <SectionCard title="Today's Snapshot">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Last Night's Sleep"
                value={lastEntry?.sleepHours ? `${lastEntry.sleepHours}h` : "--"}
                subtitle="hours"
              />
              <MetricCard
                label="HRV Score"
                value={lastEntry?.hrvScore || "--"}
                subtitle="Withings"
              />
              <MetricCard
                label="Steps Today"
                value={lastEntry?.steps?.toLocaleString() || "--"}
                subtitle="Fitbit"
              />
              <MetricCard
                label="Mood"
                value={lastEntry?.mood ? moodEmoji[lastEntry.mood] : "--"}
                subtitle={lastEntry?.mood ? `${lastEntry.mood}/5` : "no entry"}
              />
            </div>
          </SectionCard>

          {/* SECTION 2: Log New Entry */}
          <SectionCard title="Log New Entry">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  label="Date"
                />
                <Input
                  type="number"
                  placeholder="Sleep (hours)"
                  value={newSleep}
                  onChange={(e) => setNewSleep(e.target.value)}
                  step="0.5"
                />
                <Input
                  type="number"
                  placeholder="HRV Score"
                  value={newHRV}
                  onChange={(e) => setNewHRV(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="number"
                  placeholder="Steps"
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Mood</label>
                  <div className="flex gap-2">
                    {(Object.keys(moodEmoji) as any[]).map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setNewMood(mood as 1 | 2 | 3 | 4 | 5)}
                        className={`text-3xl p-2 rounded transition ${
                          newMood === mood
                            ? "ring-2 ring-teal-500 bg-teal-50"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {moodEmoji[mood as keyof typeof moodEmoji]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Textarea
                placeholder="Notes: How are you feeling?"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />

              <Button onClick={saveEntry} className="w-full">
                Save Entry
              </Button>
            </div>
          </SectionCard>

          {/* SECTION 3: Trends */}
          {chartData.length >= 3 ? (
            <SectionCard title="Trends (Last 14 Days)">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sleep Chart */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Sleep (hours)</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sleep" stroke="#1D9E75" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* HRV Chart */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">HRV Score</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="hrv" stroke="#378ADD" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Mood Chart */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Mood (1-5)</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="mood" fill="#7F77DD" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="Trends">
              <div className="text-center text-gray-600 py-8">
                Keep logging — your trends will appear here after a few days.
              </div>
            </SectionCard>
          )}

          {/* SECTION 4: Log History */}
          <SectionCard title="Log History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b font-semibold">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Sleep</th>
                    <th className="text-left p-2">HRV</th>
                    <th className="text-left p-2">Steps</th>
                    <th className="text-left p-2">Mood</th>
                    <th className="text-left p-2">Notes</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...healthLog].reverse().map((log) => (
                    <tr key={log.date} className="border-b hover:bg-gray-50">
                      <td className="p-2">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="p-2">{log.sleepHours ? `${log.sleepHours}h` : "—"}</td>
                      <td className="p-2">{log.hrvScore || "—"}</td>
                      <td className="p-2">{log.steps ? log.steps.toLocaleString() : "—"}</td>
                      <td className="p-2">{log.mood ? moodEmoji[log.mood] : "—"}</td>
                      <td className="p-2 text-gray-600 max-w-xs truncate">{log.notes || "—"}</td>
                      <td className="p-2">
                        <Button
                          onClick={() => deleteEntry(log.date)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

        </div>
      </div>

      {/* SECTION 5: Health Goals Sidebar */}
      <div className="w-80 bg-teal-50 dark:bg-gray-800 p-4 border-l border-teal-200 dark:border-teal-900">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="text-lg">Health Focus Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold text-teal-700">Sleep</div>
              <div className="text-sm text-gray-700">
                Consistent 8pm wind-down, bed by 9:30pm
              </div>
            </div>
            <div>
              <div className="font-semibold text-teal-700">Movement</div>
              <div className="text-sm text-gray-700">
                2x strength sessions/week + daily walking
              </div>
            </div>
            <div>
              <div className="font-semibold text-teal-700">HRV Target</div>
              <div className="text-sm text-gray-700">
                Track trend, not individual scores
              </div>
            </div>
            <div>
              <div className="font-semibold text-teal-700">Screens</div>
              <div className="text-sm text-gray-700">
                After 8pm boundary most nights
              </div>
            </div>
            <div>
              <div className="font-semibold text-teal-700">Regulation</div>
              <div className="text-sm text-gray-700">
                10-15 min daily ANS practice
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
