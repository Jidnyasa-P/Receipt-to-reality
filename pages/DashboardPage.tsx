
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { AnalysisSummary, User, Transaction } from '../types';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setSummary(api.getLatestSummary(currentUser.id));
    setTransactions(api.getTransactions(currentUser.id).slice(-5).reverse());
  }, [navigate]);

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900">Hey, {user?.name}! 👋</h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-slate-500 text-lg">Your finances are looking sharp.</p>
            <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-black text-xs animate-pulse">
               <i className="fas fa-fire"></i>
               {user?.streakCount || 0} DAY STREAK
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/chat')}
            className="bg-white border-2 border-slate-100 text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <i className="fas fa-robot"></i> Ask AI
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> New Receipt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-indigo-600 text-white flex items-center justify-center rounded-2xl text-2xl shadow-lg shadow-indigo-100 mb-6">
              <i className="fas fa-sack-dollar"></i>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Total Spend</p>
            <h3 className="text-4xl font-black text-slate-900">
              ${summary ? summary.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
            </h3>
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
              <i className="fas fa-calendar-alt"></i>
              {summary ? `Active: ${new Date(summary.periodStart).toLocaleDateString()} - Now` : 'No analysis generated'}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 group">
          <div className="w-14 h-14 bg-emerald-500 text-white flex items-center justify-center rounded-2xl text-2xl shadow-lg shadow-emerald-100 mb-6">
            <i className="fas fa-chart-line"></i>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Deductions Tracked</p>
          <h3 className="text-4xl font-black text-slate-900">
            ${transactions.filter(t => t.isBusiness).reduce((s,t) => s + t.amount, 0).toFixed(2)}
          </h3>
          <p className="text-xs text-slate-400 mt-4 italic">Available for tax export</p>
        </div>

        <div className="bg-indigo-900 p-8 rounded-[2rem] shadow-xl shadow-indigo-100 flex flex-col justify-between text-white">
          <div>
             <h4 className="text-xl font-bold mb-2">Household Status</h4>
             <p className="text-indigo-200 text-sm leading-relaxed mb-6">
               {user?.householdId ? `Sharing with Household ${user.householdId}` : 'Share your budget with a partner.'}
             </p>
          </div>
          <button
            onClick={() => navigate('/household')}
            className="w-full py-3 bg-white text-indigo-900 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-indigo-50 transition-all shadow-lg"
          >
            {user?.householdId ? 'Manage Shared' : 'Setup Household'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 p-8">
          <div className="flex justify-between items-center mb-8">
             <h4 className="text-2xl font-black text-slate-900">Recent Activity</h4>
             <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase">Live Feed</span>
          </div>
          <div className="space-y-6">
            {transactions.length > 0 ? transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                    t.category === 'Food & Delivery' ? 'bg-orange-100 text-orange-600' :
                    t.category === 'Groceries' ? 'bg-emerald-100 text-emerald-600' :
                    t.category === 'Subscriptions' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <i className={`fas ${
                      t.category === 'Food & Delivery' ? 'fa-burger' :
                      t.category === 'Groceries' ? 'fa-shopping-basket' :
                      t.category === 'Subscriptions' ? 'fa-tv' :
                      'fa-tag'
                    }`}></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.merchant}</h5>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{t.category} • {new Date(t.datetime).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">${t.amount.toFixed(2)}</p>
                  {t.isBusiness && <span className="text-[8px] font-black text-emerald-500 uppercase">BUSINESS</span>}
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-slate-400 italic">No transactions detected. Upload a receipt to start tracking!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 p-8">
          <h4 className="text-2xl font-black text-slate-900 mb-8">Milestones</h4>
          <div className="grid grid-cols-2 gap-4">
             <div className={`p-6 rounded-3xl border-2 ${user?.streakCount && user.streakCount >= 7 ? 'border-indigo-200 bg-indigo-50' : 'border-slate-50 bg-slate-50 opacity-40'}`}>
                <i className="fas fa-calendar-check text-2xl text-indigo-500 mb-2"></i>
                <h5 className="font-black text-slate-900 text-sm">Week Warrior</h5>
                <p className="text-[10px] text-slate-500">Track 7 days in a row</p>
             </div>
             <div className={`p-6 rounded-3xl border-2 ${transactions.length >= 10 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-50 bg-slate-50 opacity-40'}`}>
                <i className="fas fa-receipt text-2xl text-emerald-500 mb-2"></i>
                <h5 className="font-black text-slate-900 text-sm">Paperless Hero</h5>
                <p className="text-[10px] text-slate-500">Upload 10 receipts</p>
             </div>
             <div className={`p-6 rounded-3xl border-2 ${summary ? 'border-purple-200 bg-purple-50' : 'border-slate-50 bg-slate-50 opacity-40'}`}>
                <i className="fas fa-brain text-2xl text-purple-500 mb-2"></i>
                <h5 className="font-black text-slate-900 text-sm">Insight Seeker</h5>
                <p className="text-[10px] text-slate-500">Run first AI analysis</p>
             </div>
             <div className={`p-6 rounded-3xl border-2 ${transactions.filter(t => t.isBusiness).length > 0 ? 'border-blue-200 bg-blue-50' : 'border-slate-50 bg-slate-50 opacity-40'}`}>
                <i className="fas fa-file-invoice-dollar text-2xl text-blue-500 mb-2"></i>
                <h5 className="font-black text-slate-900 text-sm">Tax Optimizer</h5>
                <p className="text-[10px] text-slate-500">Tag first business cost</p>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
