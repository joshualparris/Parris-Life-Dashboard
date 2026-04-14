"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocalStore } from "@/lib/store/useLocalStore";

interface WorkTask {
  id: string;
  title: string;
  status: "urgent" | "in-progress" | "done" | "waiting";
  notes?: string;
}

interface PTSJob {
  id: string;
  date: string;
  client: string;
  description: string;
  hours: number;
  status: "done" | "pending" | "invoiced";
}

interface VideoItem {
  id: string;
  title: string;
  status: "not-started" | "scripted" | "recorded" | "edited" | "published";
  notes?: string;
}

interface PayEntry {
  period: string;
  gross: number;
  net: number;
  notes?: string;
}

interface LeaveBalance {
  annualLeave: number;
  sickCarerLeave: number;
  longServiceLeave: number;
  note: string;
}

const seedWorkTasks: WorkTask[] = [
  { id: "1", title: "Micro-training video library", status: "in-progress", notes: "Building short classroom tech workflow videos for staff" },
  { id: "2", title: "ViewBoard annotation guide", status: "in-progress", notes: "Script and record annotate-over-anything video" },
  { id: "3", title: "AirSync vs VCast testing", status: "waiting", notes: "Need to test in real classrooms before scripting" },
  { id: "4", title: "HDMI wired connection guide", status: "urgent", notes: "Priority: reliable projecting first" },
  { id: "5", title: "LRC app development", status: "in-progress", notes: "Next.js/Supabase library resource centre app" },
];

const seedVideoProject: VideoItem[] = [
  { id: "1", title: "Project laptop reliably (HDMI wired)", status: "not-started" },
  { id: "2", title: "Windows + P duplicate/extend", status: "not-started" },
  { id: "3", title: "ViewBoard whiteboard basics", status: "not-started" },
  { id: "4", title: "Annotate over anything", status: "not-started" },
  { id: "5", title: "AirSync the right way", status: "not-started" },
  { id: "6", title: "HDMI vs AirSync vs VCast comparison", status: "not-started" },
  { id: "7", title: "Timer and spotlight tools", status: "not-started" },
  { id: "8", title: "Save what you wrote", status: "not-started" },
  { id: "9", title: "Fix blurry/laggy casting", status: "not-started" },
  { id: "10", title: "OneDrive / printing / Outlook", status: "not-started" },
];

const seedPayHistory: PayEntry[] = [
  { period: "17 Jan–30 Jan 2026", gross: 3086.05, net: 2376.05 },
  { period: "31 Jan–13 Feb 2026", gross: 2831.76, net: 2239.76 },
  { period: "14 Feb–27 Feb 2026", gross: 2831.76, net: 2239.76 },
  { period: "28 Feb–13 Mar 2026", gross: 2831.76, net: 2239.76 },
  { period: "14 Mar–27 Mar 2026", gross: 2831.76, net: 2239.76 },
];

const seedLeaveBalance: LeaveBalance = {
  annualLeave: 18.5,
  sickCarerLeave: -4.46,
  longServiceLeave: 3.2,
  note: "Sick/carer leave in negative — accruing back over time",
};

export default function WorkPage() {
  // 1. All useLocalStore calls first
  const [workTasks, setWorkTasks] = useLocalStore<WorkTask[]>("workTasks", seedWorkTasks);
  const [ptsTasks, setPtsTasks] = useLocalStore<PTSJob[]>("ptsTasks", []);
  const [workLeave, setWorkLeave] = useLocalStore<LeaveBalance>("workLeave", seedLeaveBalance);
  const [videoProject, setVideoProject] = useLocalStore<VideoItem[]>("videoProject", seedVideoProject);
  const [payHistory, setPayHistory] = useLocalStore<PayEntry[]>("payHistory", seedPayHistory);

  // 2. All useState calls next
  const [mounted, setMounted] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newJobDate, setNewJobDate] = useState("");
  const [newJobClient, setNewJobClient] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobHours, setNewJobHours] = useState("");
  const [newPayPeriod, setNewPayPeriod] = useState("");
  const [newPayGross, setNewPayGross] = useState("");
  const [newPayNet, setNewPayNet] = useState("");
  const [ptsMonthlyHours, setPtsMonthlyHours] = useState("");

  // 3. All useEffect calls next
  useEffect(() => setMounted(true), []);

  // 4. Mounted guard after all hooks
  if (!mounted) return null;

  // 5. All other logic
  const lastPayDate = new Date("2026-03-27");
  const nextPayDate = new Date(lastPayDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  const totalPtsHours = ptsTasks.reduce((sum, job) => sum + job.hours, 0);

  const videoStatusCycle: VideoItem["status"][] = ["not-started", "scripted", "recorded", "edited", "published"];

  const addTask = () => {
    if (newTaskTitle) {
      const newTask: WorkTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTaskTitle,
        status: "waiting",
        notes: newTaskNotes || undefined,
      };
      setWorkTasks([...workTasks, newTask]);
      setNewTaskTitle("");
      setNewTaskNotes("");
    }
  };

  const deleteTask = (id: string) => {
    setWorkTasks(workTasks.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    const updated = workTasks.map(t => {
      if (t.id === id) {
        const statuses: (WorkTask["status"])[] = ["urgent", "in-progress", "done", "waiting"];
        const currentIndex = statuses.indexOf(t.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...t, status: statuses[nextIndex] };
      }
      return t;
    });
    setWorkTasks(updated);
  };

  const addPtsJob = () => {
    if (newJobDate && newJobClient && newJobDesc && newJobHours) {
      const newJob: PTSJob = {
        id: Math.random().toString(36).substr(2, 9),
        date: newJobDate,
        client: newJobClient,
        description: newJobDesc,
        hours: parseFloat(newJobHours),
        status: "pending",
      };
      setPtsTasks([...ptsTasks, newJob]);
      setNewJobDate("");
      setNewJobClient("");
      setNewJobDesc("");
      setNewJobHours("");
    }
  };

  const togglePtsStatus = (id: string) => {
    const updated = ptsTasks.map(job => {
      if (job.id === id) {
        const statuses: PTSJob["status"][] = ["pending", "done", "invoiced"];
        const currentIndex = statuses.indexOf(job.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...job, status: statuses[nextIndex] };
      }
      return job;
    });
    setPtsTasks(updated);
  };

  const deletePtsJob = (id: string) => {
    setPtsTasks(ptsTasks.filter(j => j.id !== id));
  };

  const cycleVideoStatus = (id: string) => {
    const updated = videoProject.map(item => {
      if (item.id === id) {
        const currentIndex = videoStatusCycle.indexOf(item.status);
        const nextIndex = (currentIndex + 1) % videoStatusCycle.length;
        return { ...item, status: videoStatusCycle[nextIndex] };
      }
      return item;
    });
    setVideoProject(updated);
  };

  const addPayEntry = () => {
    if (newPayPeriod && newPayGross && newPayNet) {
      const newEntry: PayEntry = {
        period: newPayPeriod,
        gross: parseFloat(newPayGross),
        net: parseFloat(newPayNet),
      };
      setPayHistory([...payHistory, newEntry]);
      setNewPayPeriod("");
      setNewPayGross("");
      setNewPayNet("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Work — DCS & Parris Tech" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* SECTION 1: Pay Summary */}
        <SectionCard title="Pay Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Annual Salary" value="$73,626" />
            <MetricCard label="Fortnightly Net" value="$2,239.76" />
            <MetricCard label="Monthly Net" value="$4,853" />
            <MetricCard label="Next Pay Date" value={nextPayDate.toLocaleDateString()} subtitle="fortnightly" />
          </div>
        </SectionCard>

        {/* SECTION 2: DCS Tasks & Parris Tech */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: DCS Work Tasks */}
          <SectionCard title="DCS Work Tasks">
            <div className="space-y-2">
              {workTasks.map(task => (
                <div key={task.id} className="flex items-start justify-between p-3 border rounded hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    {task.notes && <div className="text-sm text-gray-600 mt-1">{task.notes}</div>}
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <button onClick={() => toggleTaskStatus(task.id)}>
                      <StatusBadge status={task.status} />
                    </button>
                    <Button onClick={() => deleteTask(task.id)} size="sm" variant="outline" className="text-red-600">
                      ×
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 space-y-2">
                <Input
                  placeholder="New task"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Notes (optional)"
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                />
                <Button onClick={addTask} className="w-full">
                  Add Task
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* RIGHT: Parris Tech Services */}
          <SectionCard title="Parris Tech Services">
            <div className="space-y-4">
              {/* Jobs Log */}
              <div>
                <h4 className="font-semibold mb-2">Client Jobs</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {ptsTasks.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-2 border rounded text-sm">
                      <div>
                        <div className="font-medium">{job.client}</div>
                        <div className="text-gray-600">{job.description}</div>
                        <div className="text-xs text-gray-500">{new Date(job.date).toLocaleDateString()} • {job.hours}h</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge
                          className="cursor-pointer"
                          onClick={() => togglePtsStatus(job.id)}
                          variant={job.status === "done" ? "default" : "outline"}
                        >
                          {job.status}
                        </Badge>
                        <Button onClick={() => deletePtsJob(job.id)} size="sm" variant="outline" className="text-red-600 text-xs">
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mt-3 pt-3 border-t">
                  <Input type="date" value={newJobDate} onChange={(e) => setNewJobDate(e.target.value)} />
                  <Input placeholder="Client name" value={newJobClient} onChange={(e) => setNewJobClient(e.target.value)} />
                  <Input placeholder="Description" value={newJobDesc} onChange={(e) => setNewJobDesc(e.target.value)} />
                  <Input type="number" placeholder="Hours" value={newJobHours} onChange={(e) => setNewJobHours(e.target.value)} />
                  <Button onClick={addPtsJob} className="w-full">
                    Add Job
                  </Button>
                </div>
              </div>

              {/* Earnings Tracker */}
              <div className="border-t pt-3">
                <h4 className="font-semibold">Earnings Tracker</h4>
                <div className="text-lg font-bold text-blue-600 mt-2">{totalPtsHours}h this month</div>
                <Input
                  placeholder="Add notes"
                  value={ptsMonthlyHours}
                  onChange={(e) => setPtsMonthlyHours(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* SECTION 3: Leave Balances */}
        <SectionCard title="Leave Balances">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded">
              <label className="text-sm font-medium">Annual Leave (days)</label>
              <Input
                type="number"
                value={workLeave.annualLeave}
                onChange={(e) => setWorkLeave({ ...workLeave, annualLeave: parseFloat(e.target.value) })}
                step="0.5"
                className="mt-1"
              />
            </div>
            <div className="p-3 border rounded">
              <label className="text-sm font-medium">Sick/Carer Leave (hours)</label>
              <div className={`text-2xl font-bold mt-2 ${workLeave.sickCarerLeave < 0 ? "text-red-600" : ""}`}>
                {workLeave.sickCarerLeave}
              </div>
              <div className="text-xs text-gray-600 mt-1">{workLeave.note}</div>
            </div>
            <div className="p-3 border rounded">
              <label className="text-sm font-medium">Long Service Leave (days)</label>
              <Input
                type="number"
                value={workLeave.longServiceLeave}
                onChange={(e) => setWorkLeave({ ...workLeave, longServiceLeave: parseFloat(e.target.value) })}
                step="0.5"
                className="mt-1"
              />
            </div>
          </div>
        </SectionCard>

        {/* SECTION 4: Video Project Tracker */}
        <SectionCard title="Micro-training Video Project (10 Priority Topics)">
          <div className="space-y-2">
            {videoProject.map((item, idx) => {
              const statusColor: Record<VideoItem["status"], string> = {
                "not-started": "bg-gray-100 text-gray-700",
                "scripted": "bg-blue-100 text-blue-700",
                "recorded": "bg-purple-100 text-purple-700",
                "edited": "bg-yellow-100 text-yellow-700",
                "published": "bg-green-100 text-green-700",
              };
              return (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold">{idx + 1}.</span> {item.title}
                    </div>
                    {item.notes && <div className="text-xs text-gray-600 ml-4">{item.notes}</div>}
                  </div>
                  <button
                    onClick={() => cycleVideoStatus(item.id)}
                    className={`px-2 py-1 rounded text-sm font-medium cursor-pointer ${statusColor[item.status]}`}
                  >
                    {item.status}
                  </button>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* SECTION 5: Pay History */}
        <SectionCard title="Pay History">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="text-left p-2">Pay Period</th>
                  <th className="text-right p-2">Gross</th>
                  <th className="text-right p-2">Net</th>
                  <th className="text-left p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {payHistory.map((entry, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{entry.period}</td>
                    <td className="text-right p-2">${entry.gross.toFixed(2)}</td>
                    <td className="text-right p-2 font-semibold">${entry.net.toFixed(2)}</td>
                    <td className="p-2">{entry.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Pay Entry */}
          <div className="border-t pt-4 mt-4 space-y-2">
            <h4 className="font-semibold">Add New Pay Entry</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                placeholder="Pay period"
                value={newPayPeriod}
                onChange={(e) => setNewPayPeriod(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Gross"
                value={newPayGross}
                onChange={(e) => setNewPayGross(e.target.value)}
                step="0.01"
              />
              <Input
                type="number"
                placeholder="Net"
                value={newPayNet}
                onChange={(e) => setNewPayNet(e.target.value)}
                step="0.01"
              />
              <Button onClick={addPayEntry}>
                Add
              </Button>
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}