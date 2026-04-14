import Dexie, { Table } from "dexie";

export interface SleepLog {
  id: string;
  date: string;
  hours: number;
  notes?: string;
  createdAt: string;
}

export interface MealLog {
  id: string;
  date: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  notes?: string;
  createdAt: string;
}

export interface MovementLog {
  id: string;
  date: string;
  minutes: number;
  kind?: string;
  createdAt: string;
}

export interface MetricLog {
  id: string;
  date: string;
  name: string;
  value: number;
  unit?: string;
  createdAt: string;
}

export class JoshHubDB extends Dexie {
  sleepLogs!: Table<SleepLog, string>;
  mealLogs!: Table<MealLog, string>;
  movementLogs!: Table<MovementLog, string>;
  metricLogs!: Table<MetricLog, string>;
  constructor() {
    super("JoshHubDB");
    this.version(1).stores({
      sleepLogs: "id, date",
      mealLogs: "id, date, type",
      movementLogs: "id, date",
      metricLogs: "id, date, name",
    });
  }
}

export const db = new JoshHubDB();
