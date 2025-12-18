
import React from 'react';
import { Link } from 'react-router-dom';

const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: "How accurate is the AI at reading messy receipts?",
      a: "Our engine uses Gemini 3 Pro, which is specifically trained for high-precision document extraction. It can even handle crumpled paper, low-light photos, and handwritten totals with over 99% accuracy."
    },
    {
      q: "Is my financial data secure?",
      a: "Yes. Your data is stored in your local browser storage and processed via secure, encrypted tunnels to Google's AI models. We do not sell your personal financial information."
    },
    {
      q: "What is a 'Household' in R2R?",
      a: "A Household allows you to sync data with a partner or roommate. By using the same Household ID, both users contribute to the same budget and transaction pool in real-time."
    },
    {
      q: "How does the Bill Predictor work?",
      a: "The AI scans your transaction history for patterns (e.g., a charge from 'Netflix' every 30 days). It then creates a forecast to remind you before the next billing cycle hits."
    },
    {
      q: "Can I export data for tax season?",
      a: "Absolutely. Our Tax Hub allows you to tag specific transactions as 'Business Expenses' and export them as a clean CSV file compatible with most accounting software."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-8 hover:gap-3 transition-all">
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </Link>
        
        <h1 className="text-5xl font-black text-slate-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-500 mb-12">Everything you need to know about Receipt to Reality.</p>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex gap-4">
                <span className="text-indigo-600">Q.</span>
                {faq.q}
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-indigo-900 rounded-[2.5rem] p-12 text-center text-white">
          <h4 className="text-2xl font-black mb-4">Still have questions?</h4>
          <p className="text-indigo-200 mb-8 font-medium">Our AI assistant is available 24/7 to help you with specific account queries.</p>
          <Link to="/chat" className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black hover:bg-indigo-50 transition-all inline-block">
            Chat with AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
