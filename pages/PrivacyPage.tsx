
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50">
        <Link to="/" className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-slate-500 mb-8 font-medium">Last Updated: May 20, 2025</p>
        
        <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3">1. Information We Collect</h2>
            <p>
              We collect the information you provide directly to us, specifically receipt images, SMS text logs, and financial transactions. This data is used solely to provide you with financial insights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3">2. How We Use Data</h2>
            <p>
              Your data is processed via Google Gemini AI models. We do not sell your personal financial data to third parties. We use your data to:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Extract merchant and amount information.</li>
              <li>Categorize spending habits.</li>
              <li>Provide savings suggestions and leak alerts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3">3. Security</h2>
            <p>
              We implement industry-standard security measures to protect your information. Your transactions are stored locally in encrypted storage and processed through secure API tunnels.
            </p>
          </section>

          <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900">
            <h2 className="text-lg font-black mb-2">Our Commitment</h2>
            <p className="text-sm">
              We believe your financial data belongs to you. You can delete your account and all associated transaction history at any time from the dashboard settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
