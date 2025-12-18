
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { BillPrediction } from '../types';

const BillsPage: React.FC = () => {
  const [bills, setBills] = useState<BillPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const user = api.getCurrentUser();
      if (user) {
        const preds = await api.getPredictedBills(user.id);
        setBills(preds);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Layout>
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Bill Predictor</h2>
        <p className="text-slate-500 text-lg">AI-detected recurring payments and upcoming obligations.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <i className="fas fa-circle-notch fa-spin text-4xl text-indigo-500 mb-4"></i>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning transactions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 p-3 ${bill.isSubscription ? 'text-purple-500' : 'text-indigo-500'}`}>
                <i className={`fas ${bill.isSubscription ? 'fa-tv' : 'fa-file-invoice'}`}></i>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {bill.frequency} {bill.isSubscription ? 'Subscription' : 'Bill'}
              </p>
              <h4 className="text-xl font-black text-slate-900 mb-4">{bill.merchant}</h4>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-indigo-600">${bill.estimatedAmount.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">Due around {new Date(bill.nextExpectedDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                   <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                      <div className="bg-indigo-500 h-full" style={{ width: `${bill.confidence * 100}%` }}></div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400">CONFIDENCE</p>
                </div>
              </div>
            </div>
          ))}
          {bills.length === 0 && (
            <div className="col-span-full bg-slate-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
               <h4 className="text-xl font-black text-slate-400">No recurring patterns found yet.</h4>
               <p className="text-slate-400">Upload more receipts to train the predictor.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default BillsPage;
