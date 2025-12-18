
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  householdId?: string;
  streakCount?: number;
  lastActiveDate?: string;
}

export type SourceType = 'receipt_image' | 'email' | 'sms' | 'manual';

export interface Transaction {
  id: string;
  userId: string;
  householdId?: string;
  datetime: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  sourceType: SourceType;
  rawText: string;
  isBusiness?: boolean;
}

export interface Household {
  id: string;
  name: string;
  members: string[]; // User IDs
}

export interface BillPrediction {
  merchant: string;
  estimatedAmount: number;
  frequency: 'monthly' | 'weekly' | 'annual';
  nextExpectedDate: string;
  confidence: number;
  isSubscription: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface CategoryAggregate {
  category: string;
  amount: number;
  percentage: number;
}

export interface CategoryBudget {
  category: string;
  amount: number;
}

export interface Budget {
  id: string;
  userId: string;
  month: number;
  year: number;
  overallBudget: number;
  categoryBudgets: CategoryBudget[];
}

export interface Leak {
  title: string;
  description: string;
  amount: number;
}

export interface Suggestion {
  action: string;
  rationale: string;
  estimatedMonthlySaving: number;
}

export interface AnalysisSummary {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  totalSpend: number;
  totalTransactions: number;
  topCategories: CategoryAggregate[];
  leaks: Leak[];
  suggestions: Suggestion[];
  createdAt: string;
}
