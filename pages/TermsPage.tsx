
import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50">
        <Link to="/" className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6">Terms of Service</h1>
        <p className="text-slate-500 mb-8 font-medium">Agreement for using Receipt to Reality (R2R)</p>
        
        <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing R2R, you agree to be bound by these Terms. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials. You are responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3">3. AI-Generated Advice</h2>
            <p>
              R2R provides financial insights powered by AI. This does not constitute professional financial, tax, or legal advice. Always consult with a qualified professional before making significant financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3">4. Limitation of Liability</h2>
            <p>
              R2R is provided "as is" without warranties of any kind. We are not liable for any financial losses incurred based on the suggestions provided by the AI assistant.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
