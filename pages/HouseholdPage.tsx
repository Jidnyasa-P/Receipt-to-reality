
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { User } from '../types';

const HouseholdPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [householdId, setHouseholdId] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const u = api.getCurrentUser();
    setUser(u);
    if (u?.householdId) setJoined(true);
  }, []);

  const handleJoin = () => {
    if (!user || !householdId) return;
    api.joinHousehold(user.id, householdId);
    setJoined(true);
  };

  const handleLeave = () => {
    if (!user) return;
    api.joinHousehold(user.id, '');
    setJoined(false);
    setHouseholdId('');
  };

  return (
    <Layout>
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Household Sharing</h2>
        <p className="text-slate-500 text-lg">Sync budgets and receipts with your family or partner.</p>
      </div>

      <div className="max-w-2xl bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 text-center">
        {joined ? (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl mx-auto">
               <i className="fas fa-users"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Linked Household</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">ID: {user?.householdId}</p>
            </div>
            <p className="text-slate-500 leading-relaxed">
              You are now viewing shared transactions and budgets. Any receipt you upload will be visible to members of this household ID.
            </p>
            <button 
              onClick={handleLeave}
              className="px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all"
            >
              Leave Household
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-4xl mx-auto">
               <i className="fas fa-user-plus"></i>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Join a Household</h3>
              <p className="text-slate-500">Enter a unique ID to link with someone else. All transactions will be merged in real-time.</p>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="Ex: SMITH_RESIDENCE_2025"
                value={householdId}
                onChange={(e) => setHouseholdId(e.target.value)}
              />
              <button 
                onClick={handleJoin}
                disabled={!householdId}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                Sync Data
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HouseholdPage;
