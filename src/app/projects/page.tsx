"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocalStore } from "@/lib/store/useLocalStore";

interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  status: "active" | "paused" | "complete";
  progress: number;
  category: "app" | "game";
  url?: string;
  notes?: string;
}

interface Idea {
  id: string;
  title: string;
  description: string;
}

const seedProjects: Project[] = [
  // APPS & TOOLS
  {
    id: "1",
    name: "JoshHub / Parris Life Dashboard",
    description: "This app — whole-life personal dashboard",
    stack: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    status: "active",
    progress: 65,
    category: "app",
    url: "https://josh-hub-two.vercel.app/dashboard",
  },
  {
    id: "2",
    name: "OP-PARENT",
    description: "Tactical parenting dashboard for Sylvie and Elias",
    stack: ["React", "TypeScript", "Tailwind", "shadcn/ui"],
    status: "active",
    progress: 35,
    category: "app",
    notes: "Dark-themed bento-grid, orange accent, parenting event logging",
  },
  {
    id: "3",
    name: "DCS LRC App",
    description: "Library Resource Centre app for Dubbo Christian School",
    stack: ["Next.js", "TypeScript", "Supabase", "shadcn/ui"],
    status: "active",
    progress: 20,
    category: "app",
  },
  {
    id: "4",
    name: "LifeHub Dashboard",
    description: "Personal life OS — files, inbox, wellbeing, automations",
    stack: ["HTML", "CSS", "JavaScript", "Python"],
    status: "active",
    progress: 75,
    category: "app",
    url: "https://lifehubdashboard.vercel.app",
    notes: "Has HRV/Welltory upload, 5e tools, text games, triage boards",
  },
  {
    id: "5",
    name: "DCS Companion",
    description: "Staff companion app for Dubbo Christian School",
    stack: ["GitHub Pages"],
    status: "active",
    progress: 60,
    category: "app",
    url: "https://joshuaparris-max.github.io/DCSCompanion",
  },
  {
    id: "6",
    name: "DCS Prep App",
    description: "Lesson preparation tool for DCS teachers",
    stack: ["Vercel"],
    status: "active",
    progress: 50,
    category: "app",
    url: "https://dcs-prep.vercel.app/",
  },
  {
    id: "7",
    name: "Campaign Copilot",
    description: "D&D campaign management tool",
    stack: ["GitHub Pages"],
    status: "active",
    progress: 55,
    category: "app",
    url: "https://joshuaparrisdadlan-stack.github.io/campaign-copilot/",
  },
  {
    id: "8",
    name: "Parris Tech App (Mac)",
    description: "Parris Tech Services client-facing app — Mac",
    stack: ["Vercel"],
    status: "active",
    progress: 40,
    category: "app",
    url: "https://parris-tech-app.vercel.app/",
  },
  {
    id: "9",
    name: "Parris Tech App (Windows)",
    description: "Parris Tech Services client-facing app — Windows",
    stack: ["Vercel"],
    status: "active",
    progress: 40,
    category: "app",
    url: "https://parris-tech-services-app.vercel.app/",
  },
  {
    id: "10",
    name: "Parris Budget App",
    description: "Standalone budget tracking app",
    stack: ["Vercel"],
    status: "paused",
    progress: 50,
    category: "app",
    url: "https://parris-budget-app.vercel.app/",
    notes: "Superseded by JoshHub Finances module",
  },
  {
    id: "11",
    name: "Parris Dubbo Mover App",
    description: "Relocation planning app for Dubbo move",
    stack: ["Vercel"],
    status: "paused",
    progress: 70,
    category: "app",
    url: "https://parris-dubbo-mover-app-main-client.vercel.app/",
    notes: "API/backend server not working",
  },
  {
    id: "12",
    name: "ClearCore",
    description: "Productivity/clarity app",
    stack: ["Vercel"],
    status: "paused",
    progress: 30,
    category: "app",
    url: "https://clearcore.vercel.app/",
  },
  {
    id: "13",
    name: "Hug Coach",
    description: "Emotional coaching app",
    stack: ["Vercel"],
    status: "paused",
    progress: 45,
    category: "app",
    url: "https://hug-coach.vercel.app/",
  },
  {
    id: "14",
    name: "Parris Piano",
    description: "Browser piano app",
    stack: ["Vercel"],
    status: "complete",
    progress: 100,
    category: "app",
    url: "https://parris-piano.vercel.app/",
  },
  // GAMES
  {
    id: "15",
    name: "Whispering Wilds",
    description: "Fantasy exploration game — 3 versions",
    stack: ["HTML/JS", "GitHub Pages", "itch.io"],
    status: "complete",
    progress: 90,
    category: "game",
  },
  {
    id: "16",
    name: "Mystery Depths",
    description: "Mystery exploration game",
    stack: ["HTML/JS", "itch.io"],
    status: "complete",
    progress: 100,
    category: "game",
    url: "https://joshualparris.itch.io/mysterydepths",
  },
  {
    id: "17",
    name: "Simple RPG / Let's Play DnD",
    description: "5e-mechanic RPG browser game",
    stack: ["HTML/JS"],
    status: "complete",
    progress: 100,
    category: "game",
  },
  {
    id: "18",
    name: "Infinite Office / OrgScape",
    description: "Productivity game / office sim",
    stack: ["HTML/JS", "itch.io"],
    status: "complete",
    progress: 100,
    category: "game",
  },
  {
    id: "19",
    name: "Null",
    description: "Minimalist HTML game",
    stack: ["HTML/JS"],
    status: "complete",
    progress: 100,
    category: "game",
  },
  {
    id: "20",
    name: "Wastes Courier Roguelike",
    description: "Roguelike courier game",
    stack: ["GitHub"],
    status: "paused",
    progress: 40,
    category: "game",
  },
  {
    id: "21",
    name: "BucklandBlocks",
    description: "Block-based game (two versions)",
    stack: ["GitHub"],
    status: "paused",
    progress: 30,
    category: "game",
  },
  {
    id: "22",
    name: "Energy Quest",
    description: "Energy/resource management game",
    stack: ["GitHub"],
    status: "paused",
    progress: 25,
    category: "game",
  },
  {
    id: "23",
    name: "Forbidden Quests / StarHaven / Midnight Line",
    description: "Game jam / experimental projects",
    stack: ["GitHub Pages"],
    status: "paused",
    progress: 20,
    category: "game",
  },
];

const seedIdeas: Idea[] = [
  { id: "1", title: "Daily health insight system", description: "Make.com + Fitbit + Withings" },
  { id: "2", title: "Meal optimisation tracker", description: "NRV/FODMAP scoring" },
  { id: "3", title: "Family memory book app", description: "Sylvie and Elias milestones" },
  { id: "4", title: "JoshNFC Audio", description: "NFC-triggered audio (repo exists)" },
  { id: "5", title: "JoshTap App", description: "(repo exists on both accounts)" },
];

type FilterType = "all" | "active" | "paused" | "complete" | "games" | "tools";

export default function ProjectsPage() {
  // 1. All useLocalStore calls first
  const [projects, setProjects] = useLocalStore<Project[]>("projects", seedProjects);
  const [ideas, setIdeas] = useLocalStore<Idea[]>("projectIdeas", seedIdeas);

  // 2. All useState calls next
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);

  // 3. All useEffect calls next
  useEffect(() => setMounted(true), []);

  // 4. Mounted guard after all hooks
  if (!mounted) return null;

  // 5. All other logic
  const filteredProjects = projects.filter(p => {
    if (filter === "all") return true;
    if (filter === "active") return p.status === "active";
    if (filter === "paused") return p.status === "paused";
    if (filter === "complete") return p.status === "complete";
    if (filter === "games") return p.category === "game";
    if (filter === "tools") return p.category === "app";
    return true;
  });

  const totalProjects = projects.length;
  const activeCount = projects.filter(p => p.status === "active").length;
  const completeCount = projects.filter(p => p.status === "complete").length;
  const pausedCount = projects.filter(p => p.status === "paused").length;

  const getStatusColor = (status: Project["status"]) => {
    if (status === "active") return "bg-green-100 text-green-800";
    if (status === "complete") return "bg-blue-100 text-blue-800";
    if (status === "paused") return "bg-gray-200 text-gray-800";
    return "";
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Projects & Building" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* SECTION 3: Stats Summary */}
        <SectionCard title="Project Stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Total Projects" value={totalProjects.toString()} />
            <MetricCard label="Active" value={activeCount.toString()} />
            <MetricCard label="Complete" value={completeCount.toString()} />
            <MetricCard label="Paused" value={pausedCount.toString()} />
          </div>
        </SectionCard>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2">
          {(["all", "active", "paused", "complete", "tools", "games"] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded font-medium transition ${
                filter === f
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* SECTION 1: Active Builds Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">Projects ({filteredProjects.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProjects.map(project => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {/* Stack tags */}
                  <div className="flex flex-wrap gap-1">
                    {project.stack.map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes (toggleable) */}
                  {project.notes && (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedNotes(
                            expandedNotes === project.id ? null : project.id
                          )
                        }
                        className="text-xs text-green-600 hover:underline"
                      >
                        {expandedNotes === project.id ? "Hide notes" : "View notes"}
                      </button>
                      {expandedNotes === project.id && (
                        <p className="text-xs text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                          {project.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* URL link */}
                  {project.url && (
                    <div className="pt-2 border-t">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline font-medium"
                      >
                        Open →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SECTION 2: Ideas Backlog */}
        <SectionCard title="Ideas Backlog">
          <div className="space-y-2">
            {ideas.map(idea => (
              <div key={idea.id} className="p-3 border rounded hover:bg-gray-50">
                <div className="font-medium">{idea.title}</div>
                <div className="text-sm text-gray-600">{idea.description}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* SECTION 4: Quick Links */}
        <SectionCard title="Quick Links">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <a
              href="https://lifehubdashboard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded hover:bg-green-50 transition"
            >
              <div className="font-semibold text-green-600">LifeHub Dashboard</div>
              <div className="text-xs text-gray-600">lifehubdashboard.vercel.app</div>
            </a>
            <a
              href="https://josh-hub-two.vercel.app/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded hover:bg-green-50 transition"
            >
              <div className="font-semibold text-green-600">JoshHub (Vercel)</div>
              <div className="text-xs text-gray-600">josh-hub-two.vercel.app</div>
            </a>
            <a
              href="https://joshualparris.itch.io"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded hover:bg-green-50 transition"
            >
              <div className="font-semibold text-green-600">itch.io Profile</div>
              <div className="text-xs text-gray-600">joshualparris.itch.io</div>
            </a>
            <a
              href="https://github.com/joshualparris"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded hover:bg-green-50 transition"
            >
              <div className="font-semibold text-green-600">GitHub (Main)</div>
              <div className="text-xs text-gray-600">github.com/joshualparris</div>
            </a>
            <a
              href="https://github.com/joshuaparris-max"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded hover:bg-green-50 transition"
            >
              <div className="font-semibold text-green-600">GitHub (Max)</div>
              <div className="text-xs text-gray-600">github.com/joshuaparris-max</div>
            </a>
            <a
              href="https://github.com/joshuaparrisdadlan-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border rounded hover:bg-green-50 transition"
            >
              <div className="font-semibold text-green-600">GitHub (Dadlan)</div>
              <div className="text-xs text-gray-600">github.com/joshuaparrisdadlan-stack</div>
            </a>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
