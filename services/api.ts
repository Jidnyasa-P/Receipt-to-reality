
import { User, Transaction, AnalysisSummary, CategoryAggregate, Budget, Household, BillPrediction } from "../types";
import { processRawData, generateInsights, predictBills } from "./geminiService";

const DB_KEYS = {
  USERS: 'r2r_users',
  TRANSACTIONS: 'r2r_transactions',
  SUMMARIES: 'r2r_summaries',
  BUDGETS: 'r2r_budgets',
  HOUSEHOLDS: 'r2r_households',
  CURRENT_USER: 'r2r_current_user'
};

const getItems = <T,>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const setItems = <T,>(key: string, items: T[]) => localStorage.setItem(key, JSON.stringify(items));

export const api = {
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER) || 'null'),
  
  updateUserStreak: (userId: string) => {
    const users = getItems<User>(DB_KEYS.USERS);
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      user.streakCount = (user.streakCount || 0) + 1;
      user.lastActiveDate = today;
      setItems(DB_KEYS.USERS, users);
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  signup: async (name: string, email: string, pass: string): Promise<User> => {
    const users = getItems<User>(DB_KEYS.USERS);
    if (users.find(u => u.email === email)) throw new Error("User already exists");
    const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, passwordHash: pass, streakCount: 1, lastActiveDate: new Date().toISOString().split('T')[0] };
    users.push(newUser);
    setItems(DB_KEYS.USERS, users);
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email: string, pass: string): Promise<User> => {
    const users = getItems<User>(DB_KEYS.USERS);
    const user = users.find(u => u.email === email && u.passwordHash === pass);
    if (!user) throw new Error("Invalid credentials");
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    api.updateUserStreak(user.id);
    return user;
  },

  logout: () => localStorage.removeItem(DB_KEYS.CURRENT_USER),

  getTransactions: (userId: string): Transaction[] => {
    const user = api.getCurrentUser();
    const all = getItems<Transaction>(DB_KEYS.TRANSACTIONS);
    if (user?.householdId) {
      return all.filter(t => t.userId === userId || t.householdId === user.householdId);
    }
    return all.filter(t => t.userId === userId);
  },

  updateTransaction: (transaction: Transaction) => {
    const all = getItems<Transaction>(DB_KEYS.TRANSACTIONS);
    const idx = all.findIndex(t => t.id === transaction.id);
    if (idx > -1) {
      all[idx] = transaction;
      setItems(DB_KEYS.TRANSACTIONS, all);
    }
  },

  ingest: async (userId: string, sourceType: string, rawText?: string, files?: File[]): Promise<void> => {
    const user = api.getCurrentUser();
    let allNewTransactions: Transaction[] = [];
    if (rawText && rawText.trim()) {
      const extracted = await processRawData(rawText, sourceType, userId);
      allNewTransactions.push(...(extracted as Transaction[]));
    }
    if (files) {
      for (const file of files) {
        const base64 = await new Promise<string>((r) => {
          const reader = new FileReader();
          reader.onload = () => r((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        const extracted = await processRawData("", 'receipt_image', userId, { inlineData: { data: base64, mimeType: file.type } });
        allNewTransactions.push(...(extracted as Transaction[]));
      }
    }
    if (allNewTransactions.length > 0) {
      const existing = getItems<Transaction>(DB_KEYS.TRANSACTIONS);
      const tagged = allNewTransactions.map(t => ({ ...t, householdId: user?.householdId }));
      setItems(DB_KEYS.TRANSACTIONS, [...existing, ...tagged]);
    }
  },

  analyze: async (userId: string, start: string, end: string): Promise<AnalysisSummary> => {
    const rangeTransactions = api.getTransactions(userId).filter(t => {
      const d = new Date(t.datetime).getTime();
      return d >= new Date(start).getTime() && d <= new Date(end).getTime();
    });
    const totalSpend = rangeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const catMap: Record<string, number> = {};
    rangeTransactions.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    const topCategories = Object.entries(catMap).map(([category, amount]) => ({
      category, amount, percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
    const { leaks, suggestions } = await generateInsights(rangeTransactions);
    const summary: AnalysisSummary = {
      id: Math.random().toString(36).substr(2, 9), userId, periodStart: start, periodEnd: end,
      totalSpend, totalTransactions: rangeTransactions.length, topCategories, leaks, suggestions, createdAt: new Date().toISOString()
    };
    const summaries = getItems<AnalysisSummary>(DB_KEYS.SUMMARIES);
    summaries.push(summary);
    setItems(DB_KEYS.SUMMARIES, summaries);
    return summary;
  },

  getLatestSummary: (userId: string) => {
    const summaries = getItems<AnalysisSummary>(DB_KEYS.SUMMARIES).filter(s => s.userId === userId);
    return summaries.length > 0 ? summaries[summaries.length - 1] : null;
  },

  getBudget: (userId: string, month: number, year: number) => getItems<Budget>(DB_KEYS.BUDGETS).find(b => b.userId === userId && b.month === month && b.year === year) || null,
  saveBudget: (budget: Budget) => {
    let budgets = getItems<Budget>(DB_KEYS.BUDGETS);
    const idx = budgets.findIndex(b => b.userId === budget.userId && b.month === budget.month && b.year === budget.year);
    if (idx > -1) budgets[idx] = budget; else budgets.push(budget);
    setItems(DB_KEYS.BUDGETS, budgets);
  },

  joinHousehold: (userId: string, householdId: string) => {
    const users = getItems<User>(DB_KEYS.USERS);
    const user = users.find(u => u.id === userId);
    if (user) {
      user.householdId = householdId;
      setItems(DB_KEYS.USERS, users);
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  getPredictedBills: async (userId: string) => {
    const tx = api.getTransactions(userId);
    return predictBills(tx);
  }
};
