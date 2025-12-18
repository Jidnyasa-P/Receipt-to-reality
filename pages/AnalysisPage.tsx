
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { AnalysisSummary, Budget } from '../types';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const AnalysisPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchAnalysis = async () => {
    const user = api.getCurrentUser();
    if (!user) return;
    setLoading(true);
    try {
      const result = await api.analyze(user.id, dateRange.start, dateRange.end);
      setSummary(result);
      
      // Fetch budget for the start of the period
      const startDate = new Date(dateRange.start);
      const b = api.getBudget(user.id, startDate.getMonth(), startDate.getFullYear());
      setBudget(b);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please ensure your API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      const last = api.getLatestSummary(user.id);
      if (last) {
        setSummary(last);
        const startDate = new Date(last.periodStart);
        const b = api.getBudget(user.id, startDate.getMonth(), startDate.getFullYear());
        setBudget(b);
      }
    }
  }, []);

  const getUsageColor = (actual: number, budgetAmount: number) => {
    if (budgetAmount <= 0) return 'text-slate-400';
    const percent = (actual / budgetAmount) * 100;
    if (percent < 80) return 'text-emerald-500';
    if (percent <= 100) return 'text-orange-500';
    return 'text-rose-500';
  };

  const getBgUsageColor = (actual: number, budgetAmount: number) => {
    if (budgetAmount <= 0) return 'bg-slate-200';
    const percent = (actual / budgetAmount) * 100;
    if (percent < 80) return 'bg-emerald-500';
    if (percent <= 100) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <Layout>
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">AI Intelligence</h2>
          <p className="text-slate-500 text-lg">Detailed spending analytics and actionable savings advice.</p>
        </div>
        <div className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-3xl shadow-lg border border-slate-100">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period Start</label>
            <input
              type="date"
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period End</label>
            <input
              type="date"
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-brain"></i>}
            {loading ? 'Processing' : 'Analyze'}
          </button>
        </div>
      </div>

      {!summary && !loading ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-400 flex items-center justify-center rounded-3xl mx-auto mb-6 text-4xl">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Ready for Insights?</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Define your date range above and our AI will comb through your receipts to find savings opportunities.
          </p>
          <button onClick={fetchAnalysis} className="text-indigo-600 font-black hover:underline uppercase text-sm tracking-widest">Generate Report Now &rarr;</button>
        </div>
      ) : (
        <div className={`transition-all duration-500 ${loading ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100 blur-0'}`}>
          {/* Budget vs Actual Section */}
          <div className="mb-12">
            <h4 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <i className="fas fa-piggy-bank text-indigo-500"></i>
              Budget vs Actual
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
               <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Overall Progress</p>
                  <h3 className={`text-4xl font-black mb-2 ${getUsageColor(summary?.totalSpend || 0, budget?.overallBudget || 0)}`}>
                    ${summary?.totalSpend.toLocaleString()}
                  </h3>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mt-4">
                     <div 
                        className={`h-full rounded-full transition-all duration-1000 ${getBgUsageColor(summary?.totalSpend || 0, budget?.overallBudget || 0)}`}
                        style={{ width: `${Math.min(100, ((summary?.totalSpend || 0) / (budget?.overallBudget || 1)) * 100)}%` }}
                     />
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                     <span>SPENT</span>
                     <span>BUDGET: ${budget?.overallBudget.toLocaleString() || '0'}</span>
                  </div>
               </div>

               <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                             <th className="pb-3">Category</th>
                             <th className="pb-3">Budget</th>
                             <th className="pb-3">Actual</th>
                             <th className="pb-3">% Used</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {budget?.categoryBudgets.map((cb) => {
                             const actual = summary?.topCategories.find(tc => tc.category === cb.category)?.amount || 0;
                             const percent = cb.amount > 0 ? (actual / cb.amount) * 100 : 0;
                             return (
                               <tr key={cb.category} className="text-sm">
                                  <td className="py-3 font-bold text-slate-900">{cb.category}</td>
                                  <td className="py-3 font-medium text-slate-500">${cb.amount.toLocaleString()}</td>
                                  <td className="py-3 font-black text-slate-900">${actual.toLocaleString()}</td>
                                  <td className={`py-3 font-black ${getUsageColor(actual, cb.amount)}`}>
                                     {percent.toFixed(0)}%
                                  </td>
                               </tr>
                             )
                          })}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50">
              <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Spend Distribution
              </h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary?.topCategories}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {summary?.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50">
              <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Spending Benchmarks
              </h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary?.topCategories.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" fontSize={10} axisLine={false} tickLine={false} fontWeight="bold" />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} fontWeight="bold" />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <section>
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                   <i className="fas fa-faucet-drip text-rose-500"></i>
                   Money Leaks
                 </h4>
                 <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">POTENTIAL WASTE</span>
              </div>
              <div className="space-y-5">
                {summary?.leaks && summary.leaks.length > 0 ? summary.leaks.map((leak, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border-l-8 border-rose-500 shadow-xl shadow-rose-100/20 flex justify-between items-center gap-6 hover:translate-x-2 transition-transform">
                    <div className="flex-1">
                      <h5 className="font-black text-slate-900 text-lg mb-1">{leak.title}</h5>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{leak.description}</p>
                    </div>
                    <div className="bg-rose-50 px-4 py-2 rounded-2xl text-center min-w-[100px]">
                      <span className="text-rose-600 font-black text-lg">-${leak.amount}</span>
                      <p className="text-[10px] text-rose-400 font-bold uppercase">MONTHLY</p>
                    </div>
                  </div>
                )) : (
                  <div className="bg-slate-50 p-10 rounded-[2rem] text-center border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No significant leaks detected! Nice work.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                   <i className="fas fa-wand-magic-sparkles text-indigo-500"></i>
                   AI Suggestions
                 </h4>
                 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">OPPORTUNITIES</span>
              </div>
              <div className="space-y-5">
                {summary?.suggestions && summary.suggestions.length > 0 ? summary.suggestions.map((sug, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-indigo-100 shadow-xl shadow-indigo-100/20 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                       <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">SAVE ${sug.estimatedMonthlySaving}/MO</div>
                    </div>
                    <h5 className="font-black text-slate-900 text-lg mb-2 pr-20">{sug.action}</h5>
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                       <p className="text-sm text-indigo-900 font-semibold leading-relaxed italic">" {sug.rationale} "</p>
                    </div>
                  </div>
                )) : (
                  <div className="bg-slate-50 p-10 rounded-[2rem] text-center border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">Gather more data to unlock personalized suggestions.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AnalysisPage;
