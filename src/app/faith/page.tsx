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

interface FaithRhythm {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "occasional";
  doneToday: boolean;
  lastCompletedDate?: string;
}

interface FamilyEvent {
  id: string;
  date: string;
  title: string;
  type: "birthday" | "anniversary" | "appointment" | "milestone" | "other";
  notes?: string;
}

interface FruitReflection {
  fruit: string;
  reflection: string;
}

interface FamilyMemory {
  id: string;
  date: string;
  title: string;
  people: string;
  description: string;
}

interface PrayerItem {
  id: string;
  person: string;
  dateAdded: string;
  note: string;
  status: "active" | "answered";
}

// Helper functions
const calculateYearsDays = (fromDate: Date) => {
  const today = new Date();
  let years = today.getFullYear() - fromDate.getFullYear();
  const monthsDiff = today.getMonth() - fromDate.getMonth();
  const daysDiff = today.getDate() - fromDate.getDate();

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    years--;
  }

  return { years };
};

const calculateAge = (birthDate: Date) => {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  return { years, months };
};

const calculateDaysSince = (fromDate: Date) => {
  const today = new Date();
  const diff = today.getTime() - fromDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const seedFaithRhythms: FaithRhythm[] = [
  { id: "1", name: "Morning light + prayer", frequency: "daily", doneToday: false },
  { id: "2", name: "Short Scripture reading", frequency: "daily", doneToday: false },
  { id: "3", name: "One intentional moment with kids", frequency: "daily", doneToday: false },
  { id: "4", name: "Evening wind-down prayer", frequency: "daily", doneToday: false },
  { id: "5", name: "Church attendance", frequency: "weekly", doneToday: false },
  { id: "6", name: "Men's fellowship / brotherhood", frequency: "weekly", doneToday: false },
  { id: "7", name: "Marriage check-in conversation", frequency: "weekly", doneToday: false },
  { id: "8", name: "One outdoor/movement activity", frequency: "weekly", doneToday: false },
  { id: "9", name: "Pastoral conversation or mentoring", frequency: "occasional", doneToday: false },
  { id: "10", name: "Journalling or reflection", frequency: "occasional", doneToday: false },
];

const seedFamilyCalendar: FamilyEvent[] = [
  { id: "1", date: "2026-04-08", title: "Kristy nursing interview — Dubbo Health", type: "milestone" },
  { id: "2", date: "2026-04-21", title: "Centrelink appt — Kristy carer application", type: "appointment" },
  { id: "3", date: "2026-05-11", title: "Elias turns 2", type: "birthday" },
  { id: "4", date: "2027-02-17", title: "Sylvie NDIS plan review", type: "appointment" },
  { id: "5", date: "2027-02-26", title: "Sylvie turns 5", type: "birthday" },
  { id: "6", date: "2027-04-06", title: "8th wedding anniversary", type: "anniversary" },
];

const seedFruits: FruitReflection[] = [
  { fruit: "Love", reflection: "" },
  { fruit: "Joy", reflection: "" },
  { fruit: "Peace", reflection: "" },
  { fruit: "Patience", reflection: "" },
  { fruit: "Kindness", reflection: "" },
  { fruit: "Goodness", reflection: "" },
  { fruit: "Faithfulness", reflection: "" },
  { fruit: "Gentleness", reflection: "" },
  { fruit: "Self-control", reflection: "" },
];

const seedFamilyMemories: FamilyMemory[] = [
  { id: "1", date: "2025-05-11", title: "Elias's first steps", people: "Elias", description: "Elias took his first steps — what a moment!" },
  { id: "2", date: "2026-02-09", title: "Sylvie's first day at therapy in Dubbo", people: "Sylvie", description: "Sylvie started therapy at her new centre in Dubbo" },
  { id: "3", date: "2026-02-01", title: "Moved into 101 Boundary Road, Dubbo", people: "Kristy, Sylvie, Elias", description: "Family relocated to Dubbo — new chapter begins" },
  { id: "4", date: "2026-04-06", title: "7th wedding anniversary", people: "Josh, Kristy", description: "7 years married — grateful for this journey together" },
];

const seedPrayerList: PrayerItem[] = [
  { id: "1", person: "Kristy", dateAdded: "2026-04-07", note: "nursing interview and career path", status: "active" },
  { id: "2", person: "Sylvie", dateAdded: "2026-04-07", note: "development and flourishing", status: "active" },
  { id: "3", person: "Elias", dateAdded: "2026-04-07", note: "healthy growth", status: "active" },
  { id: "4", person: "The Dubbo move", dateAdded: "2026-04-07", note: "community and belonging", status: "active" },
  { id: "5", person: "Lucas", dateAdded: "2026-04-07", note: "friend in Bendigo — the distance", status: "active" },
];

export default function FaithPage() {
  // 1. All useLocalStore calls first
  const [faithRhythms, setFaithRhythms] = useLocalStore<FaithRhythm[]>("faithRhythms", seedFaithRhythms);
  const [familyCalendar, setFamilyCalendar] = useLocalStore<FamilyEvent[]>("familyCalendar", seedFamilyCalendar);
  const [fruitReflections, setFruitReflections] = useLocalStore<FruitReflection[]>("faithReflection", seedFruits);
  const [familyMemories, setFamilyMemories] = useLocalStore<FamilyMemory[]>("familyMemories", seedFamilyMemories);
  const [prayerList, setPrayerList] = useLocalStore<PrayerItem[]>("prayerList", seedPrayerList);

  // 2. All useState calls next
  const [mounted, setMounted] = useState(false);
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState<FamilyEvent["type"]>("other");
  const [newMemoryDate, setNewMemoryDate] = useState("");
  const [newMemoryTitle, setNewMemoryTitle] = useState("");
  const [newMemoryPeople, setNewMemoryPeople] = useState("");
  const [newMemoryDesc, setNewMemoryDesc] = useState("");
  const [newPrayerPerson, setNewPrayerPerson] = useState("");
  const [newPrayerNote, setNewPrayerNote] = useState("");

  // 3. All useEffect calls next
  useEffect(() => setMounted(true), []);

  // 4. Mounted guard after all hooks
  if (!mounted) return null;

  // 5. All other logic
  const anniversaryDate = new Date("2019-04-06");
  const { years: anniversaryYears } = calculateYearsDays(anniversaryDate);

  const sylvieDate = new Date("2022-02-26");
  const { years: sylvieYears, months: sylvieMonths } = calculateAge(sylvieDate);

  const eliasDate = new Date("2024-05-11");
  const { years: eliasYears, months: eliasMonths } = calculateAge(eliasDate);

  const relocationDate = new Date("2026-02-01");
  const daysSinceRelocation = calculateDaysSince(relocationDate);

  const toggleRhythm = (id: string) => {
    const updated = faithRhythms.map(r => {
      if (r.id === id) {
        return { ...r, doneToday: !r.doneToday, lastCompletedDate: !r.doneToday ? new Date().toISOString().split("T")[0] : r.lastCompletedDate };
      }
      return r;
    });
    setFaithRhythms(updated);
  };

  const addEvent = () => {
    if (newEventDate && newEventTitle) {
      const newEvent: FamilyEvent = {
        id: Math.random().toString(36).substr(2, 9),
        date: newEventDate,
        title: newEventTitle,
        type: newEventType,
      };
      setFamilyCalendar([...familyCalendar, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewEventDate("");
      setNewEventTitle("");
      setNewEventType("other");
    }
  };

  const deleteEvent = (id: string) => {
    setFamilyCalendar(familyCalendar.filter(e => e.id !== id));
  };

  const updateFruitReflection = (fruit: string, reflection: string) => {
    const updated = fruitReflections.map(f => f.fruit === fruit ? { ...f, reflection } : f);
    setFruitReflections(updated);
  };

  const addMemory = () => {
    if (newMemoryDate && newMemoryTitle) {
      const newMemory: FamilyMemory = {
        id: Math.random().toString(36).substr(2, 9),
        date: newMemoryDate,
        title: newMemoryTitle,
        people: newMemoryPeople,
        description: newMemoryDesc,
      };
      setFamilyMemories([...familyMemories, newMemory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setNewMemoryDate("");
      setNewMemoryTitle("");
      setNewMemoryPeople("");
      setNewMemoryDesc("");
    }
  };

  const deleteMemory = (id: string) => {
    setFamilyMemories(familyMemories.filter(m => m.id !== id));
  };

  const addPrayerItem = () => {
    if (newPrayerPerson) {
      const newItem: PrayerItem = {
        id: Math.random().toString(36).substr(2, 9),
        person: newPrayerPerson,
        dateAdded: new Date().toISOString().split("T")[0],
        note: newPrayerNote,
        status: "active",
      };
      setPrayerList([...prayerList, newItem]);
      setNewPrayerPerson("");
      setNewPrayerNote("");
    }
  };

  const togglePrayerStatus = (id: string) => {
    const updated = prayerList.map(p => p.id === id ? { ...p, status: p.status === "active" ? "answered" : "active" } : p);
    setPrayerList(updated);
  };

  const deletePrayerItem = (id: string) => {
    setPrayerList(prayerList.filter(p => p.id !== id));
  };

  const isWithin14Days = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diff = eventDate.getTime() - today.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 14;
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Faith & Family" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* SECTION 1: Family Snapshot */}
        <SectionCard title="Family">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              label="Marriage" 
              value={`${anniversaryYears} yrs`} 
              subtitle="6 Apr 2019"
            />
            <MetricCard 
              label="Sylvie" 
              value={`${sylvieYears}y ${sylvieMonths}m`} 
              subtitle="26 Feb 2022"
            />
            <MetricCard 
              label="Elias" 
              value={`${eliasYears}y ${eliasMonths}m`} 
              subtitle="11 May 2024"
            />
            <MetricCard 
              label="In Dubbo" 
              value={`${daysSinceRelocation} days`} 
              subtitle="since 1 Feb 2026"
            />
          </div>
        </SectionCard>

        {/* SECTION 2: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: Faith Rhythms */}
          <SectionCard title="Daily & Weekly Rhythms">
            <div className="space-y-3">
              {/* Daily */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Daily</h4>
                <div className="space-y-1">
                  {faithRhythms.filter(r => r.frequency === "daily").map(rhythm => (
                    <button
                      key={rhythm.id}
                      onClick={() => toggleRhythm(rhythm.id)}
                      className={`w-full text-left p-2 rounded transition ${
                        rhythm.doneToday
                          ? "bg-rose-100 text-rose-900 line-through"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span className="text-sm">{rhythm.doneToday ? "✓ " : ""}{rhythm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly */}
              <div className="pt-2 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Weekly</h4>
                <div className="space-y-1">
                  {faithRhythms.filter(r => r.frequency === "weekly").map(rhythm => (
                    <button
                      key={rhythm.id}
                      onClick={() => toggleRhythm(rhythm.id)}
                      className={`w-full text-left p-2 rounded transition ${
                        rhythm.doneToday
                          ? "bg-rose-100 text-rose-900 line-through"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span className="text-sm">{rhythm.doneToday ? "✓ " : ""}{rhythm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasional */}
              <div className="pt-2 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Occasional</h4>
                <div className="space-y-1">
                  {faithRhythms.filter(r => r.frequency === "occasional").map(rhythm => (
                    <button
                      key={rhythm.id}
                      onClick={() => toggleRhythm(rhythm.id)}
                      className={`w-full text-left p-2 rounded transition ${
                        rhythm.doneToday
                          ? "bg-rose-100 text-rose-900 line-through"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span className="text-sm">{rhythm.doneToday ? "✓ " : ""}{rhythm.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* RIGHT: Family Calendar */}
          <SectionCard title="Family Calendar">
            <div className="space-y-2 max-h-96 overflow-y-auto mb-3">
              {familyCalendar.map(event => {
                const eventDate = new Date(event.date);
                const isUpcoming = isWithin14Days(event.date);
                return (
                  <div
                    key={event.id}
                    className={`p-2 rounded text-sm flex justify-between items-start ${
                      isUpcoming
                        ? "bg-amber-100 border border-amber-300"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-gray-600">{eventDate.toLocaleDateString()}</div>
                      <div className="text-sm font-medium">{event.title}</div>
                      <Badge variant="outline" className="text-xs mt-1">{event.type}</Badge>
                    </div>
                    <Button
                      onClick={() => deleteEvent(event.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 h-6 px-2 ml-2"
                    >
                      ×
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Add Event */}
            <div className="border-t pt-3 space-y-2">
              <Input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="text-sm"
              />
              <select
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as FamilyEvent["type"])}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="appointment">Appointment</option>
                <option value="milestone">Milestone</option>
                <option value="other">Other</option>
              </select>
              <Button onClick={addEvent} className="w-full bg-rose-600 hover:bg-rose-700">
                Add Date
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* SECTION 3: Centre Line - Mission & Fruits */}
        <Card className="border-2 border-rose-300 bg-rose-50">
          <CardHeader>
            <CardTitle className="text-center text-rose-900">Personal Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-white rounded-lg border border-rose-200">
              <p className="text-lg font-semibold text-rose-800 italic">
                "Abide in Christ → love with gentle strength → <br />
                lead at home first → build what blesses."
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-rose-900 mb-4">Fruits of the Spirit — Weekly Reflection</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fruitReflections.map(fruit => (
                  <div key={fruit.fruit} className="p-3 border rounded-lg bg-white">
                    <label className="text-sm font-semibold text-rose-800">{fruit.fruit}</label>
                    <Textarea
                      placeholder="How did I show this this week?"
                      value={fruit.reflection}
                      onChange={(e) => updateFruitReflection(fruit.fruit, e.target.value)}
                      className="mt-1 text-xs"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4 & 5: Memory Log & Prayer List (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT/MAIN: Family Memory Log (2/3 width on large) */}
          <div className="lg:col-span-2">
            <SectionCard title="Family Memory Log">
              <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                {familyMemories.map(memory => (
                  <div key={memory.id} className="p-3 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 font-semibold">{new Date(memory.date).toLocaleDateString()}</div>
                        <div className="font-semibold text-sm">{memory.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          <span className="italic">{memory.people}</span>
                        </div>
                        {memory.description && (
                          <div className="text-sm text-gray-700 mt-1">{memory.description}</div>
                        )}
                      </div>
                      <Button
                        onClick={() => deleteMemory(memory.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 h-6 px-2 ml-2 flex-shrink-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Memory */}
              <div className="border-t pt-3 space-y-2">
                <h4 className="text-sm font-semibold">Add New Memory</h4>
                <Input
                  type="date"
                  value={newMemoryDate}
                  onChange={(e) => setNewMemoryDate(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Title"
                  value={newMemoryTitle}
                  onChange={(e) => setNewMemoryTitle(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Who was involved?"
                  value={newMemoryPeople}
                  onChange={(e) => setNewMemoryPeople(e.target.value)}
                  className="text-sm"
                />
                <Textarea
                  placeholder="Description"
                  value={newMemoryDesc}
                  onChange={(e) => setNewMemoryDesc(e.target.value)}
                  className="text-sm"
                  rows={2}
                />
                <Button onClick={addMemory} className="w-full bg-rose-600 hover:bg-rose-700">
                  Add Memory
                </Button>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT: Prayer List (1/3 width on large) */}
          <SectionCard title="Prayer List">
            <div className="space-y-2 max-h-96 overflow-y-auto mb-3">
              {prayerList.map(item => (
                <div
                  key={item.id}
                  className={`p-2 rounded text-sm border ${
                    item.status === "answered"
                      ? "bg-green-50 border-green-300 line-through text-green-700"
                      : "bg-white border-rose-200 hover:bg-rose-50"
                  }`}
                >
                  <button
                    onClick={() => togglePrayerStatus(item.id)}
                    className="w-full text-left font-semibold hover:opacity-75 transition cursor-pointer"
                  >
                    {item.person}
                  </button>
                  {item.note && (
                    <div className="text-xs text-gray-600 mt-1">{item.note}</div>
                  )}
                  <Button
                    onClick={() => deletePrayerItem(item.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 h-6 px-2 text-xs mt-1 w-full"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Prayer Item */}
            <div className="border-t pt-2 space-y-2">
              <Input
                placeholder="Person or topic"
                value={newPrayerPerson}
                onChange={(e) => setNewPrayerPerson(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Brief note"
                value={newPrayerNote}
                onChange={(e) => setNewPrayerNote(e.target.value)}
                className="text-sm"
              />
              <Button onClick={addPrayerItem} className="w-full bg-rose-600 hover:bg-rose-700 text-sm">
                Add Prayer
              </Button>
            </div>
          </SectionCard>
        </div>

      </div>
    </div>
  );
}