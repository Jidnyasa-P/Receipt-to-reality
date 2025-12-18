
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { Transaction } from '../types';

const TaxPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'business'>('business');

  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      setTransactions(api.getTransactions(user.id));
    }
  }, []);

  const toggleBusiness = (t: Transaction) => {
    const updated = { ...t, isBusiness: !t.isBusiness };
    api.updateTransaction(updated);
    setTransactions(prev => prev.map(item => item.id === t.id ? updated : item));
  };

  const exportCSV = () => {
    const businessTx = transactions.filter(t => t.isBusiness);
    const headers = "Date,Merchant,Amount,Category,Currency\n";
    const rows = businessTx.map(t => `${t.datetime},${t.merchant},${t.amount},${t.category},${t.currency}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `R2R_Tax_Export_${new Date().getFullYear()}.csv`;
    a.click();
  };

  const filtered = transactions.filter(t => filter === 'all' || t.isBusiness);
  const totalBusiness = filtered.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Tax Hub</h2>
          <p className="text-slate-500 text-lg">Identify and export tax-deductible business expenses.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <i className="fas fa-file-export"></i> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Deduction</p>
          <h3 className="text-4xl font-black text-indigo-600">${totalBusiness.toLocaleString()}</h3>
          <div className="mt-6 flex flex-col gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-bold text-sm ${filter === 'all' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              All Transactions
            </button>
            <button 
              onClick={() => setFilter('business')}
              className={`px-4 py-2 rounded-xl font-bold text-sm ${filter === 'business' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Business Only
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Merchant</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(t => (
                <tr key={t.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{t.merchant}</p>
                    <p className="text-xs text-slate-400">{t.category}</p>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">{new Date(t.datetime).toLocaleDateString()}</td>
                  <td className="px-8 py-5 font-black text-slate-900">${t.amount.toFixed(2)}</td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => toggleBusiness(t)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                        t.isBusiness ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {t.isBusiness ? 'Business' : 'Personal'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-bold italic">No business expenses found.</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TaxPage;
