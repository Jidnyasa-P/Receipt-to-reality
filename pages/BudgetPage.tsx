
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { Budget, CategoryBudget } from '../types';
import { TRANSACTION_CATEGORIES } from '../constants';

const BudgetPage: React.FC = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [overallBudget, setOverallBudget] = useState<number>(0);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(
    TRANSACTION_CATEGORIES.map(cat => ({ category: cat, amount: 0 }))
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      const existing = api.getBudget(user.id, month, year);
      if (existing) {
        setOverallBudget(existing.overallBudget);
        setCategoryBudgets(existing.categoryBudgets);
      } else {
        setOverallBudget(0);
        setCategoryBudgets(TRANSACTION_CATEGORIES.map(cat => ({ category: cat, amount: 0 })));
      }
    }
  }, [month, year]);

  const handleSave = () => {
    const user = api.getCurrentUser();
    if (!user) return;

    const budget: Budget = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      month,
      year,
      overallBudget,
      categoryBudgets
    };

    api.saveBudget(budget);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const updateCategoryBudget = (category: string, amount: number) => {
    setCategoryBudgets(prev => prev.map(cb => cb.category === category ? { ...cb, amount } : cb));
  };

  return (
    <Layout>
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Budget Planning</h2>
        <p className="text-slate-500 text-lg">Set boundaries for your monthly spending to reach your goals faster.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Month</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Year</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                >
                  {[2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Overall Monthly Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number"
                  className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  value={overallBudget}
                  onChange={(e) => setOverallBudget(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Category Budgets</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRANSACTION_CATEGORIES.map(cat => {
                  const cb = categoryBudgets.find(b => b.category === cat);
                  return (
                    <div key={cat} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <label className="block text-xs font-bold text-slate-500 mb-1">{cat}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input 
                          type="number"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={cb?.amount || 0}
                          onChange={(e) => updateCategoryBudget(cat, parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-8 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {success ? (
                <>
                  <i className="fas fa-check-circle"></i>
                  Budget Saved!
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Update Budget
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 text-indigo-50 p-8 rounded-[2rem] shadow-xl">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-bullseye text-indigo-400"></i>
              Why Budget?
            </h4>
            <p className="text-indigo-200 leading-relaxed mb-6 text-sm">
              Setting a budget is the first step toward financial freedom. Our AI uses these numbers to give you more precise "Money Leak" alerts and actionable suggestions.
            </p>
            <div className="p-4 bg-indigo-800/50 rounded-2xl border border-indigo-700/50">
               <p className="text-xs italic text-indigo-100">"A budget tells your money where to go instead of wondering where it went."</p>
            </div>
          </div>
          
          <div className="bg-emerald-50 text-emerald-900 p-8 rounded-[2rem] shadow-xl border border-emerald-100">
             <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
               <i className="fas fa-chart-pie text-emerald-500"></i>
               Balance
             </h4>
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sum of Categories</span>
                <span className="font-black">${categoryBudgets.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
             </div>
             <p className="text-[10px] text-emerald-700 font-medium">Ideally, the sum of your category budgets should match your overall monthly target.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BudgetPage;
