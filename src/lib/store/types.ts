export interface FinanceSummary {
  joshNetMonthly: number;
  rentalIncome: number;
  rentPaid: number;
  mortgagePayment: number;
  reDrawAvailable: number;
  groceriesMonthly: number;
  fuelMonthly: number;
}

export interface NDISCategory {
  name: string;
  allocated: number;
  spent: number;
  provider: string;
}

export interface NDISPlan {
  totalBudget: number;
  planYear: string;
  categories: NDISCategory[];
}

export interface Appointment {
  id: string;
  person: 'Sylvie' | 'Kristy' | 'Josh' | 'Family';
  provider: string;
  type: string;
  date: string; // ISO 8601
  location: string;
  notes?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  module: string;
  status: 'urgent' | 'soon' | 'ongoing' | 'done';
  dueDate?: string;
  notes?: string;
}

export interface HealthLog {
  date: string;
  sleepHours?: number;
  hrvScore?: number;
  steps?: number;
  mood?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}